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
import { HalachaNumberExtractor } from './utils/halacha-number-extractor';

@Injectable({ providedIn: 'root' })
export class ApiService {
    private http = inject(HttpClient);
    private locale = inject(LOCALE_ID);
    private analysisLanguageService = inject(AnalysisLanguageService);
    private endpoint = 'https://gethalachasummary-4sq22uqurq-ew.a.run.app';

    constructor() {
        console.info('[ApiService] Initialized with locale_ID:', this.locale);
    }

    generateSummary(hebrewText: string, halachaNumber?: number, isAdvancedLevel = true): Observable<HalachaSummaryResponse> {
        const targetLanguage = this.analysisLanguageService.currentTargetLanguage;

        // Replace double quotes with Hebrew gershayim before sending to API
        const processedHebrewText = HalachaNumberExtractor.replaceQuotesWithGershayim(hebrewText) || hebrewText;

        console.info('[ApiService] generateSummary called:', {
            locale: this.locale,
            analysisLanguage: this.analysisLanguageService.currentLanguage,
            targetLanguage,
            halachaNumber,
            isAdvancedLevel,
            textLength: processedHebrewText.length,
            endpoint: this.endpoint,
            hasOverride: this.analysisLanguageService.hasOverride
        });

        const request: HalachaSummaryRequest = {
            hebrewText: processedHebrewText,
            targetLanguage,
            halachaNumber,
            isAdvancedLevel
        };

        console.info('[ApiService] Sending request to function:', {
            ...request,
            isAdvancedLevel: request.isAdvancedLevel,
            isAdvancedLevelType: typeof request.isAdvancedLevel
        });

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