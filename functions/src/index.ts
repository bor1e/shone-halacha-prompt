import { GoogleGenerativeAI } from "@google/generative-ai";
import * as logger from "firebase-functions/logger";
import { onRequest } from "firebase-functions/v2/https";
import { defineString } from "firebase-functions/params";

const geminiKey = defineString("GEMINI_KEY");

/**
 * Erzeugt einen hochspezialisierten Prompt für ein LLM, um eine hebräische halachische Analyse
 * als strukturierte, analytische Markdown-Datei zu erstellen.
 * @param hebrewText Der hebräische Originaltext der Halacha.
 * @param halachaNumber Die Nummer der Halacha zur Verwendung im Titel.
 * @returns Einen vollständig formatierten String, der als Prompt für die Gemini API dient.
 */
const createHalachaPrompt = (hebrewText: string, halachaNumber: string): string => `
### Rolle:
Du bist ein Experte für jüdische Theologie. Deine Aufgabe ist es, komplexe halachische Texte zu analysieren und sie in einer klaren, direkten und analytischen Weise als **strukturierte Markdown-Datei** auf Deutsch zu präsentieren.

### Aufgabe:
Erstelle eine prägnante, **analytische Zusammenfassung** des folgenden hebräischen halachischen Textes. **Präsentiere die Argumente und Schlussfolgerungen direkt, als würdest du den Inhalt des Textes wiedergeben, nicht als würdest du den Text von außen analysieren.** Das Ergebnis muss als gut lesbares Standard-Markdown formatiert sein.

### Detaillierte Anweisungen (Inhaltliche Erstellung):
-   **Einleitung und Start:** Beginne die Zusammenfassung **direkt mit der leitenden Frage**, unmittelbar nach dem Titel. Schreibe **keinen** separaten Einleitungsabsatz.
-   **Tonalität und Perspektive:**
    -   Verwende durchgehend eine **direkte, inhaltliche Tonalität**. Berichte *über die halachischen Argumente*, nicht *über den Text, der die Argumente enthält*.
    -   **Vermeide explizit Meta-Formulierungen** wie: „Der Text argumentiert...“, „Diese Analyse zeigt...“, „Der Autor schreibt...“.
-   **Struktur:** Gliedere die Zusammenfassung **logisch, linear und faktenbasiert**.
-   **Fokus auf Hervorgehobenes:** Behandle Textpassagen, die im Originaltext mit Sternchen \`*[...]*\` hervorgehoben sind, als die Kernaussagen und stelle sicher, dass diese den Schwerpunkt der Zusammenfassung bilden.
-   **Quellen:** Sei bei der Verwendung von Fußnoten sehr zurückhaltend (nur 2-4 der wichtigsten). Markiere relevante Aussagen mit einer hochgestellten Fußnotenzahl (z.B. ¹). Erstelle am Ende einen Abschnitt \`**Quellen**\` mit einer einfachen Liste reiner Zitationen.
-   **Konzepte:** Erstelle ganz am Ende einen Abschnitt \`**relevante Halachische Konzepte**\`. Jeder Eintrag soll eine kurze, aber vollständige pädagogische Erklärung enthalten.

### Stil- und Formatierungsrichtlinien (Standard-Markdown):
-   **Titel:** Der Titel muss dem Format folgen: \`**Halachische Betrachtung ${halachaNumber}: Beschreibender Untertitel**\`.
-   **Hervorhebung:**
    -   Verwende **Fettdruck** (\`**Wort**\`) für Titel, leitende Fragen sowie für mehrere **wichtige Momente, Kernaussagen und die finale praktische Schlussfolgerung**.
    -   Verwende *Kursivschrift* (\`*Wort*\`) für hebräische Fachbegriffe im Text, die gesamten Zitationen im Quellenverzeichnis sowie die Begriffe in der Konzeptliste.
-   **Struktur-Überschriften:** Die Überschriften der Abschlusssektionen lauten \`**Quellen**\` und \`**relevante Halachische Konzepte**\`.

### Glossar für Einzelbegriffe und Transliteration:
-   **Transliteration:** Nutze die deutsche Transkription (sch für ש, z für צ, j für י).
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

    const { hebrewText, halachaNumber } = request.body;

    if (!hebrewText || !halachaNumber) {
      logger.error(
        "Missing required data in the request body.",
        { body: request.body }
      );
      response.status(400).json({
        error: "hebrewText and halachaNumber are required fields."
      });
      return;
    }

    const fullPrompt = createHalachaPrompt(hebrewText, halachaNumber);

    logger.info(`Starting Gemini API request for Halacha #${halachaNumber}...`);

    try {
      const genAI = new GoogleGenerativeAI(geminiKey.value());
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

      const result = await model.generateContent(fullPrompt);
      const summaryMarkdown = result.response.text();

      logger.info(
        `Successfully received summary for Halacha #${halachaNumber}.`,
        { length: summaryMarkdown.length }
      );

      // The 'summary' field contains the Markdown formatted string as requested
      // by the prompt. The client application is responsible for rendering this Markdown.
      response.status(200).json({
        id: halachaNumber,
        summary: summaryMarkdown,
        original: hebrewText,
      });

    } catch (error) {
      logger.error(
        `Error communicating with the Gemini API for Halacha #${halachaNumber}`,
        { errorMessage: (error as Error).message }
      );
      response.status(500).json({
        error: "Failed to generate the summary due to an internal error."
      });
    }
  }
);