import { Component, inject, LOCALE_ID, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AnalysisLanguageService } from './core/services/analysis-language.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="app-root" [attr.dir]="isRTL ? 'rtl' : 'ltr'">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .app-root {
      height: 100vh;
      width: 100vw;
      overflow: hidden;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  currentLocale = inject(LOCALE_ID);
  private analysisLanguageService = inject(AnalysisLanguageService);

  constructor() {
    console.info('[AppComponent] Initialized with locale_ID:', this.currentLocale);
  }

  get isRTL(): boolean {
    return ['he', 'ar', 'fa', 'ur'].includes(this.currentLocale);
  }
}