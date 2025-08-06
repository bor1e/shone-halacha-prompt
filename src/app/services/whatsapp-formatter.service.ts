import { Injectable, inject } from '@angular/core';
import { AnalysisLanguageService } from './analysis-language.service';

@Injectable({
    providedIn: 'root'
})
export class WhatsAppFormatterService {
    private analysisLanguageService = inject(AnalysisLanguageService);

    private readonly prefix = 'ב״ה';

    /**
     * Gets the language-specific suffix for WhatsApp sharing
     */
    private getSuffix(): string {
        const currentLanguage = this.analysisLanguageService.currentLanguage;

        const suffixes: Record<string, string> = {
            'de': 'Halachische Betrachtungen – Chabad-Bräuche\nFragen & Antworten zur praktischen Halacha gemäß Chabad-Tradition\nRabbi Menachem Mendel Nachshon und Rabbi Chaim Eliezer Chitrik\n\nÜbersetzung basierend auf KI',
            'en': 'Halachic Insights – Chabad Customs\nQ&A on Practical Halacha According to Chabad Tradition\nRabbi Menachem Mendel Nachshon and Rabbi Chaim Eliezer Chitrik\n\nAI-based translation',
            'fr': 'Études halakhiques – Coutumes Habad\nQuestions-réponses sur la Halakha pratique selon la tradition Habad\nRav Menahem Mendel Nachshon et Rav Haïm Eliezer Chitrik\n\nTraduction basée sur l\'IA',
            'he': 'שונה הלכה - מנהגי חב"ד\nשו"ת הלכה למעשה עפ"י מנהגי חב"ד\nהרב מנחם מענדל נחשון והרב חיים אליעזר חיטריק\n\nתרגום מבוסס בינה מלאכותית',
            'ru': 'Галахические размышления – Обычаи Хабада\nВопросы и ответы по практической Галахе по традиции Хабада\nРав Менахем Мендель Нахшон и рав Хаим Элиезер Хитрик\n\nПеревод на основе ИИ'
        };

        return suffixes[currentLanguage] || suffixes['de']; // Default to German
    }

    /**
     * Converts markdown text to WhatsApp-compatible formatting with both BOLD and ITALIC.
     * The order of operations is critical.
     * @param markdown The markdown text to convert
     * @returns WhatsApp-formatted text
     */
    formatForWhatsApp(markdown: string | null | undefined): string {
        if (!markdown) return '';

        let formatted = markdown;

        // 1. Convert lists first
        formatted = this.convertLists(formatted);

        // 2. Handle complex nested formatting (***text***) before simple formatting
        formatted = this.convertComplexNestedFormatting(formatted);

        // 3. Convert Markdown italic (*text*) to WhatsApp italic (_text_) FIRST
        //    to avoid conflicts with bold conversion
        formatted = this.convertItalic(formatted);

        // 4. Convert headers to BOLD (after italic to avoid conflicts)
        formatted = this.convertHeadersToBold(formatted);

        // 5. Now convert Markdown bold (**text**) to WhatsApp bold (*text*)
        formatted = this.convertBold(formatted);

        // 6. Final cleanup.
        formatted = this.cleanupWhitespace(formatted);

        return `${this.prefix}\n\n${formatted}\n\n${this.getSuffix()}`;
    }


    /**
     * Converts markdown headers (e.g. # Title or a line that is only bold) to WhatsApp BOLD.
     */
    private convertHeadersToBold(text: string): string {
        // Converts # Title, ## Title, etc. to *Title* (trimmed)
        text = text.replace(/^#{1,6}\s+(.+)$/gm, (match, title) => `*${title.trim()}*`);
        // Converts lines that are only bolded (e.g., **Sources**) to *Sources*
        text = text.replace(/^\*\*(.*?)\*\*$/gm, '*$1*');
        return text;
    }

    /**
     * Converts Markdown bold (**text**) to WhatsApp bold (*text*).
     */
    private convertBold(text: string): string {
        // This regex specifically targets two asterisks on each side.
        return text.replace(/\*\*(.*?)\*\*/g, '*$1*');
    }

    /**
     * Converts Markdown italic (*text*) to WhatsApp italic (_text_).
     * This regex uses negative lookarounds to safely target single asterisks
     * and avoid interfering with any other formatting.
     */
    private convertItalic(text: string): string {
        // Convert single asterisks to underscores, but avoid:
        // 1. Asterisks that are part of bold markers (**)
        // 2. Asterisks that are already part of WhatsApp bold (*text*)
        return text.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '_$1_');
    }

    /**
     * Converts numbered lists to bullet points for WhatsApp formatting.
     */
    private convertLists(text: string): string {
        // Convert dash and asterisk lists to bullet points
        text = text.replace(/^[-*]\s+/gm, '• ');
        return text;
    }

    /**
     * Handles complex nested formatting like ***text*** (bold with italic inside)
     * This must be done before simple formatting to avoid conflicts.
     */
    private convertComplexNestedFormatting(text: string): string {
        // Handle the specific pattern ***text*...** (three asterisks, then italic text, then two asterisks)
        // This is a more complex pattern that appears in the halachic content
        // Use a more precise regex to match the exact pattern
        text = text.replace(/\*\*\*([^*]+)\*\*/g, '*$1*');

        // Convert ***text*** to *text* (bold with italic inside becomes just bold)
        // This handles cases where text is both bold and italic in markdown
        text = text.replace(/\*\*\*([^*]+)\*\*\*/g, '*$1*');

        return text;
    }

    /**
     * Cleans up excessive whitespace.
     */
    private cleanupWhitespace(text: string): string {
        return text.replace(/\n{3,}/g, '\n\n').trim();
    }

    /**
     * Creates a WhatsApp share URL.
     */
    createWhatsAppShareUrl(text: string): string {
        const encodedText = encodeURIComponent(text);
        return `https://wa.me/?text=${encodedText}`;
    }
}