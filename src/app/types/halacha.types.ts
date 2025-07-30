// Request interface
export interface HalachaSummaryRequest {
    hebrewText: string;
    halachaNumber: string;
}

// Response interface matching your Firebase function
export interface HalachaSummaryResponse {
    id: string;
    summary: string;
    original: string;
}

// Error response interface
export interface HalachaErrorResponse {
    error: string;
}