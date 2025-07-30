import { GoogleGenerativeAI } from "@google/generative-ai";
import * as logger from "firebase-functions/logger";
import { onRequest } from "firebase-functions/v2/https";
import { defineString } from "firebase-functions/params";

const geminiKey = defineString("GEMINI_KEY");

/**
 * Erzeugt einen hochspezialisierten, mehrsprachigen Prompt für ein LLM.
 * @param hebrewText Der hebräische Originaltext der Halacha.
 * @param targetLanguage Die Zielsprache für die Zusammenfassung (z.B. "Deutsch", "English").
 * @returns Einen vollständig formatierten String, der als Prompt für die Gemini API dient.
 */
const createHalachaPrompt = (hebrewText: string, targetLanguage: string): string => `
### Rolle:
Du bist ein hochpräziser Bot zur Analyse von Fachtexten. Deine Aufgabe ist es, hebräische halachische Texte zu verarbeiten und das Ergebnis ausschließlich in einem strukturierten JSON-Format zurückzugeben.

### Aufgabe:
Analysiere den folgenden hebräischen halachischen Text und gib das Ergebnis **ausschließlich als einzelnes, valides JSON-Objekt** zurück. Die Antwort darf **keine** Markdown-Code-Block-Markierungen wie \`\`\`json oder \`\`\` enthalten, sondern muss direkt mit \`{\` beginnen und mit \`}\` enden.
Die gesamte Analyse im "summary"-Feld muss in der folgenden Sprache verfasst sein: **${targetLanguage}**.

### JSON-Struktur:
{
  "id": "NUMBER_STRING",
  "summary": "MARKDOWN_STRING",
  "original": "HEBREW_STRING",
  "language": "TARGET_LANGUAGE_STRING"
}
-   \`id\`: Die Halacha-Nummer als String, extrahiert aus dem Eingabetext.
-   \`summary\`: Ein einzelner String, der die vollständige, deutsche Analyse in Markdown-Formatierung enthält.
-   \`original\`: Der vollständige, unveränderte hebräische Originaltext.
-   \`language\`: Die Sprache, in der die Zusammenfassung verfasst wurde (z.B. "Deutsch", "English").

### Anweisungen für den Inhalt des "summary"-Feldes:
-   **Einleitung und Start:** Beginne die Zusammenfassung **direkt mit der leitenden Frage**, unmittelbar nach dem Titel. Schreibe **keinen** separaten Einleitungsabsatz.
-   **Tonalität und Perspektive:**
    -   Verwende durchgehend eine **direkte, inhaltliche Tonalität**. Berichte *über die halachischen Argumente*, nicht *über den Text, der die Argumente enthält*.
    -   **Vermeide explizit Meta-Formulierungen** wie: „Der Text argumentiert...“, „Diese Analyse zeigt...“, „Der Autor schreibt...“.
-   **Struktur:** Gliedere die Zusammenfassung **logisch, linear und faktenbasiert**.
-   **Fokus auf Hervorgehobenes:** Behandle Textpassagen, die im Originaltext mit Sternchen \`*[...]*\` hervorgehoben sind, als die Kernaussagen und stelle sicher, dass diese den Schwerpunkt der Zusammenfassung bilden.
-   **Quellen:** Sei bei der Verwendung von Fußnoten sehr zurückhaltend (nur 2-4 der wichtigsten). Markiere relevante Aussagen mit einer hochgestellten Fußnotenzahl (z.B. ¹). Erstelle am Ende einen Abschnitt \`**Quellen**\` mit einer einfachen Liste reiner Zitationen.
-   **Konzepte:** Erstelle ganz am Ende einen Abschnitt \`**relevante Halachische Konzepte**\`. Jeder Eintrag soll eine kurze, aber vollständige pädagogische Erklärung enthalten.

### Stil- und Formatierungsrichtlinien (für den "summary"-String in Markdown):
-   **Titel:** Der Titel muss dem Format folgen: \`**Halachische Betrachtung {Nummer}: Beschreibender Untertitel**\`. Extrahiere die \`{Nummer}\` aus dem Eingabetext.
-   **Hervorhebung:**
    -   Verwende **Fettdruck** (\`**Wort**\`) für Titel, leitende Fragen sowie für mehrere **wichtige Momente, Kernaussagen und die finale praktische Schlussfolgerung**.
    -   Verwende *Kursivschrift* (\`*Wort*\`) für hebräische Fachbegriffe im Text, die gesamten Zitationen im Quellenverzeichnis sowie die Begriffe in der Konzeptliste.
-   **Struktur-Überschriften:** Die Überschriften der Abschlusssektionen lauten \`**Quellen**\` und \`**relevante Halachische Konzepte**\`.

### Glossar für Einzelbegriffe und Transliteration:
**Wichtiger Hinweis:** Die folgenden Glossare sind auf Deutsch. Deine Aufgabe ist es, diese Begriffe und Phrasen korrekt in die Zielsprache (**${targetLanguage}**) zu übersetzen und in deiner Ausgabe zu verwenden.
-   **Transliteration:** Nutze eine passende Transkription für die Zielsprache (z.B. deutsch: sch, z, j).
-   \`*Borer* (בורר)\` → Verwende im Fließtext das Wort „Sortieren“.
-   \`פסולת\` (Pesolet) → *das Unbrauchbare*
-   \`חייב\` (Chajaw) → *schuldig*
-   \`בהיתר\` (b'Heter) → *in zulässiger Weise*
-   \`חומרא\` (Chumra) → **die Strenge / die Schwere**
-   \`לא מיירי אלא\` (lo mairi ella) → *Dies bezieht sich nur auf...*
-   **Gott →** Schreibe den Namen G-ttes immer als „G-tt“.

### Glossar für wiederkehrende Phrasen:
-   \`ארבעה צריכין להודות\` → Vier sind zum Danken verpflichtet
-   \`חולה שנתרפא\` → Ein Kranker, der geheilt wurde
-   \`חולה שנפל למטה / מוטל במטה\` → Ein Kranker, der ans Bett gefesselt war
-   \`עלה למטה וירד\` → Ans Bett gefesselt wurde und wieder aufstand
-   \`חולי שיש בו סכנה\` → Eine Krankheit, die mit Lebensgefahr verbunden ist
-   \`מכה של חלל\` → Eine lebensbedrohliche Wunde/Krankheit
-   \`כל החולים בחזקת סכנה\` → Alle Kranken haben den Status potenzieller Gefahr
-   \`מוטל במטה יותר מג' ימים\` → Mehr als drei Tage ans Bett gefesselt sein

### EINGABE (Hebräischer Text):
${hebrewText}
`;

