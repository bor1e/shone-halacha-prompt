import { GoogleGenerativeAI } from "@google/generative-ai";
import * as logger from "firebase-functions/logger";
import { defineString } from "firebase-functions/params";
import { onRequest } from "firebase-functions/v2/https";

const GEMINI_KEY = defineString("GEMINI_KEY");

export const getHalachaSummary = onRequest(
    { cors: true, secrets: ["GEMINI_KEY"] },
    async (request, response) => {
        if (request.method !== "POST") {
            response.status(405).send("Method Not Allowed");
            return;
        }

        const hebrewText: string = request.body.hebrewText || "";
        const halachaNumber: string = request.body.halachaNumber || "";

        if (!hebrewText || !halachaNumber) {
            logger.error(
                "Fehlende Daten in der Anfrage.",
                { body: request.body }
            );
            response.status(400).json(
                { error: "hebrewText und halachaNumber sind erforderlich." }
            );
            return;
        }

        const fullPrompt = `
### Rolle:
Du bist ein Experte für jüdische Theologie. Deine Aufgabe ist es, komplexe halachische Texte zu analysieren und sie in einer klaren, zugänglichen und stilistisch ausgefeilten Weise auf Deutsch zu präsentieren, die exakt dem Stil des Nutzers entspricht.

### Aufgabe:
Erstelle eine prägnante und strukturierte deutsche Analyse des folgenden hebräischen halachischen Textes. Das Ergebnis muss den persönlichen und editoriellen Stil des Nutzers („Schone Halacha“-Stil) exakt nachahmen. Die Ausgabe muss für das direkte Kopieren in Messenger-Dienste optimiert sein.

### Detaillierte Anweisungen (Inhaltliche Erstellung):
1.  Titel: Der Titel muss exakt diesem Format folgen: \`*Schone Halacha ${halachaNumber}: Beschreibender Untertitel*\`. Ersetze \`{Untertitel}\` passend zum Text.
2.  Einleitung: Schreibe keine separate Überschrift „Einleitung“. Integriere die einleitenden Sätze nahtlos als ersten Absatz direkt unter dem Titel.
3.  Tonalität: Verwende eine zugängliche, nachdenkliche Tonalität. Bevorzuge das Wort „Betrachtung“ anstelle von „Analyse“.
4.  Struktur: Gliedere die Analyse in logische Abschnitte. Beginne den Hauptteil mit einer leitenden Frage, die der Text beantwortet.
5.  Fokus auf Hervorgehobenes: Achte besonders auf Textpassagen, die im Originaltext mit Sternchen \`*[...]*\` hervorgehoben sind.
6.  Quellen: Markiere relevante Aussagen mit einer hochgestellten Fußnotenzahl (z.B. ¹). Erstelle am Ende einen Quellen-Abschnitt, der nur die im Text verwendeten Fußnoten auflistet.
7.  Konzepte: Erstelle ganz am Ende einen Abschnitt mit relevanten halachischen Konzepten.

### Stil- und Formatierungsrichtlinien (Nutzer-Stil „Schone Halacha“):
1.  Hervorhebung: Verwende ausschließlich Kursivschrift (\`_Wort_\`) zur Betonung im Fließtext. Fettschrift (\`*Wort*\`) wird *nur* für den Haupttitel und die Überschriften der Abschlusssektionen verwendet.
2.  Quellen-Sektion: Formatiere den gesamten Quellen-Abschnitt als Blockquote (beginnend mit \`> \`). Die Überschrift lautet \`> _Quellen_:\`.
3.  Konzepte-Sektion: Die Überschrift lautet \`*relevante Halachische Konzepte*\`. Jeder Eintrag muss dem Format \`_Begriff_ (Hebräisch) – Deutsch\` folgen.
4.  Allgemeine Syntax: Nutze Messenger-Syntax: \`*fett*\` und \`_kursiv_\`.

### Glossar für Schlüsselbegriffe und Transliteration:
* Transliteration: Nutze die deutsche Transkription (\`sch\` für ש, \`z\` für צ, \`j\` für י).
* \`*Borer* (בורר)\` → Verwende im Fließtext das Wort „Sortieren“.
* \`פסולת\` (Pesolet) → *das Unbrauchbare*
* \`חייב\` (Chajaw) → *schuldig*
* \`בהיתר\` (b'Heter) → _in zulässiger Weise_
* \`חומרא\` (Chumra) → *die Strenge / die Schwere*
* \`לא מיירי אלא\` (lo mairi ella) → _Dies bezieht sich nur auf..._
* Gott → Schreibe den Namen G-ttes immer als „G-tt“.

### EINGABE (Hebräischer Text):
${hebrewText}
`;

        logger.info("Starte Anfrage an Gemini API...");

        try {
            const genAI = new GoogleGenerativeAI(GEMINI_KEY.value());
            const model = genAI.getGenerativeModel(
                { model: "gemini-1.5-pro-latest" }
            );

            const result = await model.generateContent(fullPrompt);
            const summaryText = result.response.text();

            response.json({
                id: halachaNumber,
                summary: summaryText,
                original: hebrewText,
            });
        } catch (error) {
            logger.error(
                "Fehler bei der Kommunikation mit der Gemini API",
                error
            );
            response.status(500).json(
                { error: "Die Zusammenfassung konnte nicht erstellt werden." }
            );
        }
    }
);
