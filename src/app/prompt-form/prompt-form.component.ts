import { Component, signal, inject, LOCALE_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../api.service';
import { HalachaSummaryResponse } from '../types/halacha.types';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { MarkdownPipe } from '../markdown.pipe';
import { HalachaNumberExtractor } from '../utils/halacha-number-extractor';
import { HalachaNumberDialogComponent, HalachaNumberDialogData } from '../components/halacha-number-dialog/halacha-number-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

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
        MatDialogModule,
        MarkdownPipe
    ],
    templateUrl: './prompt-form.component.html',
    styleUrls: ['./prompt-form.component.scss']
})
export class PromptFormComponent {
    private api = inject(ApiService);
    private dialog = inject(MatDialog);
    private locale = inject(LOCALE_ID);

    hebrewText = signal('');
    isLoading = signal(false);
    summary = signal('');
    error = signal('');
    copied = signal(false);
    halachaNumber = signal<number | null>(null);

    get textDirection(): 'rtl' | 'ltr' {
        // Determine text direction based on locale or content
        // Here, we check if the locale starts with 'he' (Hebrew) for RTL, otherwise LTR
        return this.locale.startsWith('he') ? 'rtl' : 'ltr';
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

    copyToClipboard() {
        if (this.summary()) {
            navigator.clipboard.writeText(this.summary()).then(() => {
                this.copied.set(true);
                setTimeout(() => this.copied.set(false), 2000);
            });
        }
    }

    async submit() {
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

        this.isLoading.set(true);
        this.error.set('');
        this.summary.set('');

        // Pass both Hebrew text and halacha number to the API
        this.api.generateAnalysis(this.hebrewText(), finalHalachaNumber || undefined).subscribe({
            next: (response: HalachaSummaryResponse) => {
                this.summary.set(response.summary);
                this.isLoading.set(false);
            },
            error: (err: Error) => {
                this.error.set('Fehler beim Erstellen der Zusammenfassung. Bitte versuchen Sie es erneut.');
                this.isLoading.set(false);
                console.error('API Error:', err);
            }
        });
    }
} 