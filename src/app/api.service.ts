import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
    HalachaErrorResponse,
    HalachaSummaryRequest,
    HalachaSummaryResponse
} from './types/halacha.types';
import { LanguageService } from './services/language.service';


@Injectable({ providedIn: 'root' })
export class ApiService {
    private http = inject(HttpClient);
    private languageService = inject(LanguageService);
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
        const languageMap: Record<string, string> = {
            'de': 'German',
            'en': 'English',
            'fr': 'French',
            'he': 'Hebrew',
            'ru': 'Russian'
        };
        return languageMap[this.languageService.getCurrentLanguage()] || 'German';
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