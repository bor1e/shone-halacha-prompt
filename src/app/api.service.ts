import { Injectable, inject } from '@angular/core';
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
    private endpoint = 'https://europe-west1-fir-prompting.cloudfunctions.net/getHalachaSummary';

    generateAnalysis(hebrewText: string, halachaNumber?: number): Observable<HalachaSummaryResponse> {
        const request: HalachaSummaryRequest = {
            hebrewText,
            targetLanguage: this.getTargetLanguage(),
            halachaNumber
        };

        return this.http.post<HalachaSummaryResponse>(this.endpoint, request).pipe(
            catchError(this.handleError)
        );
    }

    private getTargetLanguage(): string {
        // Get the current locale from URL path instead of LOCALE_ID
        const currentLocale = this.getCurrentLocaleFromUrl();

        const languageMap: Record<string, string> = {
            'de': 'Deutsch',     // Match your backend expectation
            'en': 'English',
            'fr': 'Français',    // More accurate for your backend
            'he': 'עברית',       // Hebrew in Hebrew
            'ru': 'Русский'      // Russian in Russian
        };

        return languageMap[currentLocale] || 'English';
    }

    private getCurrentLocaleFromUrl(): string {
        // Extract locale from current URL path
        const path = window.location.pathname;
        const match = path.match(/^\/([a-z]{2})\//);
        return match ? match[1] : 'en'; // Default to English
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

        console.error('API Error:', errorMessage);
        return throwError(() => new Error(errorMessage));
    }
}