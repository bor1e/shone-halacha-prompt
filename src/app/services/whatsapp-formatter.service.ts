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

        return `${this.prefix}\n\n${formatted}\n\n${this.suffix}`;
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