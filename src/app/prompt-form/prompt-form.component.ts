import { Component, signal, inject, LOCALE_ID, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { HalachaTranslationService } from '../halacha-translation.service';
import { HalachaSummaryResponse } from '../types/halacha.types';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CommonModule } from '@angular/common';
import { MarkdownPipe } from '../markdown.pipe';
import { HalachaNumberExtractor } from '../hebrew-text/halacha-number-extractor';
import { HalachaNumberDialogComponent, HalachaNumberDialogData } from '../components/halacha-number-dialog/halacha-number-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { WhatsAppFormatterService } from '../services/whatsapp-formatter.service';
import { AnalysisLanguageService } from '../services/analysis-language.service';
import { AnalysisLanguageSelectorComponent } from '../components/analysis-language-selector/analysis-language-selector.component';

@Component({
    selector: 'app-prompt-form',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatCardModule,
        MatToolbarModule,
        MatIconModule,
        MatTooltipModule,
        MatSlideToggleModule,
        MatDialogModule,
        MarkdownPipe,
        AnalysisLanguageSelectorComponent
    ],
    templateUrl: './prompt-form.component.html',
    styleUrls: ['./prompt-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PromptFormComponent {
    private api = inject(HalachaTranslationService);
    private dialog = inject(MatDialog);
    private locale = inject(LOCALE_ID);
    private whatsappFormatter = inject(WhatsAppFormatterService);
    private analysisLanguageService = inject(AnalysisLanguageService);
    private route = inject(ActivatedRoute);

    hebrewText = signal('');
    isLoading = signal(false);
    summary = signal('');
    error = signal('');
    copied = signal(false);
    halachaNumber = signal<number | null>(null);
    currentAnalysisLanguage = signal(this.analysisLanguageService.currentLanguage);
    isAdvancedLevel = signal(true);

    constructor() {
        console.info('[PromptFormComponent] Initialized with locale_ID:', this.locale);

        this.analysisLanguageService.currentLanguage$.subscribe({
            next: (lang) => {
                this.currentAnalysisLanguage.set(lang);
                console.info('[PromptFormComponent] Summary language changed to:', lang);
            },
            error: (error: unknown) => {
                console.error('[PromptFormComponent] Error in language subscription:', error);
            }
        });

        this.route.queryParamMap.subscribe((params: ParamMap) => {
            const requestedHalacha = Number(params.get('halacha'));
            if (!Number.isInteger(requestedHalacha) || requestedHalacha <= 0) {
                return;
            }
            const languageCode = params.get('lang');
            if (languageCode) {
                this.analysisLanguageService.setOverride(languageCode);
            }
            this.isAdvancedLevel.set(params.get('level') !== 'concise');
            this.halachaNumber.set(requestedHalacha);
            this.loadStoredTranslation(requestedHalacha);
        });
    }

    private loadStoredTranslation(requestedHalacha: number): void {
        this.isLoading.set(true);
        this.error.set('');
        this.summary.set('');

        this.api.generateSummary(null, requestedHalacha, this.isAdvancedLevel(), false).subscribe({
            next: (response: HalachaSummaryResponse) => {
                this.summary.set(response.summary);
                this.hebrewText.set(response.hebrewText);
                this.isLoading.set(false);
            },
            error: (loadError: Error) => {
                console.error('[PromptFormComponent] Loading stored translation failed:', loadError);
                this.error.set('Fehler beim Laden der gespeicherten Übersetzung. Bitte versuchen Sie es erneut.');
                this.isLoading.set(false);
            }
        });
    }

    get textDirection(): 'rtl' | 'ltr' {
        return this.locale === 'he' ? 'rtl' : 'ltr';
    }

    updateHebrewText(value: string) {
        this.hebrewText.set(value);
        this.extractHalachaNumber();
    }

    private extractHalachaNumber(): void {
        const extractedNumber = HalachaNumberExtractor.extractHalachaNumber(this.hebrewText());
        this.halachaNumber.set(extractedNumber);
    }

    copyToClipboard() {
        if (this.summary()) {
            navigator.clipboard.writeText(this.summary()).then(() => {
                this.copied.set(true);
                setTimeout(() => this.copied.set(false), 2000);
            });
        }
    }

    async shareWhatsApp() {
        const summary = this.summary();
        if (!summary) return;
        const formatted = this.whatsappFormatter.formatForWhatsApp(summary);
        await navigator.clipboard.writeText(formatted);
        const url = this.whatsappFormatter.createWhatsAppShareUrl(formatted);
        window.open(url, '_blank');
        this.copied.set(true);
        setTimeout(() => this.copied.set(false), 2000);
    }

    regenerate() {
        this.submit(true);
    }

    async submit(forceRegenerate = false) {
        console.info('[PromptFormComponent] Submit called with locale_ID:', this.locale);

        if (!this.hebrewText()) {
            this.error.set('Bitte füllen Sie das Textfeld aus.');
            return;
        }

        let finalHalachaNumber = this.halachaNumber();

        if (!finalHalachaNumber) {
            this.extractHalachaNumber();
            finalHalachaNumber = this.halachaNumber();

            if (!finalHalachaNumber) {
                const dialogRef = this.dialog.open(HalachaNumberDialogComponent, {
                    width: '500px',
                    data: {
                        hebrewText: this.hebrewText(),
                    } as HalachaNumberDialogData
                });

                try {
                    const result = await firstValueFrom(dialogRef.afterClosed());
                    if (result && result.halachaNumber) {
                        finalHalachaNumber = result.halachaNumber;
                        this.halachaNumber.set(finalHalachaNumber);
                    } else {
                        return;
                    }
                } catch (error) {
                    console.error('Dialog error:', error);
                    return;
                }
            }
        }

        console.info('[PromptFormComponent] Calling API with:', {
            locale: this.locale,
            analysisLanguage: this.currentAnalysisLanguage(),
            halachaNumber: finalHalachaNumber,
            isAdvancedLevel: this.isAdvancedLevel(),
            textLength: this.hebrewText().length
        });

        this.isLoading.set(true);
        this.error.set('');
        this.summary.set('');

        this.api.generateSummary(this.hebrewText(), finalHalachaNumber ?? undefined, this.isAdvancedLevel(), forceRegenerate).subscribe({
            next: (response: HalachaSummaryResponse) => {
                console.info('[PromptFormComponent] API response received:', {
                    locale: this.locale,
                    analysisLanguage: this.currentAnalysisLanguage(),
                    summaryLength: response.summary.length
                });
                this.summary.set(response.summary);
                this.isLoading.set(false);
            },
            error: (err: Error) => {
                console.error('[PromptFormComponent] API Error:', err);
                this.error.set('Fehler beim Erstellen der Zusammenfassung. Bitte versuchen Sie es erneut.');
                this.isLoading.set(false);
            }
        });
    }
} 