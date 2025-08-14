import { HalachaNumberExtractor } from './halacha-number-extractor';

describe('HalachaNumberExtractor', () => {

    describe('extractHalachaNumber', () => {

        it('should extract halacha number from {הלכה מספר 872} format', () => {
            const text = 'ב"ה {הלכה מספר 872} some other text';
            const result = HalachaNumberExtractor.extractHalachaNumber(text);
            expect(result).toBe(872);
        });

        it('should extract halacha number from הלכה מספר 872 format', () => {
            const text = 'ב"ה הלכה מספר 872 some other text';
            const result = HalachaNumberExtractor.extractHalachaNumber(text);
            expect(result).toBe(872);
        });

        it('should extract halacha number from הלכה 872 format', () => {
            const text = 'ב"ה הלכה 872 some other text';
            const result = HalachaNumberExtractor.extractHalachaNumber(text);
            expect(result).toBe(872);
        });

        it('should extract halacha number from מספר 872 format', () => {
            const text = 'ב"ה מספר 872 some other text';
            const result = HalachaNumberExtractor.extractHalachaNumber(text);
            expect(result).toBe(872);
        });

        it('should extract halacha number from {872} format', () => {
            const text = 'ב"ה {872} some other text';
            const result = HalachaNumberExtractor.extractHalachaNumber(text);
            expect(result).toBe(872);
        });

        it('should return null for empty text', () => {
            const result = HalachaNumberExtractor.extractHalachaNumber('');
            expect(result).toBeNull();
        });

        it('should return null for text without halacha number', () => {
            const text = 'ב"ה some Hebrew text without halacha number';
            const result = HalachaNumberExtractor.extractHalachaNumber(text);
            expect(result).toBeNull();
        });

        it('should return null for invalid halacha number (too small)', () => {
            const text = 'ב"ה {הלכה מספר 99} some text';
            const result = HalachaNumberExtractor.extractHalachaNumber(text);
            expect(result).toBeNull();
        });

        it('should return null for invalid halacha number (too large)', () => {
            const text = 'ב"ה {הלכה מספר 10000} some text';
            const result = HalachaNumberExtractor.extractHalachaNumber(text);
            expect(result).toBeNull();
        });

        it('should extract from first few lines only', () => {
            const text = `ב"ה {הלכה מספר 872} first line
      second line
      third line
      fourth line
      fifth line
      sixth line with {הלכה מספר 999}`;
            const result = HalachaNumberExtractor.extractHalachaNumber(text);
            expect(result).toBe(872); // Should get the first one, not 999
        });
    });

    describe('isValidHalachaNumber', () => {

        it('should return true for valid halacha numbers', () => {
            expect(HalachaNumberExtractor.isValidHalachaNumber(100)).toBe(true);
            expect(HalachaNumberExtractor.isValidHalachaNumber(500)).toBe(true);
            expect(HalachaNumberExtractor.isValidHalachaNumber(9999)).toBe(true);
        });

        it('should return false for invalid halacha numbers', () => {
            expect(HalachaNumberExtractor.isValidHalachaNumber(99)).toBe(false);
            expect(HalachaNumberExtractor.isValidHalachaNumber(10000)).toBe(false);
            expect(HalachaNumberExtractor.isValidHalachaNumber(0)).toBe(false);
            expect(HalachaNumberExtractor.isValidHalachaNumber(-1)).toBe(false);
        });
    });

    describe('formatHalachaNumber', () => {

        it('should format halacha number correctly', () => {
            const result = HalachaNumberExtractor.formatHalachaNumber(872);
            expect(result).toBe('הלכה מספר 872');
        });
    });

    describe('replaceQuotesWithGershayim', () => {

        it('should replace double quotes within Hebrew words', () => {
            const text = 'ב"ה {הלכה מספר 872}';
            const result = HalachaNumberExtractor.replaceQuotesWithGershayim(text);
            expect(result).toBe('ב״ה {הלכה מספר 872}');
        });

        it('should not replace standalone quotes', () => {
            const text = '"ב"ה" "הלכה מספר 872"';
            const result = HalachaNumberExtractor.replaceQuotesWithGershayim(text);
            expect(result).toBe('"ב״ה" "הלכה מספר 872"');
        });

        it('should not replace quotes at the beginning of text', () => {
            const text = '"ב"ה" הלכה מספר 872';
            const result = HalachaNumberExtractor.replaceQuotesWithGershayim(text);
            expect(result).toBe('"ב״ה" הלכה מספר 872');
        });

        it('should not replace quotes at the end of text', () => {
            const text = 'ב"ה הלכה מספר 872"';
            const result = HalachaNumberExtractor.replaceQuotesWithGershayim(text);
            expect(result).toBe('ב״ה הלכה מספר 872"');
        });

        it('should not replace quotes in mixed context', () => {
            const text = 'ב"ה "הלכה מספר 872" some "text"';
            const result = HalachaNumberExtractor.replaceQuotesWithGershayim(text);
            expect(result).toBe('ב״ה "הלכה מספר 872" some "text"');
        });

        it('should not replace quotes in Hebrew phrases', () => {
            const text = 'ב"ה "הלכה מספר 872" עם "טקסט עברי"';
            const result = HalachaNumberExtractor.replaceQuotesWithGershayim(text);
            expect(result).toBe('ב״ה "הלכה מספר 872" עם "טקסט עברי"');
        });

        it('should return empty string for empty input', () => {
            const result = HalachaNumberExtractor.replaceQuotesWithGershayim('');
            expect(result).toBe('');
        });

        it('should handle null input gracefully', () => {
            const result = HalachaNumberExtractor.replaceQuotesWithGershayim(null);
            expect(result).toBe(null);
        });

        it('should handle undefined input gracefully', () => {
            const result = HalachaNumberExtractor.replaceQuotesWithGershayim(undefined);
            expect(result).toBe(undefined);
        });

        it('should not replace existing gershayim', () => {
            const text = 'ב״ה {הלכה מספר 872} with ״existing״ gershayim';
            const result = HalachaNumberExtractor.replaceQuotesWithGershayim(text);
            expect(result).toBe('ב״ה {הלכה מספר 872} with ״existing״ gershayim');
        });
    });
}); 