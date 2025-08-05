/**
 * Erzeugt einen hochspezialisierten, mehrsprachigen Prompt für ein LLM,
 * um eine formatierte Markdown-Zusammenfassung zu erstellen.
 * @param hebrewText Der hebräische Originaltext der Halacha.
 * @param targetLanguage Die Zielsprache für die Zusammenfassung (z.B. "Deutsch", "English").
 * @param halachaNumber Die extrahierte Nummer der Halacha.
 * @returns Einen vollständig formatierten String, der als Prompt für die Gemini API dient.
 */
export const createHalachaPrompt = (hebrewText: string, targetLanguage: string, halachaNumber: string): string => `
### Aufgabe:
Analysiere den folgenden hebräischen halachischen Text. Deine einzige Aufgabe ist es, eine umfassende, gut strukturierte Zusammenfassung als reinen Markdown-Text zu erstellen. Die gesamte Analyse muss in der folgenden Sprache verfasst sein: **${targetLanguage}**.

### Anweisungen für den Inhalt der Zusammenfassung:
-   **Einleitung und Start:** Beginne die Zusammenfassung **direkt mit der leitenden Frage**, unmittelbar nach dem Titel. Schreibe **keinen** separaten Einleitungsabsatz.
-   **Tonalität und Perspektive:**
    -   Verwende durchgehend eine **direkte, inhaltliche Tonalität**. Berichte *über die halachischen Argumente*, nicht *über den Text, der die Argumente enthält*.
    -   **Vermeide explizit Meta-Formulierungen** wie: „Der Text argumentiert...", „Diese Analyse zeigt...", „Der Autor schreibt...".
-   **Struktur:** Gliedere die Zusammenfassung **logisch, linear und faktenbasiert**.
-   **Fokus auf Hervorgehobenes:** Behandle Textpassagen, die im Originaltext mit Sternchen \`*...*\` hervorgehoben sind, als die Kernaussagen und stelle sicher, dass diese den Schwerpunkt der Zusammenfassung bilden.
-   **Quellen:** Sei bei der Verwendung von Fußnoten sehr zurückhaltend (nur 2-5 der wichtigsten). Markiere relevante Aussagen im Text mit einer **hochgestellten Ziffer** (z.B. so¹). Erstelle am Ende einen Abschnitt \`**Quellen**\`, in dem die Zitationen als **nummerierte Liste** formatiert sind (z.B. \`1. *Zitation...*\`).
-   **Konzepte:** Erstelle ganz am Ende einen Abschnitt, dessen Titel in die Zielsprache übersetzt wird (z.B. "Relevante Halachische Konzepte"). **Formatiere diesen Abschnitt als Aufzählungsliste (bullet list)**, wobei jeder Begriff ein eigener Listenpunkt ist. Jeder Eintrag soll eine kurze, aber vollständige pädagogische Erklärung enthalten. **Wichtig:** Gib nach dem transliterierten Begriff immer den originalen hebräischen Begriff in Klammern an, z.B. \`*Berakhat Hagomel (ברכת הגומל)*\`.
-   **Verwende hebräsische Translitaraion entsprechend der Zielsprache ${targetLanguage}**

### Stil- und Formatierungsrichtlinien (Markdown):
-   **Titel:** Der Titel muss dem Format folgen: \`**{Titel in Zielsprache} ${halachaNumber}: {Beschreibender Untertitel}**\`. Übersetze "Halachische Betrachtung" in die Zielsprache.
-   **Hervorhebung:**
    -   Verwende **Fettdruck** (\`**Wort**\`) für Titel, leitende Fragen sowie für mehrere **wichtige Momente, Kernaussagen und die finale praktische Schlussfolgerung**.
    -   Verwende *Kursivschrift* (\`*Wort*\`) für hebräische Fachbegriffe im Text, die gesamten Zitationen im Quellenverzeichnis sowie die Begriffe in der Konzeptliste.
-   **Struktur-Überschriften:** Die Überschriften der Abschlusssektionen müssen ebenfalls in die Zielsprache übersetzt werden (z.B. "Quellen" -> "Sources", "Relevante Halachische Konzepte" -> "Relevant Halachic Concepts").

### Glossar für Einzelbegriffe und Transliteration:
**Wichtiger Hinweis:** Die folgenden Glossare sind auf Deutsch. Deine Aufgabe ist es, diese Begriffe und Phrasen korrekt in die Zielsprache (**${targetLanguage}**) zu übersetzen.
-   **Transliteration:** Nutze eine passende Transkription für die Zielsprache (z.B. deutsch: sch, z, j). Die Wendung **אגרות משה** ist als **"Igrot Mosche"** zu transliterieren.
-   \`*Borer* (בורר)\` → Verwende im Fließtext das Wort „Sortieren".
-   \`פסולת\` (Pesolet) → *das Unbrauchbare*
-   \`חייב\` (Chajaw) → *schuldig*
-   \`בהיתר\` (b'Heter) → *in zulässiger Weise*
-   \`חומרא\` (Chumra) → **die Strenge / die Schwere**
-   \`לא מיירי אלא\` (lo mairi ella) → *Dies bezieht sich nur auf...*
-   **Gott →** Schreibe den Namen G-ttes immer als „G-tt".

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

Gib NUR den Markdown-Text zurück, ohne zusätzliche Erklärungen oder Formatierungen.
`;