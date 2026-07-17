export interface HalachaSummaryRequest {
    hebrewText: string;
    targetLanguage?: string;
    halachaNumber?: number;
    isAdvancedLevel?: boolean;
    forceRegenerate?: boolean;
}

export interface HalachaSummaryResponse {
    summary: string;
    cached?: boolean;
    persisted?: boolean;
}

export interface HalachaErrorResponse {
    error: string;
}
