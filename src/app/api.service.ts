import { Injectable, inject, LOCALE_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
    HalachaErrorResponse,
    HalachaSummaryRequest,
    HalachaSummaryResponse
} from './types/halacha.types';
import { AnalysisLanguageService } from './services/analysis-language.service';

@Injectable({ providedIn: 'root' })
export class ApiService {
    private http = inject(HttpClient);
    private locale = inject(LOCALE_ID);
    private analysisLanguageService = inject(AnalysisLanguageService);
    private endpoint = 'https://europe-west1-fir-prompting.cloudfunctions.net/getHalachaSummary';

    constructor() {
        console.info('[ApiService] Initialized with locale_ID:', this.locale);
    }

    generateAnalysis(hebrewText: string, halachaNumber?: number): Observable<HalachaSummaryResponse> {
        const targetLanguage = this.analysisLanguageService.currentTargetLanguage;
        console.info('[ApiService] generateAnalysis called:', {
            locale: this.locale,
            analysisLanguage: this.analysisLanguageService.currentLanguage,
            targetLanguage,
            halachaNumber,
            textLength: hebrewText.length,
            endpoint: this.endpoint,
            hasOverride: this.analysisLanguageService.hasOverride
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