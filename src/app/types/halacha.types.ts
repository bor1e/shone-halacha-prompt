// Request interface
export interface HalachaSummaryRequest {
    hebrewText: string;
    targetLanguage?: string;
    halachaNumber?: number;
    isAdvancedLevel?: boolean;
}

// Response interface matching your Firebase function
export interface HalachaSummaryResponse {
    summary: string;
}

// Error response interface
export interface HalachaErrorResponse {
    error: string;
}