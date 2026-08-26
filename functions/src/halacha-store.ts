import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createHalacha } from "./halacha-text-parser";

const app = initializeApp({ projectId: "shone-halachot" });
const db = getFirestore(app, "halachot");

const HALACHOT_COLLECTION = "halachot";
const TRANSLATIONS_COLLECTION = "translations";

export type TranslationLevel = "advanced" | "concise" | "full";

const TRANSLATION_LEVELS: readonly TranslationLevel[] = ["advanced", "concise", "full"];

export function isTranslationLevel(value: unknown): value is TranslationLevel {
  return typeof value === "string" && (TRANSLATION_LEVELS as readonly string[]).includes(value);
}

export interface TranslationRecord {
  halachaNumber: number;
  language: string;
  level: TranslationLevel;
  summary: string;
  model: string;
}

export type SaveOriginalResult = "created" | "exists" | "unparseable";

/**
 * Stores the raw text as a halacha document, parsed into the same shape that
 * shone-halachot's own authoring UI produces.
 *
 * Returns "unparseable" rather than writing when the text cannot be split into a
 * usable record: shone-halachot renders `title` and `questions` on its cards, so
 * an unparsed document shows up there as a blank card. Translation does not depend
 * on this write succeeding, so refusing is better than publishing a broken entry.
 */
export async function saveOriginal(
  halachaNumber: number,
  hebrewText: string
): Promise<SaveOriginalResult> {
  const existing = await db
    .collection(HALACHOT_COLLECTION)
    .where("number", "==", halachaNumber)
    .limit(1)
    .get();

  if (!existing.empty) {
    return "exists";
  }

  const parsed = createHalacha(hebrewText, halachaNumber);
  // A header naming a different halacha means the text would be filed under the
  // wrong number; an empty title means the card would render blank.
  if (parsed.number !== halachaNumber || parsed.title.trim() === "") {
    return "unparseable";
  }

  const now = new Date().toISOString();
  await db.collection(HALACHOT_COLLECTION).add({
    number: halachaNumber,
    title: parsed.title,
    dedication: "",
    questions: parsed.questions,
    body: parsed.body,
    sources: parsed.sources,
    viewCount: 0,
    createdAt: now,
    updatedAt: now,
  });
  return "created";
}

export async function listHalachaNumbers(): Promise<number[]> {
  const snapshot = await db.collection(HALACHOT_COLLECTION).select("number").get();
  const numbers = snapshot.docs.map((doc) => {
    const number = doc.get("number");
    if (typeof number !== "number") {
      throw new Error(`Halacha document ${doc.id} has no valid number field. Got: ${typeof number}`);
    }
    return number;
  });
  return [...new Set(numbers)].sort((a, b) => a - b);
}

export async function loadOriginal(halachaNumber: number): Promise<string | null> {
  const snapshot = await db
    .collection(HALACHOT_COLLECTION)
    .where("number", "==", halachaNumber)
    .limit(1)
    .get();

  if (snapshot.empty) {
    return null;
  }
  const body = snapshot.docs[0].get("body");
  if (typeof body !== "string" || body.length === 0) {
    throw new Error(
      `Halacha document for number ${halachaNumber} exists but has no valid body field. Got: ${typeof body}`
    );
  }
  return body;
}

function translationDocumentId(halachaNumber: number, language: string, level: TranslationLevel): string {
  const languageSlug = language.toLowerCase().replace(/[^a-z]/g, "");
  return `${halachaNumber}_${languageSlug}_${level}`;
}

export async function loadTranslation(
  halachaNumber: number,
  language: string,
  level: TranslationLevel
): Promise<string | null> {
  const snapshot = await db
    .collection(TRANSLATIONS_COLLECTION)
    .doc(translationDocumentId(halachaNumber, language, level))
    .get();

  if (!snapshot.exists) {
    return null;
  }
  const summary = snapshot.get("summary");
  if (typeof summary !== "string" || summary.length === 0) {
    throw new Error(
      `Translation document ${snapshot.id} exists but has no valid summary field. Got: ${typeof summary}`
    );
  }
  return summary;
}

export interface TranslationListEntry {
  halachaNumber: number;
  language: string;
  level: TranslationLevel;
  model: string;
  updatedAt: string;
}

export async function listTranslations(): Promise<TranslationListEntry[]> {
  const snapshot = await db
    .collection(TRANSLATIONS_COLLECTION)
    .orderBy("halachaNumber")
    .get();

  return snapshot.docs.map((doc) => {
    const halachaNumber = doc.get("halachaNumber");
    const language = doc.get("language");
    const level = doc.get("level");
    if (typeof halachaNumber !== "number" || typeof language !== "string" || !isTranslationLevel(level)) {
      throw new Error(
        `Translation document ${doc.id} has invalid metadata. Got: halachaNumber=${typeof halachaNumber}, language=${typeof language}, level=${String(level)}`
      );
    }
    return {
      halachaNumber,
      language,
      level,
      model: doc.get("model"),
      updatedAt: doc.get("updatedAt"),
    };
  });
}

export async function saveTranslation(record: TranslationRecord): Promise<void> {
  const documentId = translationDocumentId(record.halachaNumber, record.language, record.level);

  // ponytail: single updatedAt only, add createdAt preservation if version history matters
  await db.collection(TRANSLATIONS_COLLECTION).doc(documentId).set({
    halachaNumber: record.halachaNumber,
    language: record.language,
    level: record.level,
    summary: record.summary,
    model: record.model,
    updatedAt: new Date().toISOString(),
  });
}
