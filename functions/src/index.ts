import { GoogleGenerativeAI } from "@google/generative-ai";
import * as logger from "firebase-functions/logger";
import { onRequest } from "firebase-functions/v2/https";
import { defineString } from "firebase-functions/params";
import { createHalachaPrompt, createConciseHalachaPrompt } from "./prompts";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const geminiKey = defineString("GEMINI_KEY");

// Initialize Firebase Admin
initializeApp();
const db = getFirestore();


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

    const { hebrewText, targetLanguage = "Deutsch", halachaNumber, isAdvancedLevel } = request.body;

    // Debug the isAdvancedLevel value
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

    // Determine which prompt to use with proper fallback
    const useAdvancedLevel = isAdvancedLevel === undefined ? true : Boolean(isAdvancedLevel);

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

      // Save original halacha to Firestore (using halachaNumber as document ID)
      try {
        const halachaDoc = {
          halachaNumber,
          hebrewText,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        await db.collection("halachot").doc(halachaNumber.toString()).set(halachaDoc, { merge: true });
        logger.info(`[Firebase Function] Original halacha saved to Firestore with ID: ${halachaNumber}`);
      } catch (firestoreError) {
        logger.error("[Firebase Function] Error saving original halacha to Firestore:", {
          errorMessage: (firestoreError as Error).message
        });
        // Continue execution even if Firestore save fails
      }

      // Save summary to Firestore
      try {
        const summaryDoc = {
          halachaNumber,
          summary,
          language: targetLanguage,
          isAdvancedLevel: useAdvancedLevel,
          createdAt: new Date()
        };

        const summaryRef = await db.collection("halacha-summaries").add(summaryDoc);
        logger.info(`[Firebase Function] Summary saved to Firestore with ID: ${summaryRef.id}`);
      } catch (firestoreError) {
        logger.error("[Firebase Function] Error saving summary to Firestore:", {
          errorMessage: (firestoreError as Error).message
        });
        // Continue execution even if Firestore save fails
      }

      response.status(200).json({ summary });

    } catch (apiError) {
      logger.error("[Firebase Function] Error communicating with Gemini API.", { errorMessage: (apiError as Error).message });
      response.status(500).json({ error: "Die Zusammenfassung konnte nicht generiert werden." });
    }
  }
);
