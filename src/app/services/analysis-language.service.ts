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

    // Available languages for summary
    private readonly availableLanguages: LanguageOption[] = [
        { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'he', name: 'עברית', flag: '🇮🇱' },
        { code: 'ru', name: 'Русский', flag: '🇷🇺' }
    ];

    // Language mapping for API calls
    private readonly languageMap: Record<string, string> = {
        'de': 'Deutsch',
        'en': 'English',
        'fr': 'Français',
        'he': 'עברית',
        'ru': 'Русский'
    };

    // User override (null means use default)
    private userOverride = signal<string | null>(null);

    // Current summary language (computed from override or default)
    private currentAnalysisLanguage = computed(() => {
        return this.userOverride() || this.locale;
    });

    // Observable for reactive updates
    private currentLanguageSubject = new BehaviorSubject<string>(this.currentAnalysisLanguage());

    constructor() {
        console.info('[AnalysisLanguageService] Initialized with locale_ID:', this.locale);

        // Use effect to update observable when computed value changes
        effect(() => {
            const lang = this.currentAnalysisLanguage();
            this.currentLanguageSubject.next(lang);
            console.info('[AnalysisLanguageService] Summary language changed to:', lang);
        });
    }

    /**
     * Get the current summary language as an Observable
     */
    get currentLanguage$(): Observable<string> {
        return this.currentLanguageSubject.asObservable();
    }

    /**
     * Get the current summary language synchronously
     */
    get currentLanguage(): string {
        return this.currentAnalysisLanguage();
    }

    /**
     * Get the target language string for API calls
     */
    get currentTargetLanguage(): string {
        const lang = this.currentAnalysisLanguage();
        return this.languageMap[lang] || 'Deutsch';
    }

    /**
     * Get all available language options
     */
    get availableLanguageOptions(): LanguageOption[] {
        return [...this.availableLanguages];
    }

    /**
     * Check if user has set an override
     */
    get hasOverride(): boolean {
        return this.userOverride() !== null;
    }

    /**
     * Set a user override for summary language
     */
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

    /**
     * Clear the user override (reset to default)
     */
    clearOverride(): void {
        console.info('[AnalysisLanguageService] Clearing override, resetting to default:', this.locale);
        this.userOverride.set(null);
    }

    /**
     * Reset to the default language (URL locale)
     */
    resetToDefault(): void {
        console.info('[AnalysisLanguageService] Resetting to default locale:', this.locale);
        this.userOverride.set(null);
    }

    /**
     * Get the default language (URL locale)
     */
    get defaultLanguage(): string {
        return this.locale;
    }

    /**
     * Get the display name for a language code
     */
    getLanguageDisplayName(code: string): string {
        const lang = this.availableLanguages.find(l => l.code === code);
        return lang ? lang.name : code;
    }

    /**
     * Get the flag for a language code
     */
    getLanguageFlag(code: string): string {
        const lang = this.availableLanguages.find(l => l.code === code);
        return lang ? lang.flag : '🌐';
    }

    /**
     * Check if a language is the current summary language
     */
    isCurrentLanguage(code: string): boolean {
        return this.currentAnalysisLanguage() === code;
    }

    /**
     * Check if a language is the default language
     */
    isDefaultLanguage(code: string): boolean {
        return this.locale === code;
    }
} 