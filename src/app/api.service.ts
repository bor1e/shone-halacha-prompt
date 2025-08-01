import { Injectable, inject, LOCALE_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
    HalachaErrorResponse,
    HalachaSummaryRequest,
    HalachaSummaryResponse
} from './types/halacha.types';

@Injectable({ providedIn: 'root' })
export class ApiService {
    private http = inject(HttpClient);
    private locale = inject(LOCALE_ID);
    private endpoint = 'https://europe-west1-fir-prompting.cloudfunctions.net/getHalachaSummary';

    constructor() {
        console.info('[ApiService] Initialized with locale_ID:', this.locale);
    }

    generateAnalysis(hebrewText: string, halachaNumber?: number): Observable<HalachaSummaryResponse> {
        const targetLanguage = this.getTargetLanguage();
        console.info('[ApiService] generateAnalysis called:', {
            locale: this.locale,
            targetLanguage,
            halachaNumber,
            textLength: hebrewText.length,
            endpoint: this.endpoint
        });

        const request: HalachaSummaryRequest = {
            hebrewText,
            targetLanguage,
            halachaNumber
        };

        console.info('[ApiService] Sending request to function:', request);

        return this.http.post<HalachaSummaryResponse>(this.endpoint, request).pipe(
            catchError(this.handleError)
        );
    }

    private getTargetLanguage(): string {
        // Use the injected LOCALE_ID instead of URL extraction
        const currentLocale = this.locale;

        const languageMap: Record<string, string> = {
            'de': 'Deutsch',     // Match your backend expectation
            'en': 'English',
            'fr': 'Français',    // More accurate for your backend
            'he': 'עברית',       // Hebrew in Hebrew
            'ru': 'Русский'      // Russian in Russian
        };

        const targetLanguage = languageMap[currentLocale] || 'Deutsch'; // Default to German
        console.info('[ApiService] getTargetLanguage mapping:', {
            currentLocale,
            targetLanguage,
            availableLanguages: Object.keys(languageMap)
        });

        return targetLanguage;
    }

    private handleError(error: HttpErrorResponse): Observable<never> {
        let errorMessage = 'An unknown error occurred';

        if (error.error instanceof ErrorEvent) {
            // Client-side error
            errorMessage = `Error: ${error.error.message}`;
        } else {
            // Server-side error
            const serverError = error.error as HalachaErrorResponse;
            errorMessage = serverError?.error || `Error Code: ${error.status}\nMessage: ${error.message}`;
        }

        console.error('[ApiService] API Error:', errorMessage);
        return throwError(() => new Error(errorMessage));
    }
}