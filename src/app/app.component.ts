import { Component, inject, LOCALE_ID, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AnalysisLanguageService, LanguageOption } from './services/analysis-language.service';
import { environment } from '../environments/environment';

const BASE_URL_LOCALE = 'de';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, FooterComponent, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule],
  template: `
  <div class="app-container" [attr.dir]="isRTL ? 'rtl' : 'ltr'">
      <header class="app-header">
        <div class="header-container">
          <mat-toolbar>
            <span i18n="@@app.title">AI Schone Halacha</span>
            
            <span class="spacer"></span>
            
            <button
              mat-button
              routerLink="/translations"
              [attr.aria-label]="'Übersetzungen'"
            >
              <mat-icon>translate</mat-icon>
              <span class="desktop-only" i18n="@@nav.translations">Übersetzungen</span>
            </button>

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
        </div>
      </header>
      
      <main class="app-main">
        <div class="main-container">
          <router-outlet></router-outlet>
        </div>
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

  languages: readonly LanguageOption[] = this.analysisLanguageService.availableLanguageOptions;

  constructor() {
    console.info('[AppComponent] Initialized with locale_ID:', this.currentLocale);
  }

  get isRTL(): boolean {
    return ['he', 'ar', 'fa', 'ur'].includes(this.currentLocale);
  }

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

    this.resetSummaryLanguageOverride();
    window.location.href = this.localizedUrl(locale);
  }

  private resetSummaryLanguageOverride(): void {
    if (this.analysisLanguageService.hasOverride) {
      this.analysisLanguageService.resetToDefault();
    }
  }

  private localizedUrl(locale: string): string {
    const baseUrl = window.location.origin;
    if (locale === BASE_URL_LOCALE) {
      return baseUrl;
    }
    return `${baseUrl}/${locale.split('-')[0]}`;
  }
}