// Die exportierte Cloud Function bleibt in ihrer Logik unverändert,
// sie ruft lediglich die oben definierte, nun korrekte Prompt-Funktion auf.
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

    // **ÄNDERUNG HIER: `targetLanguage` wird aus dem Body ausgelesen**
    const { hebrewText, targetLanguage = "Deutsch" } = request.body; // Setzt "Deutsch" als Standard

    if (!hebrewText) {
      logger.error("Fehlender hebrewText im Request Body.", { body: request.body });
      response.status(400).json({
        error: "hebrewText ist ein erforderliches Feld."
      });
      return;
    }

    const fullPrompt = createHalachaPrompt(hebrewText, targetLanguage);
    
    logger.info(`Starte Gemini API Anfrage für Sprache: ${targetLanguage}...`);

    try {
      const genAI = new GoogleGenerativeAI(geminiKey.value());
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-pro-latest",
        generationConfig: {
          temperature: 0.1,
          topP: 0.8,
          topK: 40,
        }
      });

      const result = await model.generateContent(fullPrompt);
      const jsonResponseString = result.response.text();
      
      try {
        const parsedResponse = JSON.parse(jsonResponseString);
        
        // **ÄNDERUNG HIER: Sprache wird zur Antwort hinzugefügt**
        // (Das Modell sollte dies bereits tun, aber wir stellen es hier sicher)
        if (!parsedResponse.language) {
          parsedResponse.language = targetLanguage;
        }

        logger.info(`Erfolgreich eine valide JSON-Antwort erhalten für Sprache: ${targetLanguage}.`);
        response.status(200).json(parsedResponse);
      } catch (parseError) {
        logger.error("Modell hat eine ungültige JSON-Zeichenkette zurückgegeben.", { rawResponse: jsonResponseString });
        response.status(500).json({ error: "Die Antwort des Modells konnte nicht verarbeitet werden." });
      }

    } catch (apiError) {
      logger.error("Fehler bei der Kommunikation mit der Gemini API.", { errorMessage: (apiError as Error).message });
      response.status(500).json({ error: "Die Zusammenfassung konnte nicht generiert werden." });
    }
  }
);