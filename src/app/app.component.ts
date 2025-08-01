import { Component, inject, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromptFormComponent } from './prompt-form/prompt-form.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, PromptFormComponent, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule],
  template: `
  <div class="app-container" [attr.dir]="isRTL ? 'rtl' : 'ltr'">
      <mat-toolbar color="primary">
        <span i18n="@@app.title">Schone Halacha Analyse</span>
        
        <span class="spacer"></span>
        
        <div class="language-switcher desktop-only">
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
        
        <div class="mobile-only">
          <button 
            mat-icon-button 
            [matMenuTriggerFor]="languageMenu"
            [attr.aria-label]="'Language menu'"
            class="mobile-language-button"
          >
            <mat-icon>language</mat-icon>
          </button>
          <mat-menu #languageMenu="matMenu" class="language-menu">
            <button 
              mat-menu-item 
              *ngFor="let lang of languages" 
              [class.active]="lang.code === currentLocale"
              (click)="switchLanguage(lang.code)"
            >
              <span class="menu-item-content">
                <span class="flag">{{ lang.flag }}</span>
                <span class="name">{{ lang.name }}</span>
                <mat-icon *ngIf="lang.code === currentLocale" class="check-icon">check</mat-icon>
              </span>
            </button>
          </mat-menu>
        </div>
        
        <span class="bsd-text">בס״ד</span>

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
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'he', name: 'עברית', flag: '🇮🇱' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' }
  ];

  get isRTL(): boolean {
    return ['he', 'ar', 'fa', 'ur'].includes(this.currentLocale);
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
