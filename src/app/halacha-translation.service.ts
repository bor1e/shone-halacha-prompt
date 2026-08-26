import { Injectable, inject, LOCALE_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
    HalachaErrorResponse,
    HalachaSummaryRequest,
    HalachaSummaryResponse,
    TranslationLevel,
    TranslationListResponse
} from './types/halacha.types';
import { AnalysisLanguageService } from './services/analysis-language.service';
import { HalachaNumberExtractor } from './hebrew-text/halacha-number-extractor';

function isHalachaErrorResponse(value: unknown): value is HalachaErrorResponse {
    return typeof value === 'object' && value !== null
        && 'error' in value && typeof value.error === 'string';
}

function extractServerErrorMessage(error: HttpErrorResponse): string {
    if (isHalachaErrorResponse(error.error)) {
        return error.error.error;
    }
    return `Error Code: ${error.status}\nMessage: ${error.message}`;
}

@Injectable({ providedIn: 'root' })
export class HalachaTranslationService {
    private http = inject(HttpClient);
    private locale = inject(LOCALE_ID);
    private analysisLanguageService = inject(AnalysisLanguageService);
    private functionsBaseUrl = 'https://europe-west1-fir-prompting.cloudfunctions.net';
    private endpoint = `${this.functionsBaseUrl}/getHalachaSummary`;

    constructor() {
        console.info('[HalachaTranslationService] Initialized with locale_ID:', this.locale);
    }

    generateSummary(hebrewText: string | null, halachaNumber?: number, level: TranslationLevel = 'advanced', forceRegenerate = false): Observable<HalachaSummaryResponse> {
        const targetLanguage = this.analysisLanguageService.currentTargetLanguage;

        console.info('[HalachaTranslationService] generateSummary called:', {
            locale: this.locale,
            analysisLanguage: this.analysisLanguageService.currentLanguage,
            targetLanguage,
            halachaNumber,
            level,
            textLength: hebrewText?.length,
            endpoint: this.endpoint,
            hasOverride: this.analysisLanguageService.hasOverride
        });

        const request: HalachaSummaryRequest = {
            targetLanguage,
            halachaNumber,
            level,
            forceRegenerate
        };
        if (hebrewText !== null) {
            request.hebrewText = HalachaNumberExtractor.replaceQuotesWithGershayim(hebrewText);
        }

        console.info('[HalachaTranslationService] Sending request to function:', request);

        return this.http.post<HalachaSummaryResponse>(this.endpoint, request).pipe(
            catchError(this.handleError)
        );
    }

    listTranslations(): Observable<TranslationListResponse> {
        return this.http.get<TranslationListResponse>(`${this.functionsBaseUrl}/listTranslations`).pipe(
            catchError(this.handleError)
        );
    }

    private handleError(error: HttpErrorResponse): Observable<never> {
        const errorMessage = error.error instanceof ErrorEvent
            ? `Error: ${error.error.message}`
            : extractServerErrorMessage(error);

        console.error('[HalachaTranslationService] API Error:', errorMessage);
        return throwError(() => new Error(errorMessage));
    }
}