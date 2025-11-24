import { Component, inject, LOCALE_ID, ChangeDetectionStrategy } from '@angular/core';

import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { DesignLibraryComponent } from './design-library.component';
import { FooterComponent } from '../footer/footer.component';
import { AnalysisLanguageService } from '../../services/analysis-language.service';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-design-library-layout',
    standalone: true,
    imports: [
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    DesignLibraryComponent,
    FooterComponent
],
    template: `
    <div class="app-container" [attr.dir]="isRTL ? 'rtl' : 'ltr'">
      <mat-toolbar color="primary">
        <span i18n="@@app.title">AI Schone Halacha</span>
        
        <span class="spacer"></span>
        
        <button 
          mat-button 
          routerLink="/"
          class="back-button"
          [attr.aria-label]="'Back to main app'"
        >
          <mat-icon>arrow_back</mat-icon>
          Back to App
        </button>
        
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
        <app-design-library></app-design-library>
      </main>

      <app-footer></app-footer>
    </div>
  `,
    styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;

      &[dir="rtl"] {
        .language-switcher {
          flex-direction: row-reverse;
        }
      }
    }

    mat-toolbar {
      background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%) !important;
      color: #1976d2 !important;
      border-bottom: 2px solid #90caf9;
      box-shadow: 0 2px 8px rgba(25, 118, 210, 0.15);
    }

    app-footer {
      background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
      border-top: 2px solid #90caf9;
      box-shadow: 0 -2px 8px rgba(25, 118, 210, 0.15);
    }

    .spacer {
      flex: 1 1 auto;
    }

    .bsd-text {
      font-size: 1.2rem;
      font-weight: 500;
      color: #1976d2;
      font-family: 'Times New Roman', serif;
      direction: rtl;
      text-align: right;
      white-space: nowrap;
      text-shadow: 0 1px 2px rgba(25, 118, 210, 0.3);
      margin-left: 16px;
    }

    .back-button {
      color: #1976d2 !important;
      border: 1px solid rgba(25, 118, 210, 0.3) !important;
      background: rgba(25, 118, 210, 0.1) !important;
      margin-right: 16px;
      transition: all 0.2s ease;

      &:hover {
        background: rgba(25, 118, 210, 0.2) !important;
        border-color: rgba(25, 118, 210, 0.5) !important;
      }

      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
        margin-right: 4px;
        filter: drop-shadow(0 1px 2px rgba(25, 118, 210, 0.3));
      }
    }

    .language-switcher {
      display: flex;
      gap: 8px;

      button {
        color: #1976d2;
        border: 1px solid rgba(25, 118, 210, 0.5);
        background: rgba(25, 118, 210, 0.1);
        padding: 6px 12px;
        border-radius: 4px;
        font-size: 0.9rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        text-shadow: 0 1px 2px rgba(25, 118, 210, 0.2);

        &:hover {
          background: rgba(25, 118, 210, 0.2);
          border-color: rgba(25, 118, 210, 0.7);
        }

        &.active {
          background: rgba(25, 118, 210, 0.3);
          border-color: rgba(25, 118, 210, 0.8);
          box-shadow: 0 2px 4px rgba(25, 118, 210, 0.2);
        }
      }
    }

    .mobile-language-button {
      color: #1976d2 !important;

      mat-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
        filter: drop-shadow(0 1px 2px rgba(25, 118, 210, 0.3));
      }
    }

    .language-menu {
      .menu-item-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;

        .flag {
          font-size: 1.2rem;
          margin-right: 8px;
        }

        .name {
          flex: 1;
        }

        .check-icon {
          color: #1976d2;
          margin-left: 8px;
        }
      }
    }

    main {
      flex: 1;
    }

    /* RTL support for back button */
    [dir="rtl"] .back-button {
      margin-right: 0;
      margin-left: 16px;
    }

    /* RTL support for bsd-text in toolbar */
    [dir="rtl"] .bsd-text {
      margin-left: 0;
      margin-right: 16px;
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .desktop-only {
        display: none !important;
      }

      .mobile-only {
        display: block !important;
      }
    }

    @media (min-width: 769px) {
      .desktop-only {
        display: flex !important;
      }

      .mobile-only {
        display: none !important;
      }
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DesignLibraryLayoutComponent {
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
        console.info('[DesignLibraryLayoutComponent] Initialized with locale_ID:', this.currentLocale);
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
        console.info('[DesignLibraryLayoutComponent] Language switch requested:', {
            from: this.currentLocale,
            to: locale,
            currentUrl: window.location.href
        });

        // Reset summary language to default when switching routes
        if (this.analysisLanguageService.hasOverride) {
            console.info('[DesignLibraryLayoutComponent] Resetting summary language due to route change');
            this.analysisLanguageService.resetToDefault();
        }

        // This logic correctly reloads the page to the new language path.
        const baseUrl = window.location.origin;
        if (locale === 'de') {
            // German is the base URL
            const newUrl = baseUrl;
            console.info('[DesignLibraryLayoutComponent] Redirecting to German (base URL):', newUrl);
            window.location.href = newUrl;
        } else {
            const shortLocale = locale.split('-')[0];
            const newUrl = `${baseUrl}/${shortLocale}`;
            console.info('[DesignLibraryLayoutComponent] Redirecting to localized URL:', newUrl);
            window.location.href = newUrl;
        }
    }
} 