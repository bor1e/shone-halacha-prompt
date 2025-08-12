import { Component, signal, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { FirestoreService } from '../../services/firestore.service';
import { ApiService } from '../../api.service';
import { AnalysisLanguageService } from '../../services/analysis-language.service';
import { HalachaDocument, HalachaSummaryDocument } from '../../types/halacha.types';
import { SummaryDisplayComponent, SummaryData } from '../summary-display/summary-display.component';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-halacha-view',
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatChipsModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        MatSlideToggleModule,
        MatDividerModule,
        SummaryDisplayComponent
    ],
    templateUrl: './halacha-view.component.html',
    styleUrls: ['./halacha-view.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HalachaViewComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private firestoreService = inject(FirestoreService);
    private apiService = inject(ApiService);
    private analysisLanguageService = inject(AnalysisLanguageService);

    halachaNumber = signal<number | null>(null);
    halacha = signal<HalachaDocument | null>(null);
    summaries = signal<HalachaSummaryDocument[]>([]);
    selectedSummary = signal<HalachaSummaryDocument | null>(null);
    isLoading = signal(false);
    isGeneratingSummary = signal(false);
    error = signal('');

    // Computed property for summary display component
    get selectedSummaryData(): SummaryData | null {
        const summary = this.selectedSummary();
        if (!summary) return null;

        return {
            summary: summary.summary,
            language: summary.language,
            isAdvancedLevel: summary.isAdvancedLevel,
            halachaNumber: summary.halachaNumber
        };
    }

    // Available languages for summaries
    availableLanguages = [
        { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'he', name: 'עברית', flag: '🇮🇱' },
        { code: 'ru', name: 'Русский', flag: '🇷🇺' }
    ];

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            const halachaNum = parseInt(params['halachaNumber']);
            if (halachaNum) {
                this.halachaNumber.set(halachaNum);
                this.loadHalacha(halachaNum);
            }
        });
    }

    private loadHalacha(halachaNumber: number): void {
        this.isLoading.set(true);
        this.error.set('');

        // Load original halacha
        this.firestoreService.getHalachaByNumber(halachaNumber).subscribe({
            next: (halacha) => {
                if (halacha) {
                    this.halacha.set(halacha);
                    this.loadSummaries(halachaNumber);
                } else {
                    this.error.set('Halacha nicht gefunden');
                    this.isLoading.set(false);
                }
            },
            error: (err) => {
                console.error('Error loading halacha:', err);
                this.error.set('Fehler beim Laden der Halacha');
                this.isLoading.set(false);
            }
        });
    }

    private loadSummaries(halachaNumber: number): void {
        this.firestoreService.getSummariesForHalacha(halachaNumber).subscribe({
            next: (summaries) => {
                this.summaries.set(summaries);
                this.selectDefaultSummary(summaries);
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Error loading summaries:', err);
                this.isLoading.set(false);
            }
        });
    }

    private selectDefaultSummary(summaries: HalachaSummaryDocument[]): void {
        console.log('[HalachaView] Selecting default summary from:', summaries);

        if (summaries.length === 0) {
            this.selectedSummary.set(null);
            return;
        }

        const currentLanguage = this.analysisLanguageService.currentTargetLanguage;
        console.log('[HalachaView] Current language:', currentLanguage);

        // Try to find a summary in the current language (advanced first, then concise)
        let defaultSummary = summaries.find(s =>
            s.language === currentLanguage && s.isAdvancedLevel
        );

        if (!defaultSummary) {
            defaultSummary = summaries.find(s =>
                s.language === currentLanguage && !s.isAdvancedLevel
            );
        }

        // If no summary in current language, take the first available
        if (!defaultSummary && summaries.length > 0) {
            defaultSummary = summaries[0];
        }

        console.log('[HalachaView] Selected default summary:', defaultSummary);

        if (defaultSummary) {
            this.selectedSummary.set(defaultSummary);
        } else {
            this.selectedSummary.set(null);
        }
    }

    onSummarySelect(summary: HalachaSummaryDocument): void {
        console.log('[HalachaView] Summary selected:', summary);
        this.selectedSummary.set(summary);
        console.log('[HalachaView] Selected summary signal updated to:', this.selectedSummary());
    }

    async onRequestSummary(language: string, isAdvanced: boolean): Promise<void> {
        const halachaNum = this.halachaNumber();
        const halacha = this.halacha();

        if (!halachaNum || !halacha) return;

        this.isGeneratingSummary.set(true);
        this.error.set('');

        try {
            // Set the language override for the API call
            this.analysisLanguageService.setOverride(language);

            const response = await firstValueFrom(this.apiService.generateSummary(
                halacha.hebrewText,
                halachaNum,
                isAdvanced
            ));

            if (response) {
                // Reload summaries to get the new one
                this.loadSummaries(halachaNum);
            }
        } catch (error) {
            console.error('Error generating summary:', error);
            this.error.set('Fehler beim Erstellen der Zusammenfassung');
        } finally {
            this.isGeneratingSummary.set(false);
        }
    }

    getSummariesForLanguage(language: string): HalachaSummaryDocument[] {
        return this.summaries().filter(s => s.language === language);
    }

    hasSummary(language: string, isAdvanced: boolean): boolean {
        return this.summaries().some(s =>
            s.language === language && s.isAdvancedLevel === isAdvanced
        );
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

    goBack(): void {
        this.router.navigate(['/']);
    }

    formatDate(date: Date): string {
        if (!date) return '';
        return new Intl.DateTimeFormat('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date));
    }
}
