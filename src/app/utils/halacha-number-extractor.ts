/**
 * Utility class for extracting halacha numbers from Hebrew text
 */
export class HalachaNumberExtractor {

    /**
     * Extracts halacha number from Hebrew text
     * Looks for patterns like: ב"ה {הלכה מספר 872} or similar variations
     * @param hebrewText The Hebrew text to search in
     * @returns The extracted halacha number or null if not found
     */
    static extractHalachaNumber(hebrewText: string): number | null {
        if (!hebrewText || hebrewText.trim().length === 0) {
            return null;
        }

        // Multiple regex patterns to match different Hebrew formats
        const patterns = [
            // Pattern 1: ב"ה {הלכה מספר 872}
            /\{הלכה מספר (\d+)\}/,
            // Pattern 2: הלכה מספר 872
            /הלכה מספר (\d+)/,
            // Pattern 3: הלכה 872
            /הלכה (\d+)/,
            // Pattern 4: מספר 872
            /מספר (\d+)/,
            // Pattern 5: 872 (just the number, but must be in context)
            /\b(\d{3,4})\b/,
            // Pattern 6: {872} (number in braces)
            /\{(\d{3,4})\}/
        ];

        // Search in the first few lines for better accuracy
        const lines = hebrewText.split('\n').slice(0, 5);
        const firstLines = lines.join('\n');

        for (const pattern of patterns) {
            const match = firstLines.match(pattern);
            if (match && match[1]) {
                const number = parseInt(match[1], 10);
                // Validate that it's a reasonable halacha number (3-4 digits)
                if (number >= 100 && number <= 9999) {
                    return number;
                }
            }
        }

        return null;
    }

    /**
     * Validates if a number could be a valid halacha number
     * @param number The number to validate
     * @returns True if it's a valid halacha number format
     */
    static isValidHalachaNumber(number: number): boolean {
        return number >= 100 && number <= 9999;
    }

    /**
     * Formats a halacha number for display
     * @param number The halacha number
     * @returns Formatted string
     */
    static formatHalachaNumber(number: number): string {
        return `הלכה מספר ${number}`;
    }
} 