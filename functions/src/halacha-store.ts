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
  model: string;
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
    if (typeof halachaNumber !== "number" || typeof language !== "string" || (level !== "advanced" && level !== "concise")) {
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
