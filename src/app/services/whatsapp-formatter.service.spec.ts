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
            const expected = `1. First item
2. Second item
3. Third item`;
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
            const expected = `1. Numbered item
• Dash item
• Asterisk item`;
            expect(service.formatForWhatsApp(input)).toBe(withPrefixSuffix(expected));
        });

        it('should not convert non-list items', () => {
            const input = `This is not a list.
1. But this is a list.
This is also not a list.`;
            const expected = `This is not a list.
1. But this is a list.
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

1. *Shu"t Arugot Moseh*
2. _Minchat Yitzchak_
3. *Rambam* with _commentary_`;
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

describe('Complex halachic content formatting', () => {

    let service: WhatsAppFormatterService;

    beforeEach(() => {
        TestBed.configureTestingModule({ providers: [WhatsAppFormatterService] });
        service = TestBed.inject(WhatsAppFormatterService);
    });

    it('should properly format complex halachic analysis for WhatsApp', () => {
        const input = `
        ***Der Chatam Sofer* bezeugt, dass er in einer identischen Situation ebenfalls den Segen in der Nacht gesprochen hätte. Er betont jedoch, dass er dies als eine einmalige Ausnahmeregelung (*hora'at sha'ah*) deklariert hätte, die durch die besonderen Umstände gerechtfertigt ist. Dies sei notwendig, um zu vermeiden, dass in der Öffentlichkeit eine Handlung erlaubt wird, die für viele befremdlich wirkt und etablierten Bräuchen widerspricht. Der Hauptgrund für die Zurückhaltung ist der Respekt vor den jüdischen Bräuchen (*Minhag*), insbesondere dem Brauch, den Segen bei der Tora-Lesung zu sprechen, der nicht leichtfertig missachtet werden darf.**
        `;
        // ***Auch der Autor des *Petach Hadvir* erörtert diese Frage ausführlich.*** Er zitiert die Ansicht, dass der Segen im Stehen gesprochen wird, weil er dem *Hallel* gleicht, welches ebenfalls nicht nachts gesagt wird. Er schließt jedoch, dass es auch andere Gründe für das Stehen geben könnte und dies daher kein schlüssiger Beweis gegen das Sprechen bei Nacht ist. Der *Sdei Chemed* fasst die Position des *Petach Hadvir* zusammen: ***Die Angelegenheit ist unentschieden, und es ist nicht eindeutig, ob man den Segen nachts sprechen darf oder nicht.***

        // ***Zusammenfassend gibt es drei Hauptgründe, warum man den Segen *l'chatchila* (von vornherein) nicht nachts sprechen sollte: a) Er steht anstelle des Dankopfers. b) Er wird mit dem *Hallel* verglichen. c) Der etablierte Brauch ist, ihn während der Tora-Lesung zu sprechen.***

        // ***Spätere Autoritäten (*Poskim*) haben die Worte des *Chatam Sofer* als halachische Richtlinie übernommen.*** Der *Ben Ish Chai*² und der *Kaf Hachaim* schreiben, dass man *Birkat Hagomel* im Stehen und bei Tag sprechen soll, da der Segen an die Stelle des Dankopfers tritt. ***Daher sollte der Segen nicht nachts gesprochen werden, sondern nur bei Tag. Wenn man ihn jedoch *bedi'avad* (nachträglich) in der Nacht gesprochen hat, hat man seine Pflicht erfüllt.***

        // Der *Tzitz Eliezer*³ ***analysiert diese Schlussfolgerung und merkt an, dass der *Ben Ish Chai* und der *Kaf Hachaim* den Hauptgrund des *Chatam Sofer* falsch interpretieren.*** Der Kern der Bedenken des *Chatam Sofer* war nicht die Verbindung zum Dankopfer, ***sondern die Abweichung von einem etablierten Brauch (*Minhag*)***. Der Brauch, den Segen nach der Tora-Lesung zu sprechen, ist fest verankert, und man sollte es vermeiden, öffentlich etwas zu tun, was für die Gemeinde befremdlich wirkt oder die Bräuche Israels missachtet.⁴

        // ***Obwohl es also nach dem reinen Gesetz (*me'ikar hadin*) erlaubt ist, den Segen nachts zu sprechen, ist es in der Praxis vorzuziehen (*l'chatchila*), *Birkat Hagomel* bei Tag zu sprechen.***

        // **Quellen**
        // 1. *Responsa Chatam Sofer, Orach Chaim, Siman 51.*
        // 2. *Ben Ish Chai, Shana Aleph, Parashat Ekev, Se'if 3.*
        // 3. *Responsa Tzitz Eliezer, Chelek 13, Siman 17.*
        // 4. *Sdei Chemed, Ma'arechet Berachot, Siman 2, Ot 10.*
        // `;

        const expectedLines = [
            '*_Der Chatam Sofer_ bezeugt, dass er in einer identischen Situation ebenfalls den Segen in der Nacht gesprochen hätte. Er betont jedoch, dass er dies als eine einmalige Ausnahmeregelung (_hora\'at sha\'ah_) deklariert hätte, die durch die besonderen Umstände gerechtfertigt ist. Dies sei notwendig, um zu vermeiden, dass in der Öffentlichkeit eine Handlung erlaubt wird, die für viele befremdlich wirkt und etablierten Bräuchen widerspricht. Der Hauptgrund für die Zurückhaltung ist der Respekt vor den jüdischen Bräuchen (_Minhag_), insbesondere dem Brauch, den Segen bei der Tora-Lesung zu sprechen, der nicht leichtfertig missachtet werden darf.*',

            // '*Auch der Autor des _Petach Hadvir_ erörtert diese Frage ausführlich.* Er zitiert die Ansicht, dass der Segen im Stehen gesprochen wird, weil er dem _Hallel_ gleicht, welches ebenfalls nicht nachts gesagt wird. Er schließt jedoch, dass es auch andere Gründe für das Stehen geben könnte und dies daher kein schlüssiger Beweis gegen das Sprechen bei Nacht ist. Der _Sdei Chemed_ fasst die Position des _Petach Hadvir_ zusammen: *Die Angelegenheit ist unentschieden, und es ist nicht eindeutig, ob man den Segen nachts sprechen darf oder nicht.*',

            // '*Zusammenfassend gibt es drei Hauptgründe, warum man den Segen _l\'chatchila_ (von vornherein) nicht nachts sprechen sollte: a) Er steht anstelle des Dankopfers. b) Er wird mit dem _Hallel_ verglichen. c) Der etablierte Brauch ist, ihn während der Tora-Lesung zu sprechen.*',

            // '*Spätere Autoritäten (_Poskim_) haben die Worte des _Chatam Sofer_ als halachische Richtlinie übernommen.* Der _Ben Ish Chai_² und der _Kaf Hachaim_ schreiben, dass man _Birkat Hagomel_ im Stehen und bei Tag sprechen soll, da der Segen an die Stelle des Dankopfers tritt. *Daher sollte der Segen nicht nachts gesprochen werden, sondern nur bei Tag. Wenn man ihn jedoch _bedi\'avad_ (nachträglich) in der Nacht gesprochen hat, hat man seine Pflicht erfüllt.*',

            // 'Der _Tzitz Eliezer_³ *analysiert diese Schlussfolgerung und merkt an, dass der _Ben Ish Chai_ und der _Kaf Hachaim_ den Hauptgrund des _Chatam Sofer_ falsch interpretieren.* Der Kern der Bedenken des _Chatam Sofer_ war nicht die Verbindung zum Dankopfer, *sondern die Abweichung von einem etablierten Brauch (_Minhag_)*. Der Brauch, den Segen nach der Tora-Lesung zu sprechen, ist fest verankert, und man sollte es vermeiden, öffentlich etwas zu tun, was für die Gemeinde befremdlich wirkt oder die Bräuche Israels missachtet.⁴',

            // '*Obwohl es also nach dem reinen Gesetz (_me\'ikar hadin_) erlaubt ist, den Segen nachts zu sprechen, ist es in der Praxis vorzuziehen (_l\'chatchila_), _Birkat Hagomel_ bei Tag zu sprechen.*',
            // '*Quellen*',
            // '1. _Responsa Chatam Sofer, Orach Chaim, Siman 51._',
            // '2. _Ben Ish Chai, Shana Aleph, Parashat Ekev, Se\'if 3._',
            // '3. _Responsa Tzitz Eliezer, Chelek 13, Siman 17._',
            // '4. _Sdei Chemed, Ma\'arechet Berachot, Siman 2, Ot 10._'
        ];

        // Process each line individually through the WhatsApp formatter
        const inputLines = input.trim().split('\n').map(line => line.trim()).filter(line => line.length > 0);
        const resultLines: string[] = [];

        for (const line of inputLines) {
            const formattedLine = service.formatForWhatsApp(line);
            resultLines.push(formattedLine);
        }

        // Validate each line against the expected array
        expect(resultLines.length).toBe(expectedLines.length);

        for (let i = 0; i < expectedLines.length; i++) {
            console.log(`Line ${i + 1}:`);
            console.log(`Expected: "${expectedLines[i]}"`);
            console.log(`Actual:   "${resultLines[i]}"`);
            expect(resultLines[i]).toEqual(withPrefixSuffix(expectedLines[i]));
        }
    });

    it('should preserve Hebrew text with mixed formatting', () => {
        const input = `**ברכת הגומל** und *קרבן תודה* sind wichtige Konzepte.`;
        const result = service.formatForWhatsApp(input);

        expect(result).toContain('*ברכת הגומל*');
        expect(result).toContain('_קרבן תודה_');
        expect(result).toContain('sind wichtige Konzepte.');
    });

    it('should handle special characters and punctuation in halachic text', () => {
        const input = `**Halacha 876** - Das Sprechen von *Birkat Hagomel* (ברכת הגומל) in der Nacht.`;
        const result = service.formatForWhatsApp(input);

        expect(result).toContain('*Halacha 876*');
        expect(result).toContain('_Birkat Hagomel_');
        expect(result).toContain('(ברכת הגומל)');
        expect(result).toContain('in der Nacht.');
    });
});
