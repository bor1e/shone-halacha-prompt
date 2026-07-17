import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const app = initializeApp({ projectId: "shone-halachot" });
const db = getFirestore(app, "halachot");

const HALACHOT_COLLECTION = "halachot";
const TRANSLATIONS_COLLECTION = "translations";

export type TranslationLevel = "advanced" | "concise";

export interface TranslationRecord {
  halachaNumber: number;
  language: string;
  level: TranslationLevel;
  summary: string;
}

export async function saveOriginal(
  halachaNumber: number,
  hebrewText: string
): Promise<"created" | "exists"> {
  const existing = await db
    .collection(HALACHOT_COLLECTION)
    .where("number", "==", halachaNumber)
    .limit(1)
    .get();

  if (!existing.empty) {
    return "exists";
  }

  const now = new Date().toISOString();
  await db.collection(HALACHOT_COLLECTION).add({
    number: halachaNumber,
    title: "",
    dedication: "",
    questions: "",
    body: hebrewText,
    sources: "",
    viewCount: 0,
    createdAt: now,
    updatedAt: now,
  });
  return "created";
}

export async function saveTranslation(record: TranslationRecord): Promise<void> {
  const languageSlug = record.language.toLowerCase().replace(/[^a-z]/g, "");
  const documentId = `${record.halachaNumber}_${languageSlug}_${record.level}`;

  // ponytail: single updatedAt only, add createdAt preservation if version history matters
  await db.collection(TRANSLATIONS_COLLECTION).doc(documentId).set({
    halachaNumber: record.halachaNumber,
    language: record.language,
    level: record.level,
    summary: record.summary,
    model: "gemini-3-pro-preview",
    updatedAt: new Date().toISOString(),
  });
}
