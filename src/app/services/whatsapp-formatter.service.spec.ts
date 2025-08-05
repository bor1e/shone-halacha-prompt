import { TestBed } from '@angular/core/testing';
import { WhatsAppFormatterService } from './whatsapp-formatter.service';

// Helper to wrap expected content with language-specific suffix
function withPrefixSuffix(content: string): string {
    if (!content) return '';
    const prefix = 'ב״ה';
    const suffix = 'Halachische Betrachtungen – Chabad-Bräuche\nFragen & Antworten zur praktischen Halacha gemäß Chabad-Tradition\nRabbi Menachem Mendel Nachshon und Rabbi Chaim Eliezer Chitrik\n\nÜbersetzung basierend auf KI';
    return `${prefix}\n\n${content}\n\n${suffix}`;
}

describe('WhatsAppFormatterService', () => {
    let service: WhatsAppFormatterService;

    beforeEach(() => {
        TestBed.configureTestingModule({ providers: [WhatsAppFormatterService] });
        service = TestBed.inject(WhatsAppFormatterService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('formatForWhatsApp', () => {
        it('should return empty string for null input', () => {
            expect(service.formatForWhatsApp(null)).toBe('');
        });

        it('should return empty string for undefined input', () => {
            expect(service.formatForWhatsApp(undefined)).toBe('');
        });

        it('should return empty string for empty string input', () => {
            expect(service.formatForWhatsApp('')).toBe('');
        });

        it('should return prefix and suffix for whitespace-only input', () => {
            const expected = 'ב״ה\n\n\n\nHalachische Betrachtungen – Chabad-Bräuche\nFragen & Antworten zur praktischen Halacha gemäß Chabad-Tradition\nRabbi Menachem Mendel Nachshon und Rabbi Chaim Eliezer Chitrik\n\nÜbersetzung basierend auf KI';
            expect(service.formatForWhatsApp('   \n\t  ')).toBe(expected);
        });
    });

    describe('List conversion', () => {
        it('should convert numbered lists to bullet points', () => {
            const input = `1. First item
2. Second item
3. Third item`;
            const expected = `• First item
• Second item
• Third item`;
            expect(service.formatForWhatsApp(input)).toBe(withPrefixSuffix(expected));
        });

        it('should convert dash lists to bullet points', () => {
            const input = `- First item
- Second item
- Third item`;
            const expected = `• First item
• Second item
• Third item`;
            expect(service.formatForWhatsApp(input)).toBe(withPrefixSuffix(expected));
        });

        it('should convert asterisk lists to bullet points', () => {
            const input = `* First item
* Second item
* Third item`;
            const expected = `• First item
• Second item
• Third item`;
            expect(service.formatForWhatsApp(input)).toBe(withPrefixSuffix(expected));
        });

        it('should handle mixed list types', () => {
            const input = `1. Numbered item
- Dash item
* Asterisk item`;
            const expected = `• Numbered item
• Dash item
• Asterisk item`;
            expect(service.formatForWhatsApp(input)).toBe(withPrefixSuffix(expected));
        });

        it('should handle lists with extra spaces', () => {
            const input = `1.   Item with spaces
2.    Another item`;
            const expected = `• Item with spaces
• Another item`;
            expect(service.formatForWhatsApp(input)).toBe(withPrefixSuffix(expected));
        });

        it('should not convert non-list items', () => {
            const input = `This is not a list.
1. But this is a list.
This is also not a list.`;
            const expected = `This is not a list.
• But this is a list.
This is also not a list.`;
            expect(service.formatForWhatsApp(input)).toBe(withPrefixSuffix(expected));
        });
    });

    describe('Bold and Italic conversion (correct WhatsApp formatting)', () => {
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

        it('should handle mixed bold and italic', () => {
            const input = 'This is **bold** and this is *italic*.';
            const expected = 'This is *bold* and this is _italic_.';
            expect(service.formatForWhatsApp(input)).toBe(withPrefixSuffix(expected));
        });

        it('should handle nested formatting', () => {
            const input = 'This is **bold with *italic* inside** text.';
            const expected = 'This is *bold with _italic_ inside* text.';
            expect(service.formatForWhatsApp(input)).toBe(withPrefixSuffix(expected));
        });

        it('should handle text with special characters', () => {
            const input = 'This is **bold with (parentheses)** and *italic with "quotes"*.';
            const expected = 'This is *bold with (parentheses)* and _italic with "quotes"_.';
            expect(service.formatForWhatsApp(input)).toBe(withPrefixSuffix(expected));
        });

        it('should handle text with numbers', () => {
            const input = 'The **halacha number 872** is *important*.';
            const expected = 'The *halacha number 872* is _important_.';
            expect(service.formatForWhatsApp(input)).toBe(withPrefixSuffix(expected));
        });

        it('should handle text with Hebrew characters', () => {
            const input = 'This is **ב״ה** and *הלכה מספר 872*.';
            const expected = 'This is *ב״ה* and _הלכה מספר 872_.';
            expect(service.formatForWhatsApp(input)).toBe(withPrefixSuffix(expected));
        });

        it('should handle asterisks that are not formatting markers', () => {
            const input = 'This contains an asterisk * in the middle.';
            const expected = 'This contains an asterisk * in the middle.';
            expect(service.formatForWhatsApp(input)).toBe(withPrefixSuffix(expected));
        });
    });

    describe('Headers conversion (correct WhatsApp formatting)', () => {
        it('should convert headers to bold', () => {
            const input = '# Main Title';
            const expected = '*Main Title*';
            expect(service.formatForWhatsApp(input)).toBe(withPrefixSuffix(expected));
        });

        it('should convert ## headers to bold', () => {
            const input = '## Sub Title';
            const expected = '*Sub Title*';
            expect(service.formatForWhatsApp(input)).toBe(withPrefixSuffix(expected));
        });

        it('should convert ### headers to bold', () => {
            const input = '### Section Title';
            const expected = '*Section Title*';
            expect(service.formatForWhatsApp(input)).toBe(withPrefixSuffix(expected));
        });

        it('should convert lines with only bold markers to bold', () => {
            const input = '**Sources**';
            const expected = '*Sources*';
            expect(service.formatForWhatsApp(input)).toBe(withPrefixSuffix(expected));
        });

        it('should handle headers with extra spaces', () => {
            const input = '#   Title with spaces   ';
            const expected = '*Title with spaces*';
            expect(service.formatForWhatsApp(input)).toBe(withPrefixSuffix(expected));
        });

        it('should handle multiple headers in same text', () => {
            const input = `# Main Title
## Sub Title
### Section Title`;
            const expected = `*Main Title*
*Sub Title*
*Section Title*`;
            expect(service.formatForWhatsApp(input)).toBe(withPrefixSuffix(expected));
        });
    });

    describe('Complex scenarios', () => {
        it('should handle complex document with all formatting', () => {
            const input = `# Main Title

## Subsection

This is **important** text with *emphasis*.

### Sources

1. **Shu"t Arugot Moseh**
2. *Minchat Yitzchak*
3. **Rambam** with *commentary*`;

            const expected = `*Main Title*

*Subsection*

This is *important* text with _emphasis_.

*Sources*

• *Shu"t Arugot Moseh*
• _Minchat Yitzchak_
• *Rambam* with _commentary_`;
            expect(service.formatForWhatsApp(input)).toBe(withPrefixSuffix(expected));
        });

        it('should handle lists with formatting', () => {
            const input = `1. **Bold item**
2. *Italic item*
3. **Bold with *italic***`;
            const expected = `• *Bold item*
• _Italic item_
• *Bold with *italic**`;
            expect(service.formatForWhatsApp(input)).toBe(withPrefixSuffix(expected));
        });
    });

    describe('Whitespace cleanup', () => {
        it('should handle excessive newlines', () => {
            const input = 'Line 1\n\n\n\nLine 2';
            const expected = 'Line 1\n\nLine 2';
            expect(service.formatForWhatsApp(input)).toBe(withPrefixSuffix(expected));
        });

        it('should trim whitespace', () => {
            const input = '   Text with spaces   ';
            const expected = 'Text with spaces';
            expect(service.formatForWhatsApp(input)).toBe(withPrefixSuffix(expected));
        });
    });

    describe('createWhatsAppShareUrl', () => {
        it('should create proper WhatsApp share URL', () => {
            const text = 'Test message';
            const result = service.createWhatsAppShareUrl(text);
            expect(result).toBe('https://wa.me/?text=Test%20message');
        });

        it('should encode special characters in URL', () => {
            const text = 'Test message with & symbols and "quotes"';
            const result = service.createWhatsAppShareUrl(text);
            expect(result).toBe('https://wa.me/?text=Test%20message%20with%20%26%20symbols%20and%20%22quotes%22');
        });

        it('should handle Hebrew text in URL', () => {
            const text = 'ב״ה הלכה מספר 872';
            const result = service.createWhatsAppShareUrl(text);
            expect(result).toBe('https://wa.me/?text=%D7%91%D7%B4%D7%94%20%D7%94%D7%9C%D7%9B%D7%94%20%D7%9E%D7%A1%D7%A4%D7%A8%20872');
        });

        it('should handle empty text', () => {
            const result = service.createWhatsAppShareUrl('');
            expect(result).toBe('https://wa.me/?text=');
        });
    });

    describe('Edge cases and error handling', () => {
        it('should handle text with only asterisks', () => {
            const input = '***';
            const expected = '***';
            expect(service.formatForWhatsApp(input)).toBe(withPrefixSuffix(expected));
        });

        it('should handle text with unmatched asterisks', () => {
            const input = 'This has **unmatched and *unmatched';
            const expected = 'This has **unmatched and *unmatched';
            expect(service.formatForWhatsApp(input)).toBe(withPrefixSuffix(expected));
        });

        it('should handle text with multiple consecutive asterisks', () => {
            const input = 'This has *** and ****';
            const expected = 'This has ** and ***';
            expect(service.formatForWhatsApp(input)).toBe(withPrefixSuffix(expected));
        });

        it('should handle very long text', () => {
            const longText = 'A'.repeat(1000);
            const result = service.formatForWhatsApp(longText);
            expect(result).toContain('ב״ה');
            expect(result).toContain('Rabbi Menachem Mendel Nachshon und Rabbi Chaim Eliezer Chitrik');
            expect(result).toContain(longText);
        });

        it('should handle text with emoji', () => {
            const input = 'This has 🎉 **bold** and *italic* 🚀';
            const expected = 'This has 🎉 *bold* and _italic_ 🚀';
            expect(service.formatForWhatsApp(input)).toBe(withPrefixSuffix(expected));
        });
    });
});