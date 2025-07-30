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
        MarkdownPipe
    ],
    templateUrl: './prompt-form.component.html',
    styleUrls: ['./prompt-form.component.scss']
})
export class PromptFormComponent {
    private api = inject(ApiService);
    private localeId = inject(LOCALE_ID);

    hebrewText = signal('');
    isLoading = signal(false);
    summary = signal('');
    error = signal('');
    copied = signal(false);
    
    /**
     * Determines the text direction based on the current language locale.
     * @returns 'rtl' for Hebrew, 'ltr' for all others.
     */
    get textDirection(): 'rtl' | 'ltr' {
      return this.localeId.startsWith('he') ? 'rtl' : 'ltr';
    }
    
    updateHebrewText(value: string) {
        this.hebrewText.set(value);
    }

    copyToClipboard() {
        if (this.summary()) {
            navigator.clipboard.writeText(this.summary()).then(() => {
                this.copied.set(true);
                setTimeout(() => this.copied.set(false), 2000);
            });
        }
    }

    submit() {
        if (!this.hebrewText()) {
            this.error.set('Bitte füllen Sie das Textfeld aus.');
            return;
        }

        this.isLoading.set(true);
        this.error.set('');
        this.summary.set('');

        this.api.generateAnalysis(this.hebrewText()).subscribe({
            next: (response: HalachaSummaryResponse) => {
                this.summary.set(response.summary);
                this.isLoading.set(false);
            },
            error: (err) => {
                this.error.set('Fehler beim Erstellen der Zusammenfassung. Bitte versuchen Sie es erneut.');
                this.isLoading.set(false);
                console.error('API Error:', err);
            }
        });
    }
} 