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
            'de': 'Halachische Betrachtungen – Chabad-Bräuche\nFragen & Antworten zur praktischen Halacha gemäß Chabad-Tradition\nRabbi Menachem Mendel Nachshon und Rabbi Chaim Eliezer Chitrik\n\n_Zusammenfassung mit KI erstellt, kann Fehler und Ungenauigkeiten enthalten._',
            'en': 'Halachic Insights – Chabad Customs\nQ&A on Practical Halacha According to Chabad Tradition\nRabbi Menachem Mendel Nachshon and Rabbi Chaim Eliezer Chitrik\n\n_Summary created with AI, may contain errors and inaccuracies._',
            'fr': 'Études halakhiques – Coutumes Habad\nQuestions-réponses sur la Halakha pratique selon la tradition Habad\nRav Menahem Mendel Nachshon et Rav Haïm Eliezer Chitrik\n\n_Résumé créé avec l\'IA, peut contenir des erreurs et des inexactitudes._',
            'he': 'שונה הלכה - מנהגי חב"ד\nשו"ת הלכה למעשה עפ"י מנהגי חב"ד\nהרב מנחם מענדל נחשון והרב חיים אליעזר חיטריק\n\n_סיכום נוצר עם בינה מלאכותית, עלול להכיל שגיאות וחוסר דיוק._',
            'ru': 'Галахические размышления – Обычаи Хабада\nВопросы и ответы по практической Галахе по традиции Хабада\nРав Менахем Мендель Нахшон и рав Хаим Элиезер Хитрик\n\n_Резюме создано с помощью ИИ, может содержать ошибки и неточности._'
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

        // 1. Convert lists FIRST to remove list markers (*) so they don't
        //    interfere with the italic conversion. This is the key fix.
        formatted = this.convertLists(formatted);

        // 2. Convert Markdown italic (*text*) to WhatsApp italic (_text_) FIRST
        //    to avoid conflicts with bold conversion
        formatted = this.convertItalic(formatted);

        // 3. Convert headers to BOLD (after italic to avoid conflicts)
        formatted = this.convertHeadersToBold(formatted);

        // 4. Now convert Markdown bold (**text**) to WhatsApp bold (*text*)
        formatted = this.convertBold(formatted);

        // 5. Final cleanup.
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
     * Converts markdown lists to use a consistent bullet point.
     */
    private convertLists(text: string): string {
        // Remove blockquotes
        text = text.replace(/^>\s+/gm, '');
        // Convert dash and asterisk lists to bullet points
        text = text.replace(/^[-*]\s+/gm, '• ');
        // Clean up extra spaces in numbered lists
        text = text.replace(/^(\d+\.)\s+/gm, '$1 ');
        // Preserve numbered lists (no conversion)
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