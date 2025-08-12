import { Component, signal, inject, LOCALE_ID, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../api.service';
import { FirestoreService } from '../services/firestore.service';
import { HalachaSummaryResponse, HalachaWithSummaries } from '../types/halacha.types';
import { SummaryDisplayComponent, SummaryData } from '../components/summary-display/summary-display.component';
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
import { HalachaNumberExtractor } from '../utils/halacha-number-extractor';
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
        SummaryDisplayComponent,
        AnalysisLanguageSelectorComponent
    ],
    templateUrl: './prompt-form.component.html',
    styleUrls: ['./prompt-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PromptFormComponent {
    private api = inject(ApiService);
    private firestoreService = inject(FirestoreService);
    private dialog = inject(MatDialog);
    private locale = inject(LOCALE_ID);
    private whatsappFormatter = inject(WhatsAppFormatterService);
    private analysisLanguageService = inject(AnalysisLanguageService);

    hebrewText = signal('');
    isLoading = signal(false);
    summary = signal('');
    error = signal('');
    copied = signal(false);
    halachaNumber = signal<number | null>(null);
    currentAnalysisLanguage = signal(this.analysisLanguageService.currentLanguage);
    isAdvancedLevel = signal(true);

    // Computed property for summary display component
    get summaryData(): SummaryData | null {
        const summaryText = this.summary();
        const halachaNum = this.halachaNumber();

        if (!summaryText) return null;

        return {
            summary: summaryText,
            language: this.currentAnalysisLanguage(),
            isAdvancedLevel: this.isAdvancedLevel(),
            halachaNumber: halachaNum || undefined
        };
    }

    constructor() {
        console.info('[PromptFormComponent] Initialized with locale_ID:', this.locale);

        // Subscribe to summary language changes
        this.analysisLanguageService.currentLanguage$.subscribe({
            next: (lang) => {
                this.currentAnalysisLanguage.set(lang);
                console.info('[PromptFormComponent] Summary language changed to:', lang);
            },
            error: (error) => {
                console.error('[PromptFormComponent] Error in language subscription:', error);
            }
        });
    }

    get textDirection(): 'rtl' | 'ltr' {
        // Determine text direction based on locale
        return this.locale === 'he' ? 'rtl' : 'ltr';
    }

    updateHebrewText(value: string) {
        this.hebrewText.set(value);
        // Try to extract halacha number when text changes
        this.extractHalachaNumber();
    }

    private extractHalachaNumber(): void {
        const extractedNumber = HalachaNumberExtractor.extractHalachaNumber(this.hebrewText());
        this.halachaNumber.set(extractedNumber);
    }



    async submit() {
        console.info('[PromptFormComponent] Submit called with locale_ID:', this.locale);

        if (!this.hebrewText()) {
            this.error.set('Bitte füllen Sie das Textfeld aus.');
            return;
        }

        // Check if we have a halacha number
        let finalHalachaNumber = this.halachaNumber();

        if (!finalHalachaNumber) {
            // Try to extract again
            this.extractHalachaNumber();
            finalHalachaNumber = this.halachaNumber();

            if (!finalHalachaNumber) {
                // Show dialog for manual input
                const dialogRef = this.dialog.open(HalachaNumberDialogComponent, {
                    width: '500px',
                    data: {
                        hebrewText: this.hebrewText(),
                    } as HalachaNumberDialogData
                });

                try {
                    const result = await dialogRef.afterClosed().toPromise();
                    if (result && result.halachaNumber) {
                        finalHalachaNumber = result.halachaNumber;
                        this.halachaNumber.set(finalHalachaNumber);
                    } else {
                        // User cancelled
                        return;
                    }
                } catch (error) {
                    console.error('Dialog error:', error);
                    return;
                }
            }
        }

        if (finalHalachaNumber) {
            await this.generateSummary(finalHalachaNumber);
        }
    }

    /**
     * Generates a summary for a halacha (new or existing)
     */
    async generateSummary(halachaNumber: number, hebrewText?: string): Promise<void> {
        const language = this.currentAnalysisLanguage();
        const isAdvanced = this.isAdvancedLevel();

        // Check if summary already exists
        const existingSummary = await this.firestoreService.getExistingSummary(
            halachaNumber,
            language,
            isAdvanced
        ).toPromise();

        if (existingSummary) {
            console.info('[PromptFormComponent] Using existing summary');
            this.summary.set(existingSummary.summary);
            return;
        }

        // Need to get Hebrew text if not provided
        let textToUse = hebrewText || this.hebrewText();

        if (!textToUse) {
            // Try to get from Firestore
            const halachaDoc = await this.firestoreService.getHalachaByNumber(halachaNumber).toPromise();
            if (halachaDoc) {
                textToUse = halachaDoc.hebrewText;
                // Update the form with the loaded text
                this.hebrewText.set(textToUse);
                this.halachaNumber.set(halachaNumber);
            } else {
                this.error.set('Halacha-Text nicht gefunden.');
                return;
            }
        }

        console.info('[PromptFormComponent] Calling API with:', {
            locale: this.locale,
            analysisLanguage: language,
            halachaNumber: halachaNumber,
            isAdvancedLevel: isAdvanced,
            textLength: textToUse.length
        });

        this.isLoading.set(true);
        this.error.set('');
        this.summary.set('');

        // Pass both Hebrew text and halacha number to the API
        this.api.generateSummary(textToUse, halachaNumber, isAdvanced).subscribe({
            next: (response: HalachaSummaryResponse) => {
                console.info('[PromptFormComponent] API response received:', {
                    locale: this.locale,
                    analysisLanguage: language,
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

    /**
     * Loads an existing halacha from the sidebar
     */
    onLoadHalacha(halacha: HalachaWithSummaries): void {
        this.hebrewText.set(halacha.hebrewText);
        this.halachaNumber.set(halacha.halachaNumber);
        this.summary.set(''); // Clear current summary
        this.error.set('');
    }

    /**
     * Requests a summary for an existing halacha
     */
    async onRequestSummary(event: { halachaNumber: number; language: string; isAdvancedLevel: boolean }): Promise<void> {
        // Set the analysis language and level
        this.analysisLanguageService.setOverride(event.language);
        this.isAdvancedLevel.set(event.isAdvancedLevel);

        await this.generateSummary(event.halachaNumber);
    }
} 