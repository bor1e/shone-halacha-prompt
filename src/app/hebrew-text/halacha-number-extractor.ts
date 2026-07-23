const HALACHA_NUMBER_PATTERNS = [
    /\{הלכה מספר (\d+)\}/,
    /הלכה מספר (\d+)/,
    /הלכה (\d+)/,
    /מספר (\d+)/,
    /\b(\d{3,4})\b/,
    /\{(\d{3,4})\}/
];

const QUOTE_BETWEEN_HEBREW_LETTERS = /(?<=[\u0590-\u05FF])"(?=[\u0590-\u05FF])/g;
const GERSHAYIM = '״';
const SEARCHED_LEADING_LINES = 5;
const MINIMUM_HALACHA_NUMBER = 100;
const MAXIMUM_HALACHA_NUMBER = 9999;

export class HalachaNumberExtractor {

    static extractHalachaNumber(hebrewText: string): number | null {
        if (!hebrewText || hebrewText.trim().length === 0) {
            return null;
        }

        const firstLines = hebrewText.split('\n').slice(0, SEARCHED_LEADING_LINES).join('\n');

        for (const pattern of HALACHA_NUMBER_PATTERNS) {
            const match = firstLines.match(pattern);
            if (match && match[1]) {
                const number = parseInt(match[1], 10);
                if (HalachaNumberExtractor.isValidHalachaNumber(number)) {
                    return number;
                }
            }
        }

        return null;
    }

    static isValidHalachaNumber(number: number): boolean {
        return number >= MINIMUM_HALACHA_NUMBER && number <= MAXIMUM_HALACHA_NUMBER;
    }

    static formatHalachaNumber(number: number): string {
        return `הלכה מספר ${number}`;
    }

    static replaceQuotesWithGershayim(text: string): string {
        return text.replace(QUOTE_BETWEEN_HEBREW_LETTERS, GERSHAYIM);
    }
}
