import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class WhatsAppFormatterService {

    private readonly prefix = 'ב״ה';
    private readonly suffix = 'הרב מנחם מענדל נחשון והרב חיים אליעזר חיטריק';

    /**
     * Converts markdown text to WhatsApp-compatible formatting with both BOLD and ITALIC.
     * The order of operations is critical.
     * @param markdown The markdown text to convert
     * @returns WhatsApp-formatted text
     */
    formatForWhatsApp(markdown: string): string {
        if (!markdown) return '';

        let formatted = markdown;

        // --- CORRECTED DEFINITIVE ORDER OF OPERATIONS ---

        // 1. Convert ITALIC first to avoid conflicts with the '*' character.
        formatted = this.convertItalic(formatted);

        // 2. Convert inline BOLD.
        formatted = this.convertBold(formatted);
        
        // 3. Convert HEADERS to BOLD.
        formatted = this.convertHeadersToBold(formatted);

        // 4. Convert lists.
        formatted = this.convertLists(formatted);

        // 5. Final cleanup.
        formatted = this.cleanupWhitespace(formatted);

        return `${this.prefix}\n\n${formatted}\n\n${this.suffix}`;
    }


    /**
     * Converts markdown headers (e.g. # Title or a line that is only bold) to WhatsApp BOLD.
     */
    private convertHeadersToBold(text: string): string {
        // Converts # Title, ## Title, etc. to *Title*
        text = text.replace(/^#{1,6}\s+(.+)$/gm, '*$1*');
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
        // (?<!\*) - Negative Lookbehind: Ensures the character before the asterisk is not another asterisk.
        // (?!\*)  - Negative Lookahead: Ensures the character after the asterisk is not another asterisk.
        return text.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '_$1_');
    }
    
    /**
     * Converts markdown lists to use a consistent bullet point.
     */
    private convertLists(text: string): string {
        text = text.replace(/^\d+\.\s+/gm, '• ');
        text = text.replace(/^[-*]\s+/gm, '• ');
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