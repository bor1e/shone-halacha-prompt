import { Injectable, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Language {
    code: string;
    name: string;
    flag: string;
}

@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    private router = inject(Router);
    private route = inject(ActivatedRoute, { optional: true });

    private currentLanguageSubject = new BehaviorSubject<string>('de');
    public currentLanguage$ = this.currentLanguageSubject.asObservable();

    languages: Language[] = [
        { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'he', name: 'עברית', flag: '🇮🇱' },
        { code: 'ru', name: 'Русский', flag: '🇷🇺' }
    ];

    constructor() {
        // Only subscribe to route changes if ActivatedRoute is available
        if (this.route) {
            this.route.params.pipe(
                map(params => params['lang'] || 'de')
            ).subscribe(lang => {
                this.currentLanguageSubject.next(lang);
            });
        }
    }

    getCurrentLanguage(): string {
        return this.currentLanguageSubject.value;
    }

    isRTL(): boolean {
        return this.getCurrentLanguage() === 'he';
    }

    switchLanguage(locale: string): void {
        this.router.navigate([`/${locale}`]);
    }

    getLanguageByCode(code: string): Language | undefined {
        return this.languages.find(lang => lang.code === code);
    }
} 