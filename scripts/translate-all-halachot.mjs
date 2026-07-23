#!/usr/bin/env node

const FUNCTIONS_BASE_URL = 'https://europe-west1-fir-prompting.cloudfunctions.net';
const TARGET_LANGUAGE = 'Deutsch';
const LEVEL = 'advanced';
const REQUEST_TIMEOUT_MS = 9 * 60 * 1000;

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    ...options,
  });
  const body = await response.json();
  if (!response.ok) {
    throw new Error(`${url} responded ${response.status}: ${body.error ?? JSON.stringify(body)}`);
  }
  return body;
}

async function loadMissingHalachaNumbers() {
  const [halachot, translations] = await Promise.all([
    fetchJson(`${FUNCTIONS_BASE_URL}/listHalachot`),
    fetchJson(`${FUNCTIONS_BASE_URL}/listTranslations`),
  ]);

  const translated = new Set(
    translations.translations
      .filter((entry) => entry.language === TARGET_LANGUAGE && entry.level === LEVEL)
      .map((entry) => entry.halachaNumber)
  );

  const missing = halachot.halachaNumbers.filter((number) => !translated.has(number));
  console.log(`Halachot gesamt: ${halachot.count}, bereits übersetzt (${TARGET_LANGUAGE}/${LEVEL}): ${translated.size}, fehlend: ${missing.length}`);
  return missing;
}

async function translateHalacha(halachaNumber) {
  return fetchJson(`${FUNCTIONS_BASE_URL}/getHalachaSummary`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      halachaNumber,
      targetLanguage: TARGET_LANGUAGE,
      isAdvancedLevel: LEVEL === 'advanced',
    }),
  });
}

function parseFlag(name) {
  const flagIndex = process.argv.indexOf(`--${name}`);
  if (flagIndex === -1) {
    return null;
  }
  const value = Number(process.argv[flagIndex + 1]);
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`--${name} muss eine positive Ganzzahl sein. Got: ${process.argv[flagIndex + 1]}`);
  }
  return value;
}

const from = parseFlag('from');
const limit = parseFlag('limit');
let missing = await loadMissingHalachaNumbers();
if (from !== null) {
  missing = missing.filter((number) => number >= from);
  console.log(`Ab Halacha ${from}: ${missing.length} fehlend.`);
}
if (limit !== null) {
  missing = missing.slice(0, limit);
  console.log(`Limitiert auf ${missing.length} Übersetzungen.`);
}
const failures = [];

for (const [index, halachaNumber] of missing.entries()) {
  const progress = `[${index + 1}/${missing.length}]`;
  const startedAt = Date.now();
  try {
    const result = await translateHalacha(halachaNumber);
    const seconds = Math.round((Date.now() - startedAt) / 1000);
    const source = result.cached ? 'cache' : 'generiert';
    const persisted = result.persisted ? '' : ' (NICHT gespeichert!)';
    console.log(`${progress} Halacha ${halachaNumber}: ${source} in ${seconds}s, ${result.summary.length} Zeichen${persisted}`);
    if (!result.persisted) {
      failures.push({ halachaNumber, reason: 'nicht gespeichert' });
    }
  } catch (translateError) {
    failures.push({ halachaNumber, reason: translateError.message });
    console.error(`${progress} Halacha ${halachaNumber}: FEHLER - ${translateError.message}`);
  }
}

console.log(`\nFertig: ${missing.length - failures.length}/${missing.length} erfolgreich.`);
if (failures.length > 0) {
  console.error('Fehlgeschlagen:', failures.map((f) => `${f.halachaNumber} (${f.reason})`).join(', '));
  process.exit(1);
}
