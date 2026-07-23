export interface HalachaSummaryRequest {
    hebrewText?: string;
    targetLanguage?: string;
    halachaNumber?: number;
    isAdvancedLevel?: boolean;
    forceRegenerate?: boolean;
}

export interface HalachaSummaryResponse {
    summary: string;
    hebrewText: string;
    cached?: boolean;
    persisted?: boolean;
}

export interface HalachaErrorResponse {
    error: string;
}

export type TranslationLevel = 'advanced' | 'concise';

export interface TranslationListEntry {
    halachaNumber: number;
    language: string;
    level: TranslationLevel;
    model: string;
    updatedAt: string;
}

export interface TranslationListResponse {
    translations: TranslationListEntry[];
    count: number;
}
