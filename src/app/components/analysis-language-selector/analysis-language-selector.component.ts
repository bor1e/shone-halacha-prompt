import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AnalysisLanguageService } from '../../services/analysis-language.service';

@Component({
    selector: 'app-analysis-language-selector',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule
    ],
    template: `
    <div class="analysis-language-selector">
      <mat-form-field appearance="outline" class="language-field">
        <mat-label i18n="@@analysis.language.label">Sprache auswählen</mat-label>
        <mat-select 
          [value]="currentLanguage()"
          (selectionChange)="onLanguageChange($event.value)"
          [attr.aria-label]="'Select analysis language'"
        >
          <mat-option 
            *ngFor="let lang of availableLanguages()" 
            [value]="lang.code"
            [class.default-option]="isDefaultLanguage(lang.code)"
          >
            <span class="option-content">
              <span class="flag">{{ lang.flag }}</span>
              <span class="name">{{ lang.name }}</span>
              <span *ngIf="isDefaultLanguage(lang.code)" class="default-indicator">
                (Default)
              </span>
            </span>
          </mat-option>
        </mat-select>
        <mat-icon matSuffix>translate</mat-icon>
      </mat-form-field>

      <button 
        *ngIf="hasOverride()"
        mat-icon-button 
        (click)="resetToDefault()"
        [matTooltip]="'Reset to default language'"
        class="reset-button"
        [attr.aria-label]="'Reset to default language'"
      >
        <mat-icon>refresh</mat-icon>
      </button>
    </div>
  `,
    styleUrls: ['./analysis-language-selector.component.scss']
})
export class AnalysisLanguageSelectorComponent {
    private analysisLanguageService = inject(AnalysisLanguageService);

    // Reactive properties
    currentLanguage = signal(this.analysisLanguageService.currentLanguage);
    availableLanguages = signal(this.analysisLanguageService.availableLanguageOptions);
    hasOverride = signal(this.analysisLanguageService.hasOverride);

    // Computed properties
    isDefaultLanguage = (code: string) => this.analysisLanguageService.isDefaultLanguage(code);

    constructor() {
        console.info('[AnalysisLanguageSelectorComponent] Initialized');

        // Subscribe to language changes
        this.analysisLanguageService.currentLanguage$.subscribe(lang => {
            this.currentLanguage.set(lang);
            console.info('[AnalysisLanguageSelectorComponent] Language updated to:', lang);
        });
    }

    /**
     * Handle language selection change
     */
    onLanguageChange(locale: string): void {
        console.info('[AnalysisLanguageSelectorComponent] Language selection changed:', {
            from: this.currentLanguage(),
            to: locale,
            isDefault: this.analysisLanguageService.isDefaultLanguage(locale)
        });

        if (this.analysisLanguageService.isDefaultLanguage(locale)) {
            // If user selects the default language, clear the override
            this.analysisLanguageService.clearOverride();
        } else {
            // Set the override
            this.analysisLanguageService.setOverride(locale);
        }

        // Update local state
        this.hasOverride.set(this.analysisLanguageService.hasOverride);
    }

    /**
     * Reset to the default language
     */
    resetToDefault(): void {
        console.info('[AnalysisLanguageSelectorComponent] Resetting to default language');
        this.analysisLanguageService.resetToDefault();
        this.hasOverride.set(this.analysisLanguageService.hasOverride);
    }
} 