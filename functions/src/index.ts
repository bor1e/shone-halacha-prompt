import { GoogleGenerativeAI } from "@google/generative-ai";
import * as logger from "firebase-functions/logger";
import { onRequest } from "firebase-functions/v2/https";
import { defineString } from "firebase-functions/params";
import { createHalachaPrompt } from "./prompts";

const geminiKey = defineString("GEMINI_KEY");


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

    const { hebrewText, targetLanguage = "Deutsch", halachaNumber } = request.body;

    logger.info("[Firebase Function] Request received:", {
      targetLanguage,
      halachaNumber,
      textLength: hebrewText?.length || 0,
      requestBody: request.body
    });

    if (!hebrewText || !halachaNumber) {
      logger.error("Fehlende Daten im Request Body.", { body: request.body });
      response.status(400).json({
        error: "hebrewText und halachaNumber sind erforderliche Felder."
      });
      return;
    }

    const fullPrompt = createHalachaPrompt(hebrewText, targetLanguage, halachaNumber);

    logger.info(`[Firebase Function] Starting Gemini API request for language: ${targetLanguage}...`);

    try {
      const genAI = new GoogleGenerativeAI(geminiKey.value());
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-pro",
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

      response.status(200).json({ summary });

    } catch (apiError) {
      logger.error("[Firebase Function] Error communicating with Gemini API.", { errorMessage: (apiError as Error).message });
      response.status(500).json({ error: "Die Zusammenfassung konnte nicht generiert werden." });
    }
  }
);
