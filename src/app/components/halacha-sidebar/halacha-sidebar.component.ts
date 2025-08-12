import { Component, signal, inject, output, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { FirestoreService } from '../../services/firestore.service';
import { HalachaWithSummaries, HalachaSummaryDocument } from '../../types/halacha.types';

export interface SummaryRequestEvent {
    halachaNumber: number;
    language: string;
    isAdvancedLevel: boolean;
}

@Component({
    selector: 'app-halacha-sidebar',
    imports: [
        CommonModule,
        MatListModule,
        MatButtonModule,
        MatIconModule,
        MatChipsModule,
        MatTooltipModule,
        MatProgressSpinnerModule,
        MatDividerModule
    ],
    templateUrl: './halacha-sidebar.component.html',
    styleUrls: ['./halacha-sidebar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HalachaSidebarComponent {
    private firestoreService = inject(FirestoreService);
    private router = inject(Router);

    recentHalachot = signal<HalachaWithSummaries[]>([]);
    isLoading = signal(false);
    error = signal('');

    // Output events
    requestSummary = output<SummaryRequestEvent>();
    loadHalacha = output<HalachaWithSummaries>();

    constructor() {
        this.loadRecentHalachot();
    }

    loadRecentHalachot(): void {
        this.isLoading.set(true);
        this.error.set('');

        this.firestoreService.getRecentHalachot().subscribe({
            next: (halachot) => {
                this.recentHalachot.set(halachot);
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Error loading recent halachot:', err);
                this.error.set('Fehler beim Laden der Halachot');
                this.isLoading.set(false);
            }
        });
    }

    onLoadHalacha(halacha: HalachaWithSummaries): void {
        // Navigate to the halacha view instead of emitting event
        this.router.navigate(['/halacha', halacha.halachaNumber]);
    }

    onRequestSummary(halachaNumber: number, language: string, isAdvancedLevel: boolean): void {
        this.requestSummary.emit({ halachaNumber, language, isAdvancedLevel });
    }

    getLanguageDisplayName(language: string): string {
        const languageMap: Record<string, string> = {
            'German': 'DE',
            'English': 'EN',
            'French': 'FR',
            'Hebrew': 'HE',
            'Russian': 'RU'
        };
        return languageMap[language] || language;
    }

    getSummaryTypeIcon(isAdvancedLevel: boolean): string {
        return isAdvancedLevel ? 'article' : 'short_text';
    }

    getSummaryTypeTooltip(isAdvancedLevel: boolean): string {
        return isAdvancedLevel ? 'Erweiterte Analyse' : 'Kurze Zusammenfassung';
    }

    truncateText(text: string, maxLength = 100): string {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
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

    hasSummary(halacha: HalachaWithSummaries, language: string, isAdvancedLevel: boolean): boolean {
        return halacha.summaries.some(s =>
            s.language === language && s.isAdvancedLevel === isAdvancedLevel
        );
    }

    getSummary(halacha: HalachaWithSummaries, language: string, isAdvancedLevel: boolean): HalachaSummaryDocument | null {
        return halacha.summaries.find(s =>
            s.language === language && s.isAdvancedLevel === isAdvancedLevel
        ) || null;
    }
}
