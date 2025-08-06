import { Component, inject, LOCALE_ID, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PromptFormComponent } from './prompt-form/prompt-form.component';
import { FooterComponent } from './components/footer/footer.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AnalysisLanguageService } from './services/analysis-language.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, FooterComponent, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule],
  template: `
  <div class="app-container" [attr.dir]="isRTL ? 'rtl' : 'ltr'">
      <mat-toolbar color="primary">
        <span i18n="@@app.title">AI Schone Halacha</span>
        
        <span class="spacer"></span>
        
        @if (!environment.production) {
          <button 
            mat-button 
            routerLink="/design-library"
            class="design-library-link"
            [attr.aria-label]="'Design Library'"
          >
            <mat-icon>palette</mat-icon>
            Design Library
          </button>
        }
        
        <div class="language-switcher desktop-only">
          @for (lang of languages; track lang.code) {
            <button 
              [class.active]="lang.code === activeAnalysisLanguage"
              (click)="switchLanguage(lang.code)"
              [attr.aria-label]="lang.name"
              mat-button
            >
              {{ lang.flag }} {{ lang.name }}
            </button>
          }
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
            @for (lang of languages; track lang.code) {
              <button 
                mat-menu-item 
                [class.active]="lang.code === activeAnalysisLanguage"
                (click)="switchLanguage(lang.code)"
              >
                <span class="menu-item-content">
                  <span class="flag">{{ lang.flag }}</span>
                  <span class="name">{{ lang.name }}</span>
                  @if (lang.code === activeAnalysisLanguage) {
                    <mat-icon class="check-icon">check</mat-icon>
                  }
                </span>
              </button>
            }
          </mat-menu>
        </div>
        
        <span class="bsd-text">בס״ד</span>

      </mat-toolbar>
      
      <main>
        <router-outlet></router-outlet>
      </main>

      <app-footer></app-footer>
    </div>
  `,
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  currentLocale = inject(LOCALE_ID);
  private analysisLanguageService = inject(AnalysisLanguageService);

  languages = [
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'he', name: 'עברית', flag: '🇮🇱' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' }
  ];

  constructor() {
    console.info('[AppComponent] Initialized with locale_ID:', this.currentLocale);
  }

  get isRTL(): boolean {
    return ['he', 'ar', 'fa', 'ur'].includes(this.currentLocale);
  }

  /**
 * Get the currently active summary language
 */
  get activeAnalysisLanguage(): string {
    return this.analysisLanguageService.currentLanguage;
  }

  get environment() {
    return environment;
  }

  switchLanguage(locale: string): void {
    console.info('[AppComponent] Language switch requested:', {
      from: this.currentLocale,
      to: locale,
      currentUrl: window.location.href
    });

    // Reset summary language to default when switching routes
    if (this.analysisLanguageService.hasOverride) {
      console.info('[AppComponent] Resetting summary language due to route change');
      this.analysisLanguageService.resetToDefault();
    }

    // This logic correctly reloads the page to the new language path.
    const baseUrl = window.location.origin;
    if (locale === 'de') {
      // German is the base URL
      const newUrl = baseUrl;
      console.info('[AppComponent] Redirecting to German (base URL):', newUrl);
      window.location.href = newUrl;
    } else {
      const shortLocale = locale.split('-')[0];
      const newUrl = `${baseUrl}/${shortLocale}`;
      console.info('[AppComponent] Redirecting to localized URL:', newUrl);
      window.location.href = newUrl;
    }
  }
}
