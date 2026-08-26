/**
 * Port of `src/app/halacha-text-parser.ts` in the shone-halachot repository.
 *
 * shone-halachot owns the `halachot` collection and renders `title` and
 * `questions` on its cards, so anything written here has to be parsed the same
 * way its own authoring UI parses it. Keep the two in sync: if the parsing rules
 * change there, mirror the change here.
 */

export interface ParsedHalacha {
  number: number;
  title: string;
  questions: string;
  body: string;
  sources: string;
}

export function extractNumberFromText(text: string): number | null {
  const curlyBraceNumberPattern = /\{[^}]*?(\d+)[^}]*\}/;
  const match = text.match(curlyBraceNumberPattern);
  if (match && match[1]) {
    return parseInt(match[1], 10);
  }
  return null;
}

/**
 * The group-link preamble is a header line plus the bare URL on its own line,
 * and the URL has changed over time (goo.su, did.li, and truncated variants),
 * so match the shape rather than specific addresses.
 */
function isGroupLink(line: string): boolean {
  const trimmed = line.trim();
  return trimmed.includes("קישור לקבוצה") || /^https?:\/\/\S+$/.test(trimmed);
}

/**
 * `existingNumber` is used when the raw text carries no {הלכה מספר N} header.
 */
export function createHalacha(rawText: string, existingNumber = 0): ParsedHalacha {
  const nonEmptyLines = rawText.split("\n").filter((line) => line.trim().length > 0 && !/^-+$/.test(line.trim()));
  // Header may not be first (e.g. link/URL at top); find the line that contains the halacha number
  const headerIndex = nonEmptyLines.findIndex((line) => extractNumberFromText(line) !== null);
  const headerLine = headerIndex >= 0 ? nonEmptyLines.splice(headerIndex, 1)[0] || "" : "";
  const halachaNumber = extractNumberFromText(headerLine) ?? existingNumber;
  const questionLines = nonEmptyLines.filter((line) => line.includes("שאלה:")).join("\n");
  // Title is normally the first blockquote line (> ) before the first "שאלה:"
  const firstQuestionIndex = nonEmptyLines.findIndex((line) => line.includes("שאלה:"));
  let titleLine =
    (firstQuestionIndex >= 0 ?
      nonEmptyLines.slice(0, firstQuestionIndex).find((line) => line.trim().startsWith(">")) :
      nonEmptyLines.find((line) => line.trim().startsWith(">"))) || "";
  // Fallback: if no blockquote title was found, use the first non-empty, non-header, non-question line before the question (skip group link line)
  if (!titleLine) {
    const searchEnd = firstQuestionIndex >= 0 ? firstQuestionIndex : nonEmptyLines.length;
    titleLine =
      nonEmptyLines
        .slice(0, searchEnd)
        .find((line) =>
          line.trim().length > 0 &&
          line !== headerLine &&
          !line.trim().startsWith("שאלה:") &&
          !isGroupLink(line)
        ) || "";
  }
  const bodyLines = nonEmptyLines.filter((line) =>
    !line.includes("מקורות:") &&
    line !== titleLine &&
    !isGroupLink(line)
  ).join("\n");
  const sourceLines = nonEmptyLines.filter((line) => line.includes("מקורות:")).join("\n");

  return {
    number: halachaNumber,
    title: titleLine,
    questions: questionLines,
    body: bodyLines,
    sources: sourceLines,
  };
}
