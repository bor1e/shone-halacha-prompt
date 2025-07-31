import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromptFormComponent } from './prompt-form/prompt-form.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { LanguageService } from './services/language.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, PromptFormComponent, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule],
  template: `
    <div class="app-container" [attr.dir]="isRTL ? 'rtl' : 'ltr'">
      <mat-toolbar color="primary">
        <span class="app-title" i18n="@@app.title">Schone Halacha Analyse</span>
        <span class="bsd-text">בס״ד</span>
        <span class="spacer"></span>
        
        <!-- Desktop language switcher -->
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
        
        <!-- Mobile language dropdown -->
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
      </mat-toolbar>
      
      <main>
        <app-prompt-form></app-prompt-form>
      </main>
    </div>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private languageService = inject(LanguageService);

  get languages() {
    return this.languageService.languages;
  }

  get currentLocale(): string {
    return this.languageService.getCurrentLanguage();
  }

  get isRTL(): boolean {
    return this.languageService.isRTL();
  }

  switchLanguage(locale: string): void {
    this.languageService.switchLanguage(locale);
  }
}
