import { GoogleGenerativeAI } from "@google/generative-ai";
import * as logger from "firebase-functions/logger";
import { onRequest } from "firebase-functions/v2/https";
import { defineString } from "firebase-functions/params";
import { createHalachaPrompt, createConciseHalachaPrompt } from "./prompts";
import { loadTranslation, saveOriginal, saveTranslation } from "./halacha-store";

const geminiKey = defineString("GEMINI_KEY");
const GEMINI_MODEL = "gemini-pro-latest";

function errorMessage(reason: unknown): string {
  return reason instanceof Error ? reason.message : String(reason);
}


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

    const { hebrewText, targetLanguage = "Deutsch", halachaNumber, isAdvancedLevel, forceRegenerate } = request.body;

    logger.info("[Firebase Function] Request received:", {
      targetLanguage,
      halachaNumber,
      textLength: hebrewText?.length || 0,
      isAdvancedLevel: isAdvancedLevel,
      isAdvancedLevelType: typeof isAdvancedLevel,
      requestBody: request.body
    });

    if (!hebrewText || !halachaNumber) {
      logger.error("Fehlende Daten im Request Body.", { body: request.body });
      response.status(400).json({
        error: "hebrewText und halachaNumber sind erforderliche Felder."
      });
      return;
    }

    const useAdvancedLevel = isAdvancedLevel === undefined ? true : Boolean(isAdvancedLevel);
    const level = useAdvancedLevel ? "advanced" : "concise";

    if (!forceRegenerate) {
      try {
        const cachedSummary = await loadTranslation(Number(halachaNumber), targetLanguage, level);
        if (cachedSummary !== null) {
          logger.info("[Firebase Function] Returning cached translation.", { halachaNumber, targetLanguage, level });
          response.status(200).json({ summary: cachedSummary, cached: true, persisted: true });
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

    logger.info("[Firebase Function] Prompt level decision:", {
      isAdvancedLevel: isAdvancedLevel,
      useAdvancedLevel: useAdvancedLevel,
      promptType: useAdvancedLevel ? "ADVANCED" : "CONCISE"
    });

    const fullPrompt = useAdvancedLevel
      ? createHalachaPrompt(hebrewText, targetLanguage, halachaNumber)
      : createConciseHalachaPrompt(hebrewText, targetLanguage, halachaNumber);

    logger.info(`[Firebase Function] Starting Gemini API request for language: ${targetLanguage} with ${useAdvancedLevel ? "ADVANCED" : "CONCISE"} prompt...`);

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
        summaryLength: summary?.length || 0
      });

      const persistenceResults = await Promise.allSettled([
        saveOriginal(Number(halachaNumber), hebrewText),
        saveTranslation({
          halachaNumber: Number(halachaNumber),
          language: targetLanguage,
          level,
          summary,
          model: GEMINI_MODEL,
        }),
      ]);

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

      response.status(200).json({ summary, cached: false, persisted });

    } catch (apiError) {
      logger.error("[Firebase Function] Error communicating with Gemini API.", { errorMessage: errorMessage(apiError) });
      response.status(500).json({ error: "Die Zusammenfassung konnte nicht generiert werden." });
    }
  }
);
