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

    generateAnalysis(hebrewText: string, halachaNumber?: number): Observable<HalachaSummaryResponse> {
        const targetLanguage = this.getTargetLanguage();
        console.log('Current locale:', this.locale);
        console.log('Target language:', targetLanguage);

        const request: HalachaSummaryRequest = {
            hebrewText,
            targetLanguage,
            halachaNumber
        };

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

        return languageMap[currentLocale] || 'Deutsch'; // Default to German
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