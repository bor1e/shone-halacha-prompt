import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../api.service';
import { TranslationListEntry } from '../../types/halacha.types';

@Component({
    selector: 'app-translation-list',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatProgressSpinnerModule, MatIconModule],
    template: `
    <mat-card class="translation-list-card">
      <mat-card-header>
        <mat-card-title i18n="@@translationList.title">Verfügbare Übersetzungen</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        @if (isLoading()) {
          <div class="state-container">
            <mat-spinner diameter="40"></mat-spinner>
          </div>
        } @else if (error()) {
          <div class="state-container error">
            <mat-icon>error_outline</mat-icon>
            <span>{{ error() }}</span>
          </div>
        } @else if (translations().length === 0) {
          <div class="state-container" i18n="@@translationList.empty">Noch keine Übersetzungen vorhanden.</div>
        } @else {
          <table class="translation-table">
            <thead>
              <tr>
                <th i18n="@@translationList.number">Halacha Nr.</th>
                <th i18n="@@translationList.language">Sprache</th>
                <th i18n="@@translationList.level">Stufe</th>
                <th i18n="@@translationList.updated">Aktualisiert</th>
              </tr>
            </thead>
            <tbody>
              @for (entry of translations(); track entry.halachaNumber + entry.language + entry.level) {
                <tr>
                  <td>{{ entry.halachaNumber }}</td>
                  <td>{{ entry.language }}</td>
                  <td>
                    @if (entry.level === 'advanced') {
                      <span i18n="@@translationList.level.advanced">Ausführlich</span>
                    } @else {
                      <span i18n="@@translationList.level.concise">Kompakt</span>
                    }
                  </td>
                  <td>{{ entry.updatedAt | date: 'medium' }}</td>
                </tr>
              }
            </tbody>
          </table>
        }
      </mat-card-content>
    </mat-card>
  `,
    styles: [`
    .translation-list-card {
      max-width: 800px;
      margin: 1rem auto;
    }
    .state-container {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 2rem;
    }
    .state-container.error {
      color: var(--mat-sys-error, #b3261e);
    }
    .translation-table {
      width: 100%;
      border-collapse: collapse;
    }
    .translation-table th,
    .translation-table td {
      text-align: left;
      padding: 0.5rem 0.75rem;
      border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TranslationListComponent {
    private api = inject(ApiService);

    translations = signal<TranslationListEntry[]>([]);
    isLoading = signal(true);
    error = signal('');

    constructor() {
        this.api.listTranslations().subscribe({
            next: (response) => {
                this.translations.set(response.translations);
                this.isLoading.set(false);
            },
            error: (loadError: Error) => {
                console.error('[TranslationListComponent] Loading translations failed:', loadError);
                this.error.set('Die Übersetzungsliste konnte nicht geladen werden.');
                this.isLoading.set(false);
            }
        });
    }

}
