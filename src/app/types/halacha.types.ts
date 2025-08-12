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

// Firestore document interface for original halacha content
export interface HalachaDocument {
    halachaNumber: number; // Document ID in Firestore
    hebrewText: string; // The original Hebrew text
    createdAt: Date;
    updatedAt: Date;
}

// Firestore document interface for halacha summaries
export interface HalachaSummaryDocument {
    id?: string; // Firestore document ID
    halachaNumber: number; // Reference to the original halacha
    summary: string; // The AI-generated summary
    language: string; // Language of the summary
    isAdvancedLevel: boolean; // Short or advanced summary
    createdAt: Date;
}

// Combined interface for displaying halacha with summaries
export interface HalachaWithSummaries {
    halachaNumber: number;
    hebrewText: string;
    createdAt: Date;
    summaries: HalachaSummaryDocument[];
}