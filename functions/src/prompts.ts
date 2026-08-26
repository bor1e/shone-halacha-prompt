/**
 * Universelles, bereinigtes Glossar für halachische Grundbegriffe und Konventionen.
 * Frei von fallspezifischem Ballast (YAGNI), exakt in der halachischen Bedeutung.
 */
const glossary = (targetLanguage: string): string => `
### Glossar & Terminologie-Regeln (${targetLanguage}):
- **G-ttesschreibweise:** Schreibe den Namen G-ttes in der Zielsprache immer ehrerbietig mit Bindestrich (z.B. deutsch: „G-tt", „g-ttlich", „G-ttlichkeit"; englisch: „G-d", „g-dly").
- **G-ttesbezeichnungen:** \`הקב"ה\` → *der Heilige, gepriesen sei Er* / \`הוי'\` oder \`ה'\` im Fließtext → *HaSchem* / in Bibelversen → *der Ewige*.
- **Transliteration:** Nutze die für **${targetLanguage}** übliche Transkription (z.B. deutsch: *sch, z, j, w* [Schabbos, Mizwos, Chometz]; englisch: *sh, tz, y, v* [Shabbos, Mitzvos]).
- **Halachische Kernbegriffe:**
  - \`חייב\` → *verpflichtet* (bei Geboten/Pflichten) bzw. *schuldig / haftbar* (bei Verboten/Schadensersatz).
  - \`פטור\` → *befreit / nicht verpflichtet* (bei Geboten) bzw. *straffrei* (bei Verboten).
  - \`לכתחילה\` → *von vornherein / im Idealfall (Lechatchila)*
  - \`בדיעבד\` → *nachträglich / im Nachhinein (Bedi'awad)*
  - \`חומרא\` → *Erschwerung / Verschärfung / strengere Auffassung (Chumra)*
  - \`קולא\` → *Erleichterung / mildere Auffassung (Kula)*
  - \`ספק\` → *Zweifelsfall (Safek)*
  - \`מדאורייתא\` → *aus der Tora / biblisch (de'Oraita)*
  - \`מדרבנן\` → *rabbinisch (de'Rabbanan)*
  - \`מנהג\` → *Brauch (Minhag)*
  - \`נפקא מינה / נפק"מ\` → *praktischer Unterschied (Nafka Mina)*
  - \`אין לפרוץ גדר\` → *man darf die Schutzschranke nicht durchbrechen*
  - \`שואל שלא מדעת\` → *Entleihen ohne Wissen des Eigentümers*
  - \`כילוי קרנא\` → *Substanzverzehr*
  - \`חסרון כיס\` → *finanzieller Verlust*
  - \`בישול עכו"ם\` → *Bischul Akum (von Nichtjuden Gekochtes)*
  - \`ששים / ביטול בששים\` → *Batel be-Schischim (Aufhebung im Sechzigfachen)*
  - \`אנ"ש\` → *Anasch (unsere Chassidim / Chabad-Gemeinschaft)*
`;

/**
 * Erzeugt einen Prompt für eine vollständige, originalgetreue Übersetzung.
 * Höchste Texttreue, exakte Struktur und vollständige Fußnoten-Wiedergabe.
 */
