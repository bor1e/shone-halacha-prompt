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
}); 