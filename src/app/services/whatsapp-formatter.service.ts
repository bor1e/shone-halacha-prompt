import { Injectable, inject } from '@angular/core';
import { AnalysisLanguageService } from './analysis-language.service'; // Assuming this service exists

@Injectable({
    providedIn: 'root'
})
export class WhatsAppFormatterService {
    private analysisLanguageService = inject(AnalysisLanguageService);
    private readonly prefix = 'ב״ה';

    // This method is assumed to be correct
    private getSuffix(): string {
        const currentLanguage = this.analysisLanguageService.currentLanguage;
        const suffixes: Record<string, string> = { /* ... suffixes ... */ };
        return suffixes[currentLanguage] || suffixes['de'];
    }

    /**
     * Converts markdown text to WhatsApp-compatible formatting using a robust, ordered approach.
     * @param markdown The markdown text to convert
     * @returns WhatsApp-formatted text
     */
    formatForWhatsApp(markdown: string | null | undefined): string {
        if (!markdown) return '';

        let formatted = markdown;

        // 1. NORMALIZE BOLD: Replace all sequences of 3 or more asterisks with exactly two.
        // This is the key insight that simplifies the entire process.
        // e.g., "***...**" becomes "**...**"
        formatted = formatted.replace(/\*{3,}/g, '**');

        // 2. ITALICS: Convert markdown italics (*text*) to WhatsApp italics (_text_).
        // This MUST be done before converting bold. The regex correctly handles cases
        // like "(*word*)" and avoids touching bold markers.
        formatted = formatted.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '_$1_');

        // 3. BOLD: Convert all remaining markdown bold markers (**text**) to WhatsApp bold (*text*).
        // Since italics have been replaced with underscores, this regex is now safe and reliable.
        // The 's' flag allows '.' to match across newlines, handling multi-line paragraphs.
        formatted = formatted.replace(/\*\*(.*?)\*\*/gs, '*$1*');

        // 4. Final cleanup.
        formatted = formatted.replace(/\n{3,}/g, '\n\n').trim();

        return `${this.prefix}\n\n${formatted}\n\n${this.getSuffix()}`;
    }

    /**
     * Creates a WhatsApp share URL.
     */
    createWhatsAppShareUrl(text: string): string {
        const encodedText = encodeURIComponent(text);
        return `https://wa.me/?text=${encodedText}`;
    }
}