import { Component, signal, inject, LOCALE_ID, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CommonModule } from '@angular/common';
import { MarkdownPipe } from '../../markdown.pipe';
import { HalachaNumberExtractor } from '../../hebrew-text/halacha-number-extractor';
import { HalachaNumberDialogComponent, HalachaNumberDialogData } from '../halacha-number-dialog/halacha-number-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { WhatsAppFormatterService } from '../../services/whatsapp-formatter.service';
import { AnalysisLanguageService } from '../../services/analysis-language.service';
import { AnalysisLanguageSelectorComponent } from '../analysis-language-selector/analysis-language-selector.component';

@Component({
    selector: 'app-mock-prompt-form',
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
        MatSlideToggleModule,
        MatDialogModule,
        MarkdownPipe,
        AnalysisLanguageSelectorComponent
    ],
    template: `
        <div class="prompt-form-container" [dir]="textDirection">
            <mat-card class="form-card">
                <mat-card-header>
                    <mat-card-title>
                        Halacha Zusammenfassung
                    </mat-card-title>
                    <mat-card-subtitle>
                        Geben Sie einen hebräischen Text ein, um eine Zusammenfassung zu erhalten
                    </mat-card-subtitle>
                </mat-card-header>

                <mat-card-content>
                    <div class="form-section">
                        <app-analysis-language-selector></app-analysis-language-selector>
                    </div>

                    <div class="form-section">
                        <mat-form-field appearance="outline" class="text-field">
                            <mat-label>Hebräischer Text</mat-label>
                            <textarea
                                matInput
                                [(ngModel)]="hebrewText"
                                (input)="updateHebrewText($any($event.target).value)"
                                [placeholder]="textPlaceholder"
                                rows="8"
                                required
                                [attr.aria-label]="'Hebrew text input'"
                            ></textarea>
                            <mat-icon matSuffix>text_fields</mat-icon>
                        </mat-form-field>
                    </div>

                    <div class="form-actions">
                        <div class="action-row">
                            <div class="summary-level-toggle">
                                <mat-slide-toggle 
                                    [(ngModel)]="isAdvancedLevel"
                                    color="primary"
                                    [attr.aria-label]="'Toggle summary level'"
                                >
                                    Advanced Summary Level
                                </mat-slide-toggle>
                                <div class="toggle-description">
                                    {{ isAdvancedLevel ? 'Detailed analysis with comprehensive explanations' : 'Concise summary with key points only' }}
                                </div>
                            </div>
                            
                            <button
                                mat-raised-button
                                color="primary"
                                (click)="submit()"
                                [disabled]="isLoading() || !hebrewText()"
                                class="submit-button"
                            >
                                @if (isLoading()) {
                                    <mat-spinner diameter="20"></mat-spinner>
                                    <span>Wird verarbeitet...</span>
                                } @else {
                                    <ng-container>
                                        <mat-icon>send</mat-icon>
                                        <span>Zusammenfassung erstellen</span>
                                    </ng-container>
                                }
                            </button>
                        </div>
                    </div>

                    @if (error()) {
                        <div class="error-message">
                            <mat-icon>error</mat-icon>
                            <span>{{ error() }}</span>
                        </div>
                    }
                </mat-card-content>
            </mat-card>

            @if (summary()) {
                <mat-card class="summary-card">
                    <mat-card-header>
                        <mat-card-title>
                            Zusammenfassung
                        </mat-card-title>
                        <div class="summary-actions">
                            <button
                                mat-icon-button
                                (click)="copyToClipboard()"
                                [matTooltip]="copied() ? 'Kopiert!' : 'In Zwischenablage kopieren'"
                                [attr.aria-label]="'Copy to clipboard'"
                                class="action-button"
                            >
                                <mat-icon>{{ copied() ? 'check' : 'content_copy' }}</mat-icon>
                            </button>
                            <button
                                mat-icon-button
                                (click)="shareWhatsApp()"
                                [matTooltip]="'Auf WhatsApp teilen'"
                                [attr.aria-label]="'Share on WhatsApp'"
                                class="action-button"
                            >
                                <mat-icon>share</mat-icon>
                            </button>
                        </div>
                    </mat-card-header>
                    <mat-card-content>
                        <div class="summary-content" [innerHTML]="summary() | markdown"></div>
                    </mat-card-content>
                </mat-card>
            }
        </div>
    `,
    styleUrls: ['../../prompt-form/prompt-form.component.scss'],
    styles: [`
      .action-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 24px;
        margin-top: 16px;
      }

      .summary-level-toggle {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 16px;
        background: #f8f9fa;
        border-radius: 8px;
        border: 1px solid #e9ecef;
        flex: 1;
        max-width: 400px;
      }

      .toggle-description {
        font-size: 0.875rem;
        color: #6c757d;
        margin-top: 4px;
      }

      mat-slide-toggle {
        font-weight: 500;
        color: #495057;
      }

      .submit-button {
        min-width: 200px;
        height: 48px;
      }

      @media (max-width: 768px) {
        .action-row {
          flex-direction: column;
          align-items: stretch;
          gap: 16px;
        }

        .summary-level-toggle {
          max-width: none;
        }

        .submit-button {
          min-width: auto;
        }
      }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MockPromptFormComponent {
    private dialog = inject(MatDialog);
    private locale = inject(LOCALE_ID);
    private whatsappFormatter = inject(WhatsAppFormatterService);
    private analysisLanguageService = inject(AnalysisLanguageService);

    hebrewText = signal('');
    isLoading = signal(false);
    summary = signal('');
    error = signal('');
    copied = signal(false);
    halachaNumber = signal<number | null>(null);
    currentAnalysisLanguage = signal(this.analysisLanguageService.currentLanguage);
    isAdvancedLevel = true;

    // Mock data for demonstration
    private mockSummaries = {
        'de': {
            concise: `# Halacha 872 - Zusammenfassung

## Hauptpunkte
- **Thema**: Gebete und Segenssprüche
- **Fokus**: Richtige Aussprache und Intention

## Wichtige Details
1. **Aussprache**: Alle Wörter müssen korrekt ausgesprochen werden
2. **Intention**: Das Herz muss mit dem Mund übereinstimmen
3. **Konzentration**: Ablenkungen vermeiden

*⚠️ Diese Zusammenfassung wurde mit KI erstellt und kann Fehler enthalten.*`,
            advanced: `# Halacha 872 - Detaillierte Analyse

## Hauptpunkte
- **Thema**: Gebete und Segenssprüche
- **Fokus**: Richtige Aussprache und Intention
- **Kontext**: Halacha 872 behandelt die Grundlagen des jüdischen Gebets

## Wichtige Details

### 1. Aussprache (הגייה)
- **Alle Wörter müssen korrekt ausgesprochen werden**
- **Keine Verkürzungen oder Auslassungen erlaubt**
- **Jeder Buchstabe hat seine Bedeutung**

### 2. Intention (כוונה)
- **Das Herz muss mit dem Mund übereinstimmen**
- **Gebet ohne Intention ist wie ein Körper ohne Seele**
- **Konzentration auf die Bedeutung der Worte**

### 3. Konzentration (ריכוז)
- **Ablenkungen vermeiden**
- **Sich in einen ruhigen Raum zurückziehen**
- **Alle Gedanken auf das Gebet richten**

## Praktische Anwendung

### Vor dem Gebet
- Sich sammeln und konzentrieren
- Den Raum vorbereiten
- Alle Ablenkungen entfernen

### Während des Gebets
- Jedes Wort bewusst sprechen
- Die Bedeutung verstehen
- Mit dem Herzen dabei sein

### Nach dem Gebet
- Dankbarkeit ausdrücken
- Die Erfahrung reflektieren
- Für das nächste Gebet vorbereiten

## Halachische Quellen
- **Rambam**: Hilchot Tefillah
- **Shulchan Aruch**: Orach Chaim
- **Mishnah Berurah**: Kommentare und Erklärungen

*⚠️ Diese Zusammenfassung wurde mit KI erstellt und kann Fehler enthalten.*`
        },

        'en': {
            concise: `# Halacha 872 - Summary

## Key Points
- **Topic**: Prayers and Blessings
- **Focus**: Proper pronunciation and intention

## Important Details
1. **Pronunciation**: All words must be pronounced correctly
2. **Intention**: The heart must match the mouth
3. **Concentration**: Avoid distractions

*⚠️ This summary was created with AI and may contain errors.*`,
            advanced: `# Halacha 872 - Detailed Analysis

## Key Points
- **Topic**: Prayers and Blessings
- **Focus**: Proper pronunciation and intention
- **Context**: Halacha 872 covers the fundamentals of Jewish prayer

## Important Details

### 1. Pronunciation (הגייה)
- **All words must be pronounced correctly**
- **No abbreviations or omissions allowed**
- **Every letter has its significance**

### 2. Intention (כוונה)
- **The heart must match the mouth**
- **Prayer without intention is like a body without soul**
- **Focus on the meaning of the words**

### 3. Concentration (ריכוז)
- **Avoid distractions**
- **Retreat to a quiet space**
- **Direct all thoughts to prayer**

## Practical Application

### Before Prayer
- Collect yourself and focus
- Prepare the space
- Remove all distractions

### During Prayer
- Speak each word consciously
- Understand the meaning
- Be present with your heart

### After Prayer
- Express gratitude
- Reflect on the experience
- Prepare for the next prayer

## Halachic Sources
- **Rambam**: Hilchot Tefillah
- **Shulchan Aruch**: Orach Chaim
- **Mishnah Berurah**: Comments and explanations

*⚠️ This summary was created with AI and may contain errors.*`
        },

        'he': {
            concise: `# הלכה 872 - סיכום

## נקודות עיקריות
- **נושא**: תפילות וברכות
- **מוקד**: הגייה נכונה וכוונה

## פרטים חשובים
1. **הגייה**: כל המילים חייבות להיות מוגות נכון
2. **כוונה**: הלב חייב להתאים לפה
3. **ריכוז**: להימנע מהסחות דעת

*⚠️ סיכום זה נוצר עם בינה מלאכותית ועלול להכיל שגיאות.*`,
            advanced: `# הלכה 872 - ניתוח מפורט

## נקודות עיקריות
- **נושא**: תפילות וברכות
- **מוקד**: הגייה נכונה וכוונה
- **הקשר**: הלכה 872 עוסקת ביסודות התפילה היהודית

## פרטים חשובים

### 1. הגייה (הגייה)
- **כל המילים חייבות להיות מוגות נכון**
- **לא מותר קיצורים או השמטות**
- **כל אות יש לה משמעות**

### 2. כוונה (כוונה)
- **הלב חייב להתאים לפה**
- **תפילה ללא כוונה היא כמו גוף ללא נשמה**
- **ריכוז על משמעות המילים**

### 3. ריכוז (ריכוז)
- **להימנע מהסחות דעת**
- **לסגת למרחב שקט**
- **לכוון את כל המחשבות לתפילה**

## יישום מעשי

### לפני התפילה
- להתאסף ולהתרכז
- להכין את המרחב
- להסיר את כל ההסחות

### במהלך התפילה
- לדבר כל מילה במודעות
- להבין את המשמעות
- להיות נוכח עם הלב

### אחרי התפילה
- להביע תודה
- להרהר בחוויה
- להתכונן לתפילה הבאה

## מקורות הלכתיים
- **רמב"ם**: הלכות תפילה
- **שולחן ערוך**: אורח חיים
- **משנה ברורה**: פירושים והסברים

*⚠️ סיכום זה נוצר עם בינה מלאכותית ועלול להכיל שגיאות.*`
        },

        'ru': {
            concise: `# Галаха 872 - Резюме

## Основные моменты
- **Тема**: Молитвы и благословения
- **Фокус**: Правильное произношение и намерение

## Важные детали
1. **Произношение**: Все слова должны произноситься правильно
2. **Намерение**: Сердце должно соответствовать устам
3. **Концентрация**: Избегать отвлечений

*⚠️ Это резюме создано с помощью ИИ и может содержать ошибки.*`,
            advanced: `# Галаха 872 - Детальный анализ

## Основные моменты
- **Тема**: Молитвы и благословения
- **Фокус**: Правильное произношение и намерение
- **Контекст**: Галаха 872 охватывает основы еврейской молитвы

## Важные детали

### 1. Произношение (הגייה)
- **Все слова должны произноситься правильно**
- **Не допускаются сокращения или пропуски**
- **Каждая буква имеет свое значение**

### 2. Намерение (כוונה)
- **Сердце должно соответствовать устам**
- **Молитва без намерения как тело без души**
- **Сосредоточиться на значении слов**

### 3. Концентрация (ריכוז)
- **Избегать отвлечений**
- **Уединиться в тихом месте**
- **Направить все мысли на молитву**

## Практическое применение

### Перед молитвой
- Собраться и сосредоточиться
- Подготовить пространство
- Убрать все отвлечения

### Во время молитвы
- Произносить каждое слово осознанно
- Понимать значение
- Быть присутствующим сердцем

### После молитвы
- Выражать благодарность
- Размышлять об опыте
- Готовиться к следующей молитве

## Галахические источники
- **Рамбам**: Хилхот Тфила
- **Шулхан Арух**: Орах Хаим
- **Мишна Брура**: Комментарии и объяснения

*⚠️ Это резюме создано с помощью ИИ и может содержать ошибки.*`
        },

        'fr': {
            concise: `# Halakha 872 - Résumé

## Points clés
- **Sujet**: Prières et bénédictions
- **Focus**: Prononciation et intention correctes

## Détails importants
1. **Prononciation**: Tous les mots doivent être prononcés correctement
2. **Intention**: Le cœur doit correspondre à la bouche
3. **Concentration**: Éviter les distractions

*⚠️ Ce résumé a été créé avec l'IA et peut contenir des erreurs.*`,
            advanced: `# Halakha 872 - Analyse détaillée

## Points clés
- **Sujet**: Prières et bénédictions
- **Focus**: Prononciation et intention correctes
- **Contexte**: Halakha 872 couvre les fondamentaux de la prière juive

## Détails importants

### 1. Prononciation (הגייה)
- **Tous les mots doivent être prononcés correctement**
- **Aucune abréviation ou omission autorisée**
- **Chaque lettre a sa signification**

### 2. Intention (כוונה)
- **Le cœur doit correspondre à la bouche**
- **La prière sans intention est comme un corps sans âme**
- **Se concentrer sur le sens des mots**

### 3. Concentration (ריכוז)
- **Éviter les distractions**
- **Se retirer dans un espace calme**
- **Diriger toutes les pensées vers la prière**

## Application pratique

### Avant la prière
- Se recueillir et se concentrer
- Préparer l'espace
- Supprimer toutes les distractions

### Pendant la prière
- Prononcer chaque mot consciemment
- Comprendre le sens
- Être présent avec son cœur

### Après la prière
- Exprimer la gratitude
- Réfléchir à l'expérience
- Se préparer pour la prochaine prière

## Sources halakhiques
- **Rambam**: Hilchot Tefillah
- **Choulhan Aroukh**: Ora'h Haïm
- **Michna Beroura**: Commentaires et explications

*⚠️ Ce résumé a été créé avec l'IA et peut contenir des erreurs.*`
        }
    };

    constructor() {
        console.info('[MockPromptFormComponent] Initialized with locale_ID:', this.locale);

        // Subscribe to summary language changes
        this.analysisLanguageService.currentLanguage$.subscribe(lang => {
            this.currentAnalysisLanguage.set(lang);
            console.info('[MockPromptFormComponent] Summary language changed to:', lang);
        });
    }

    get textDirection(): 'rtl' | 'ltr' {
        return this.locale === 'he' ? 'rtl' : 'ltr';
    }

    get textPlaceholder(): string {
        const placeholders: Record<string, string> = {
            'de': 'Geben Sie hier Ihren hebräischen Text ein...',
            'en': 'Enter your Hebrew text here...',
            'fr': 'Entrez votre texte hébreu ici...',
            'he': 'הכנס את הטקסט העברי שלך כאן...',
            'ru': 'Введите ваш еврейский текст здесь...'
        };
        return placeholders[this.locale] || 'Enter your Hebrew text here...';
    }

    updateHebrewText(value: string) {
        this.hebrewText.set(value);
        this.extractHalachaNumber();
    }

    private extractHalachaNumber(): void {
        const extractedNumber = HalachaNumberExtractor.extractHalachaNumber(this.hebrewText());
        this.halachaNumber.set(extractedNumber);
    }

    copyToClipboard() {
        if (this.summary()) {
            navigator.clipboard.writeText(this.summary()).then(() => {
                this.copied.set(true);
                setTimeout(() => this.copied.set(false), 2000);
            });
        }
    }

    async shareWhatsApp() {
        const summary = this.summary();
        if (!summary) return;
        const formatted = this.whatsappFormatter.formatForWhatsApp(summary);
        await navigator.clipboard.writeText(formatted);
        const url = this.whatsappFormatter.createWhatsAppShareUrl(formatted);
        window.open(url, '_blank');
        this.copied.set(true);
        setTimeout(() => this.copied.set(false), 2000);
    }

    async submit() {
        console.info('[MockPromptFormComponent] Mock submit called');

        if (!this.hebrewText()) {
            this.error.set('Bitte füllen Sie das Textfeld aus.');
            return;
        }

        // Check if we have a halacha number
        let finalHalachaNumber = this.halachaNumber();

        if (!finalHalachaNumber) {
            this.extractHalachaNumber();
            finalHalachaNumber = this.halachaNumber();

            if (!finalHalachaNumber) {
                const dialogRef = this.dialog.open(HalachaNumberDialogComponent, {
                    width: '500px',
                    data: {
                        hebrewText: this.hebrewText(),
                    } as HalachaNumberDialogData
                });

                try {
                    const result = await dialogRef.afterClosed().toPromise();
                    if (result && result.halachaNumber) {
                        finalHalachaNumber = result.halachaNumber;
                        this.halachaNumber.set(finalHalachaNumber);
                    } else {
                        return;
                    }
                } catch (error) {
                    console.error('Dialog error:', error);
                    return;
                }
            }
        }

        // Simulate API call with loading state
        this.isLoading.set(true);
        this.error.set('');
        this.summary.set('');

        // Simulate network delay
        setTimeout(() => {
            const currentLang = this.currentAnalysisLanguage();
            const mockSummaryData = this.mockSummaries[currentLang as keyof typeof this.mockSummaries] || this.mockSummaries['de'];
            const level = this.isAdvancedLevel ? 'advanced' : 'concise';
            const mockSummary = typeof mockSummaryData === 'string' ? mockSummaryData : mockSummaryData[level];

            this.summary.set(mockSummary);
            this.isLoading.set(false);

            console.info('[MockPromptFormComponent] Mock response generated for language:', currentLang, 'level:', level);
        }, 1500);
    }
} 