export const createFullTranslationPrompt = (hebrewText: string, targetLanguage: string, halachaNumber: string): string => `
### Aufgabe:
Übersetze den folgenden hebräischen halachischen Text **vollständig, präzise und originalgetreu** in die folgende Sprache: **${targetLanguage}**. 
Dies ist **keine** Zusammenfassung und **keine** freie Nacherzählung. Der Zieltext muss denselben Inhalt, dieselbe gedankliche Abfolge und dieselbe Struktur aufweisen wie das Original.

### 1. Grundregeln der Texttreue:
- **Vollständigkeit:** Übersetze jeden Satz, jede Frage, jede Antwort und alle Quellenangaben vollständig. Lasse nichts aus (auch keine Einleitungen, Zwischenbemerkungen oder Klammern).
- **Keine Hinzufügungen:** Ergänze keine eigenen Erklärungen, Glättungen oder Schlussfolgerungen. Was nicht im Original steht, steht nicht in der Übersetzung.
- **Unentschiedene Punkte:** Offene Fragen und Wendungen wie \`וצ"ע\` / \`וצלע"ע\` (*dies bedarf weiterer Klärung*) bleiben exakt als solche erhalten.
- **Natürliche Zielsprache:** Verwende flüssige, lesbare Syntax. Vermeide unnatürliche wörtliche Wort-für-Wort-Fehlkonstruktionen (z.B. nicht „Und es schreibt der Rosch", sondern „Und [der Autor] schrieb:" oder „Dazu schrieb [der Autor]:").

### 2. Struktur und Formatierung:
- **Titelzeile:** Die allererste Zeile lautet exakt: \`**Halacha ${halachaNumber}: {übersetzter Originaltitel}**\` (z.B. \`**Halacha ${halachaNumber}: Gesetze des Eintauchens von Gefäßen [31]**\`).
- **Einleitender Text:** Falls vor der ersten Frage ein Textabschnitt oder eine Überschrift steht, übersetze diesen vollständig an den Anfang.
- **Fragen und Antworten:**
  - Jedes \`שאלה:\` wird zu \`**Frage:**\` (bzw. Zielsprachen-Äquivalent, z.B. \`**Question:**\`).
  - Jedes \`תשובה:\` wird zu \`**Antwort:**\` (bzw. \`**Answer:**\`).
- **Zwischenüberschriften & Trenner:** Eigene Überschriftenzeilen (z.B. \`*הרבי הרש"ב*\`) werden als eigene Zeile in Fettdruck (\`**...**\`) übernommen. Trennzeichen wie \`★ ★ ★\` bleiben auf einer eigenen Zeile erhalten.
- **Hervorhebungen:** Textstellen, die im hebräischen Text mit \`*...*\` markiert sind, werden als **Fettdruck** (\`**...**\`) wiedergegeben.
- **Klammereinschübe:** Einschübe des Autors in eckigen Klammern (\`[=...]\`, \`[...]\`) bleiben als eckige Klammern erhalten und werden mitübersetzt.

### 3. Zitate, Autoritäten und Werke:
- **Wörtliche Zitate:** Passagen in einfachen Anführungszeichen \`'...'\` sind wörtliche Zitate. Übersetze sie präzise und setze sie in typografische Anführungszeichen der Zielsprache.
- **Autoritäten & Werke (Abkürzungen auflösen):**
  - \`אדה"ז / אדמו"ר הזקן\` → *der Alte Rebbe (Admur HaSaken)*
  - \`המחבר / מרן\` → *der Mechaber (Schulchan Aruch)*
  - \`רמ"א\` → *der Rema*
  - \`מג"א / מגן אברהם\` → *der Magen Awraham*
  - \`ט"ז / טורי זהב\` → *der Taz*
  - \`ש"ך / שפתי כהן\` → *der Schach*
  - \`פמ"ג / פרי מגדים\` → *der Pri Megadim* (mit \`משב"ז\` → *Mischbetzot Sahaw*, \`שפ"ד\` → *Siftej Da'at*)
  - \`משנ"ב / מ"ב / משנה ברורה\` → *die Mischna Berura*
  - \`הרא"ש\` → *der Rosch*, \`הרי"ף\` → *der Rif*, \`הרמב"ם\` → *der Rambam*, \`הר"ן\` → *der Ran*, \`הרשב"א\` → *der Raschba*, \`הריטב"א\` → *der Ritwa*, \`השל"ה\` → *der Schelah*
  - \`שו"ע\` → *Schulchan Aruch*, \`או"ח\` → *Orach Chajim*, \`יו"ד\` → *Jore Dea*, \`חו"מ\` → *Choschen Mischpat*, \`אהע"ז\` → *Ewen HaEser*
  - \`לקו"ש\` → *Likkutej Sichot*, \`תו"מ\` → *Torat Menachem*, \`אג"ק\` → *Igrot Kodesh*
- **Stellenangaben:** Simanim, Absätze und Blattangaben exakt wiedergeben (z.B. \`סי' פט ס"ג\` → „Siman 89, Se'if 3"; \`דף לה, ב\` → „Blatt 35b").

### 4. Strukturelle Wendungen:
- \`וכתב / וכ"כ\` → *Und [der Autor] schrieb: / Ebenso schrieb:*
- \`כלומר\` → *das heißt*
- \`ועד"ז / ועפ"ז / עפי"ז\` → *in gleicher Weise / demgemäß / auf dieser Grundlage*
- \`ולהלכה / א"כ למעשה / ולמעשה\` → *Zur praktischen Halacha / In der Praxis gilt somit / Praktische Schlussfolgerung:*
- \`נחלקו הפוסקים\` → *Die Poskim sind geteilter Meinung*
- \`וצ"ע / וצלע"ע\` → *und dies bedarf (großer) weiterer Klärung*
- \`ואכמ"ל\` → *und hier ist nicht der Ort, dies weiter auszuführen*
- \`ע"ש / עיי"ש\` → *siehe dort*
- \`ד"ה\` → *unter dem Stichwort*
- \`ש"מ\` → *daraus geht hervor*

### 5. Quellenapparat / Fußnoten:
- **Fußnotenzeichen im Text:** Hochgestellte Ziffern (¹, ², ³, ¹⁰ ...) bleiben **exakt an ihrer Position** im Fließtext stehen.
- **Abschnitt am Ende:** Setze das Quellenverzeichnis unter die Überschrift \`**Quellen**\` (bzw. in der Zielsprache, z.B. \`**Sources**\`), formatiert als nummerierte Liste (z.B. \`1. ...\`).
- **Vollständigkeit der Fußnoten:** Übersetze alle in den Fußnoten enthaltenen Erläuterungen, Zitate und Diskussionen **vollständig** – nicht nur reine bibliografische Stellenangaben!

${glossary(targetLanguage)}

### EINGABE (Hebräischer Text):
${hebrewText}

Gib AUSSCHLIESSLICH den übersetzten Markdown-Text zurück, ohne einleitende Floskeln oder umschließende Code-Fences.
`;

