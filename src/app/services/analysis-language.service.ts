import { Injectable, inject, LOCALE_ID, signal, computed, effect } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

export interface LanguageOption {
    code: string;
    name: string;
    flag: string;
}

@Injectable({ providedIn: 'root' })
export class AnalysisLanguageService {
    private locale = inject(LOCALE_ID);

    private readonly availableLanguages: LanguageOption[] = [
        { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'he', name: 'עברית', flag: '🇮🇱' },
        { code: 'ru', name: 'Русский', flag: '🇷🇺' },
        { code: 'pl', name: 'Polski', flag: '🇵🇱' }
    ];

    private readonly languageMap: Record<string, string> = {
        'de': 'Deutsch',
        'en': 'English',
        'fr': 'Français',
        'he': 'עברית',
        'ru': 'Русский',
        'pl': 'Polski'
    };

    private userOverride = signal<string | null>(null);

    private currentAnalysisLanguage = computed(() => {
        return this.userOverride() ?? this.locale;
    });

    private currentLanguageSubject = new BehaviorSubject<string>(this.currentAnalysisLanguage());

    constructor() {
        console.info('[AnalysisLanguageService] Initialized with locale_ID:', this.locale);

        effect(() => {
            const lang = this.currentAnalysisLanguage();
            this.currentLanguageSubject.next(lang);
            console.info('[AnalysisLanguageService] Summary language changed to:', lang);
        });
    }

    get currentLanguage$(): Observable<string> {
        return this.currentLanguageSubject.asObservable();
    }

    get currentLanguage(): string {
        return this.currentAnalysisLanguage();
    }

    get currentTargetLanguage(): string {
        const code = this.currentAnalysisLanguage().split('-')[0];
        const targetLanguage = this.languageMap[code];
        if (!targetLanguage) {
            throw new Error(`Expected one of [${Object.keys(this.languageMap).join(', ')}]. Got: ${code}`);
        }
        return targetLanguage;
    }

    get availableLanguageOptions(): LanguageOption[] {
        return [...this.availableLanguages];
    }

    get hasOverride(): boolean {
        return this.userOverride() !== null;
    }

    setOverride(locale: string): void {
        if (!this.availableLanguages.find(lang => lang.code === locale)) {
            console.warn('[AnalysisLanguageService] Invalid locale for override:', locale);
            return;
        }

        console.info('[AnalysisLanguageService] Setting override:', {
            from: this.userOverride(),
            to: locale,
            defaultLocale: this.locale
        });

        this.userOverride.set(locale);
    }

    clearOverride(): void {
        console.info('[AnalysisLanguageService] Clearing override, resetting to default:', this.locale);
        this.userOverride.set(null);
    }

    resetToDefault(): void {
        console.info('[AnalysisLanguageService] Resetting to default locale:', this.locale);
        this.userOverride.set(null);
    }

    get defaultLanguage(): string {
        return this.locale;
    }

    languageCodeFor(targetLanguage: string): string | null {
        const lang = this.availableLanguages.find(l => l.name === targetLanguage);
        return lang ? lang.code : null;
    }

    getLanguageDisplayName(code: string): string {
        const lang = this.availableLanguages.find(l => l.code === code);
        return lang ? lang.name : code;
    }

    getLanguageFlag(code: string): string {
        const lang = this.availableLanguages.find(l => l.code === code);
        return lang ? lang.flag : '🌐';
    }

    isCurrentLanguage(code: string): boolean {
        return this.currentAnalysisLanguage() === code;
    }

    isDefaultLanguage(code: string): boolean {
        return this.locale === code;
    }
}
