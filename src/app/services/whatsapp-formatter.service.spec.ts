import { TestBed } from '@angular/core/testing';
import { WhatsAppFormatterService } from './whatsapp-formatter.service';

// Helper to wrap expected content
function withPrefixSuffix(content: string): string {
    if (!content) return '';
    const prefix = 'ב״ה';
    const suffix = 'הרב מנחם מענדל נחשון והרב חיים אליעזר חיטריק';
    return `${prefix}\n\n${content}\n\n${suffix}`;
}

describe('WhatsAppFormatterService (Final Logic)', () => {
    let service: WhatsAppFormatterService;

    beforeEach(() => {
        TestBed.configureTestingModule({ providers: [WhatsAppFormatterService] });
        service = TestBed.inject(WhatsAppFormatterService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    // Test headers become BOLD
    describe('Headers conversion (to Bold)', () => {
        it('should convert markdown headers to bold titles', () => {
            const input = `# Main Title`;
            const expected = `*Main Title*`;
            expect(service.formatForWhatsApp(input)).toBe(withPrefixSuffix(expected));
        });
    });

    // Test emphasis conversion to BOLD and ITALIC
    describe('Emphasis Conversion (Bold and Italic)', () => {
        it('should convert **bold text** to *bold text*', () => {
            const input = 'This is **bold text**.';
            const expected = 'This is *bold text*.';
            expect(service.formatForWhatsApp(input)).toBe(withPrefixSuffix(expected));
        });

        it('should convert *italic text* to _italic text_', () => {
            const input = 'This is *italic text*.';
            const expected = 'This is _italic text_.';
            expect(service.formatForWhatsApp(input)).toBe(withPrefixSuffix(expected));
        });

        it('should correctly handle mixed bold and italic', () => {
            const input = 'A **bold** word and an *italic* word.';
            const expected = 'A *bold* word and an _italic_ word.';
            expect(service.formatForWhatsApp(input)).toBe(withPrefixSuffix(expected));
        });

        it('should correctly handle nested emphasis', () => {
            const input = 'This is **bold with *italic* inside** text.';
            const expected = 'This is *bold with _italic_ inside* text.';
            expect(service.formatForWhatsApp(input)).toBe(withPrefixSuffix(expected));
        });
    });

    // Test a complex, realistic example
    describe('Complex Example', () => {
        it('should handle a full document with mixed formatting', () => {
            const input = `## Halachische Betrachtung

This is **wichtig** and should be bold.
This is *kursiv* and should be italic.

### Quellen

1. *Shu"t Arugot Moseh*
2. **Minchat Yitzchak**`;

            const expected = `*Halachische Betrachtung*

This is *wichtig* and should be bold.
This is _kursiv_ and should be italic.

*Quellen*

• _Shu"t Arugot Moseh_
• *Minchat Yitzchak*`;

            expect(service.formatForWhatsApp(input)).toBe(withPrefixSuffix(expected));
        });
    });
});