import { GoogleGenerativeAI } from "@google/generative-ai";
import * as logger from "firebase-functions/logger";
import { onRequest } from "firebase-functions/v2/https";
import { defineString } from "firebase-functions/params";
import { createHalachaPrompt, createConciseHalachaPrompt, createFullTranslationPrompt } from "./prompts";
import { TranslationLevel, isTranslationLevel, listHalachaNumbers, listTranslations as loadTranslationList, loadOriginal, loadTranslation, saveOriginal, saveTranslation } from "./halacha-store";

const geminiKey = defineString("GEMINI_KEY");
const GEMINI_MODEL = "gemini-pro-latest";

function errorMessage(reason: unknown): string {
  return reason instanceof Error ? reason.message : String(reason);
}

interface SummaryRequest {
  hebrewText: string | undefined;
  targetLanguage: string;
  halachaNumber: number;
  level: TranslationLevel;
  forceRegenerate: boolean;
}

interface SummaryRequestBody {
  hebrewText?: unknown;
  targetLanguage?: unknown;
  halachaNumber?: unknown;
  level?: unknown;
  isAdvancedLevel?: unknown;
  forceRegenerate?: unknown;
}

const promptForLevel: Record<TranslationLevel, (hebrewText: string, targetLanguage: string, halachaNumber: string) => string> = {
  advanced: createHalachaPrompt,
  concise: createConciseHalachaPrompt,
  full: createFullTranslationPrompt,
};

/**
 * Loest die angeforderte Uebersetzungsstufe auf. `level` ist der aktuelle Vertrag;
 * der boolesche `isAdvancedLevel` ist der Alt-Vertrag und bleibt unterstuetzt,
 * damit bereits ausgelieferte Clients weiterhin funktionieren.
 */
function parseLevel(level: unknown, isAdvancedLevel: unknown): TranslationLevel {
  if (level !== undefined) {
    if (!isTranslationLevel(level)) {
      throw new Error(`level muss "advanced", "concise" oder "full" sein. Got: ${String(level)}`);
    }
    return level;
  }
  if (isAdvancedLevel === undefined) {
    return "advanced";
  }
  if (typeof isAdvancedLevel !== "boolean") {
    throw new Error(`isAdvancedLevel muss ein Boolean sein. Got: ${typeof isAdvancedLevel}`);
  }
  return isAdvancedLevel ? "advanced" : "concise";
}

function parseSummaryRequest(body: SummaryRequestBody): SummaryRequest {
  const { hebrewText, targetLanguage = "Deutsch", halachaNumber, level, isAdvancedLevel, forceRegenerate = false } = body;

  if (hebrewText !== undefined && (typeof hebrewText !== "string" || hebrewText.length === 0)) {
    throw new Error(`hebrewText muss ein nicht-leerer String sein. Got: ${typeof hebrewText}`);
  }
  const parsedHalachaNumber = Number(halachaNumber);
  if (!Number.isInteger(parsedHalachaNumber) || parsedHalachaNumber <= 0) {
    throw new Error("halachaNumber ist ein erforderliches Feld.");
  }
  if (typeof targetLanguage !== "string" || targetLanguage.length === 0) {
    throw new Error(`targetLanguage muss ein nicht-leerer String sein. Got: ${typeof targetLanguage}`);
  }
  if (typeof forceRegenerate !== "boolean") {
    throw new Error(`forceRegenerate muss ein Boolean sein. Got: ${typeof forceRegenerate}`);
  }

  return {
    hebrewText,
    targetLanguage,
    halachaNumber: parsedHalachaNumber,
    level: parseLevel(level, isAdvancedLevel),
    forceRegenerate,
  };
}


export const listTranslations = onRequest(
  {
    cors: true,
    region: "europe-west1",
  },
  async (request, response) => {
    if (request.method !== "GET") {
      response.setHeader("Allow", "GET");
      response.status(405).send("Method Not Allowed");
      return;
    }

    try {
      const translations = await loadTranslationList();
      response.status(200).json({ translations, count: translations.length });
    } catch (listError) {
      logger.error("[Firebase Function] Listing translations failed.", { errorMessage: errorMessage(listError) });
      response.status(500).json({ error: "Die Übersetzungsliste konnte nicht geladen werden." });
    }
  }
);

