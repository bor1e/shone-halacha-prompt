import { Injectable, LOCALE_ID, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
    HalachaErrorResponse,
    HalachaSummaryRequest,
    HalachaSummaryResponse
} from './types/halacha.types';

export interface HalachaRequest {
    hebrewText: string;
    targetLanguage?: string;
}

export interface HalachaResponse {
    id: string;
    summary: string;
    original: string;
}


@Injectable({ providedIn: 'root' })
export class ApiService {
    private http = inject(HttpClient);
    private currentLocale = inject(LOCALE_ID);
    private endpoint = 'https://europe-west1-fir-prompting.cloudfunctions.net/getHalachaSummary';

    generateAnalysis(hebrewText: string): Observable<HalachaResponse> {
        const request: HalachaRequest = {
            hebrewText,
            targetLanguage: this.getTargetLanguage()
        };

        return this.http.post<HalachaResponse>(this.endpoint, request).pipe(
            catchError(this.handleError)
        );
    }

    getHalachaSummary(request: HalachaSummaryRequest): Observable<HalachaSummaryResponse> {
        return this.http.post<HalachaSummaryResponse>(this.endpoint, request).pipe(
            catchError(this.handleError)
        );
    }

    private getTargetLanguage(): string {
        const languageMap: Record<string, string> = {
            'de-DE': 'German',
            'en-US': 'English',
            'fr-FR': 'French',
            'he-IL': 'Hebrew',
            'ru-RU': 'Russian'
        };
        return languageMap[this.currentLocale] || 'German';
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