import { Component, LOCALE_ID, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromptFormComponent } from './prompt-form/prompt-form.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, PromptFormComponent, MatToolbarModule, MatButtonModule],
  template: `
    <div class="app-container" [attr.dir]="isRTL ? 'rtl' : 'ltr'">
      <mat-toolbar color="primary">
        <span i18n="@@app.title">Schone Halacha Analyse</span>
        <span class="bsd-text">בס״ד</span>
        <span class="spacer"></span>
        <div class="language-switcher">
          <button 
            *ngFor="let lang of languages" 
            [class.active]="lang.code === currentLocale"
            (click)="switchLanguage(lang.code)"
            [attr.aria-label]="lang.name"
            mat-button
          >
            {{ lang.flag }} {{ lang.name }}
          </button>
        </div>
      </mat-toolbar>
      
      <main>
        <app-prompt-form></app-prompt-form>
      </main>
    </div>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  currentLocale = inject(LOCALE_ID);

  languages = [
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'en-US', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'he', name: 'עברית', flag: '🇮🇱' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' }
  ];

  get isRTL(): boolean {
    return this.currentLocale === 'he';
  }

  switchLanguage(locale: string): void {
    // For production builds, redirect to language-specific URL
    const baseUrl = window.location.origin;
    if (locale === 'de') {
      window.location.href = baseUrl;
    } else {
      const shortLocale = locale.split('-')[0];
      window.location.href = `${baseUrl}/${shortLocale}`;
    }
  }
}