export const listHalachot = onRequest(
  {
    cors: true,
    region: "europe-west1",
  },
  async (request, response) => {
    if (request.method !== "GET") {
      response.setHeader("Allow", "GET");
      response.status(405).send("Method Not Allowed");
      return;
    }

    try {
      const halachaNumbers = await listHalachaNumbers();
      response.status(200).json({ halachaNumbers, count: halachaNumbers.length });
    } catch (listError) {
      logger.error("[Firebase Function] Listing halachot failed.", { errorMessage: errorMessage(listError) });
      response.status(500).json({ error: "Die Halacha-Liste konnte nicht geladen werden." });
    }
  }
);

export const getHalachaSummary = onRequest(
  {
    cors: true,
    region: "europe-west1",
    memory: "1GiB",
    timeoutSeconds: 540
  },
  async (request, response) => {
    if (request.method !== "POST") {
      response.setHeader("Allow", "POST");
      response.status(405).send("Method Not Allowed");
      return;
    }

    let summaryRequest: SummaryRequest;
    try {
      summaryRequest = parseSummaryRequest(request.body);
    } catch (validationError) {
      logger.error("Ungültiger Request Body.", { body: request.body, reason: errorMessage(validationError) });
      response.status(400).json({ error: errorMessage(validationError) });
      return;
    }

    const { targetLanguage, halachaNumber, level, forceRegenerate } = summaryRequest;

    logger.info("[Firebase Function] Request received:", {
      targetLanguage,
      halachaNumber,
      textLength: summaryRequest.hebrewText?.length,
      level,
    });

    let hebrewText = summaryRequest.hebrewText;
    if (hebrewText === undefined) {
      try {
        const original = await loadOriginal(halachaNumber);
        if (original === null) {
          response.status(404).json({
            error: `Kein Originaltext für Halacha ${halachaNumber} gefunden. hebrewText ist erforderlich.`
          });
          return;
        }
        hebrewText = original;
      } catch (originalError) {
        logger.error("[Firebase Function] Loading original text failed.", {
          halachaNumber,
          reason: errorMessage(originalError),
        });
        response.status(500).json({ error: "Der Originaltext konnte nicht geladen werden." });
        return;
      }
    }

    if (!forceRegenerate) {
      try {
        const cachedSummary = await loadTranslation(halachaNumber, targetLanguage, level);
        if (cachedSummary !== null) {
          logger.info("[Firebase Function] Returning cached translation.", { halachaNumber, targetLanguage, level });
          response.status(200).json({ summary: cachedSummary, hebrewText, cached: true, persisted: true });
          return;
        }
      } catch (cacheError) {
        logger.error("[Firebase Function] Cache lookup failed, generating fresh translation.", {
          halachaNumber,
          targetLanguage,
          reason: errorMessage(cacheError),
        });
      }
    }

    const fullPrompt = promptForLevel[level](hebrewText, targetLanguage, String(halachaNumber));

    logger.info(`[Firebase Function] Starting Gemini API request for language: ${targetLanguage} with ${level.toUpperCase()} prompt...`);

    try {
      const genAI = new GoogleGenerativeAI(geminiKey.value());
      const model = genAI.getGenerativeModel({
        model: GEMINI_MODEL,
        generationConfig: {
          responseMimeType: "text/plain",
          temperature: 0.1,
          topP: 0.8,
          topK: 40,
        }
      });

      const result = await model.generateContent(fullPrompt);
      const summary = result.response.text();

      logger.info(`[Firebase Function] Successfully received summary for language: ${targetLanguage}.`, {
        summaryLength: summary.length
      });

      const [originalResult, ...translationResults] = await Promise.allSettled([
        saveOriginal(halachaNumber, hebrewText),
        saveTranslation({
          halachaNumber,
          language: targetLanguage,
          level,
          summary,
          model: GEMINI_MODEL,
        }),
      ]);
      const persistenceResults = [originalResult, ...translationResults];

      if (originalResult.status === "fulfilled" && originalResult.value === "unparseable") {
        logger.warn("[Firebase Function] Original text was not stored: it does not parse into a halacha record.", {
          halachaNumber,
          textLength: hebrewText.length,
        });
      }

      const persisted = persistenceResults.every((result) => result.status === "fulfilled");
      persistenceResults
        .filter((result): result is PromiseRejectedResult => result.status === "rejected")
        .forEach((result) => {
          logger.error("[Firebase Function] Firestore persistence failed.", {
            halachaNumber,
            targetLanguage,
            reason: errorMessage(result.reason),
          });
        });

      response.status(200).json({ summary, hebrewText, cached: false, persisted });

    } catch (apiError) {
      logger.error("[Firebase Function] Error communicating with Gemini API.", { errorMessage: errorMessage(apiError) });
      response.status(500).json({ error: "Die Zusammenfassung konnte nicht generiert werden." });
    }
  }
);
