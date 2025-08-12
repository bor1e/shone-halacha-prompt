import { Component, input, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { WhatsAppFormatterService } from '../../services/whatsapp-formatter.service';
import { MarkdownPipe } from '../../markdown.pipe';

export interface SummaryData {
    summary: string;
    language: string;
    isAdvancedLevel: boolean;
    halachaNumber?: number;
}

@Component({
    selector: 'app-summary-display',
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatChipsModule,
        MatTooltipModule,
        MarkdownPipe
    ],
    templateUrl: './summary-display.component.html',
    styleUrls: ['./summary-display.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SummaryDisplayComponent {
    private whatsappFormatter = inject(WhatsAppFormatterService);

    // Input properties
    summaryData = input.required<SummaryData>();
    showActions = input<boolean>(true);
    title = input<string>('');

    // Available languages for display
    private readonly availableLanguages = [
        { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'he', name: 'עברית', flag: '🇮🇱' },
        { code: 'ru', name: 'Русский', flag: '🇷🇺' }
    ];

    // State for UI feedback
    copied = false;
    whatsappShared = false;

    async copyToClipboard(): Promise<void> {
        const summary = this.summaryData().summary;
        if (!summary) return;

        try {
            await navigator.clipboard.writeText(summary);
            this.copied = true;
            setTimeout(() => this.copied = false, 2000);
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
        }
    }

    async shareWhatsApp(): Promise<void> {
        const summary = this.summaryData().summary;
        if (!summary) return;

        try {
            const formatted = this.whatsappFormatter.formatForWhatsApp(summary);

            // Copy to clipboard
            await navigator.clipboard.writeText(formatted);

            // Open WhatsApp share URL
            const url = this.whatsappFormatter.createWhatsAppShareUrl(formatted);
            window.open(url, '_blank');

            // Visual feedback
            this.whatsappShared = true;
            setTimeout(() => this.whatsappShared = false, 2000);
        } catch (error) {
            console.error('Failed to share on WhatsApp:', error);
        }
    }

    getLanguageDisplayName(languageInput: string): string {
        // Handle both language codes (de, en, etc.) and language names (German, English, etc.)
        let lang = this.availableLanguages.find(l => l.code === languageInput);
        if (!lang) {
            // Try to find by name if not found by code
            const languageNameMap: Record<string, string> = {
                'German': 'de',
                'Deutsch': 'de',
                'English': 'en',
                'French': 'fr',
                'Français': 'fr',
                'Hebrew': 'he',
                'עברית': 'he',
                'Russian': 'ru',
                'Русский': 'ru'
            };
            const code = languageNameMap[languageInput];
            if (code) {
                lang = this.availableLanguages.find(l => l.code === code);
            }
        }
        return lang ? lang.name : languageInput;
    }

    getLanguageFlag(languageInput: string): string {
        // Handle both language codes and language names
        let lang = this.availableLanguages.find(l => l.code === languageInput);
        if (!lang) {
            const languageNameMap: Record<string, string> = {
                'German': 'de',
                'Deutsch': 'de',
                'English': 'en',
                'French': 'fr',
                'Français': 'fr',
                'Hebrew': 'he',
                'עברית': 'he',
                'Russian': 'ru',
                'Русский': 'ru'
            };
            const code = languageNameMap[languageInput];
            if (code) {
                lang = this.availableLanguages.find(l => l.code === code);
            }
        }
        return lang ? lang.flag : '🌐';
    }

    getSummaryTypeIcon(): string {
        return this.summaryData().isAdvancedLevel ? 'article' : 'short_text';
    }

    getSummaryTypeLabel(): string {
        return this.summaryData().isAdvancedLevel ? 'Erweiterte Analyse' : 'Kurze Zusammenfassung';
    }

    getCardTitle(): string {
        const data = this.summaryData();
        const customTitle = this.title();

        if (customTitle) {
            return customTitle;
        }

        const flag = this.getLanguageFlag(data.language);
        const langName = this.getLanguageDisplayName(data.language);
        const type = this.getSummaryTypeLabel();

        return `${flag} ${langName} ${type}`;
    }
}