/**
 * Erzeugt einen Prompt für eine strukturierte Markdown-Zusammenfassung.
 */
export const createHalachaPrompt = (hebrewText: string, targetLanguage: string, halachaNumber: string): string => `
### Aufgabe:
Analysiere den folgenden hebräischen halachischen Text. Erstelle eine umfassende, gut strukturierte Zusammenfassung als reinen Markdown-Text in der Zielsprache: **${targetLanguage}**.

### Anweisungen:
- **Einleitung:** Beginne direkt mit der leitenden Fragestellung nach dem Titel. Keinen separaten Einleitungsabsatz.
- **Tonalität:** Sachlich, linear, faktenbasiert. Keine Meta-Formulierungen (z.B. nicht „Der Autor schreibt...", sondern direkte Darstellung der halachischen Rechtslage).
- **Fokus:** Mit \`*...*\` hervorgehobene Kernaussagen bilden den Schwerpunkt.
- **Quellen:** 2–5 Hauptquellen im Text mit hochgestellten Ziffern markieren. Am Ende einen Abschnitt \`**Quellen**\` als nummerierte Liste anfügen.
- **Konzepte:** Am Ende einen Abschnitt (z.B. \`**Relevante Halachische Konzepte**\`) als Aufzählungsliste anfügen mit kurzen pädagogischen Erklärungen und Hebräisch in Klammern (z.B. \`*Berakhat Hagomel (ברכת הגומל)*\`).
- **Titel:** \`**Halachische Betrachtung ${halachaNumber}: {Beschreibender Untertitel}**\` (in die Zielsprache übersetzt).

${glossary(targetLanguage)}

### EINGABE (Hebräischer Text):
${hebrewText}

Gib NUR den Markdown-Text zurück.
`;

/**
 * Erzeugt einen Prompt für eine prägnante Zusammenfassung (Leitfrage, Kernaussagen, Konklusion).
 */
export const createConciseHalachaPrompt = (hebrewText: string, targetLanguage: string, halachaNumber: string): string => `
### Aufgabe:
Analysiere den folgenden hebräischen halachischen Text. Erstelle eine **prägnante, punktgenaue** Zusammenfassung als reinen Markdown-Text in der Zielsprache: **${targetLanguage}**.

### Struktur (ausschließlich diese 3 Teile):
1. **Leitfrage:** Direkt nach dem Titel.
2. **Kernaussagen:** Gegensätzliche Meinungen und Kernargumente kurz und prägnant.
3. **Schlussfolgerung:** Klare praktische Halacha / Endkonklusion.

### Anweisungen:
- **Tonalität:** Direkt, sachbezogen, keine Meta-Formulierungen.
- **Quellen:** Nur 1–3 Hauptquellen (hochgestellte Ziffern + Abschnitt \`**Quellen**\` am Ende).
- **Konzepte:** Am Ende Abschnitt \`**Relevante Halachische Konzepte**\` mit Ein-Satz-Erklärungen.
- **Titel:** \`**Halachische Betrachtung ${halachaNumber}: {Beschreibender Untertitel}**\` (in die Zielsprache übersetzt).

${glossary(targetLanguage)}

### EINGABE (Hebräischer Text):
${hebrewText}

Gib NUR den Markdown-Text zurück.
`;
