// TypeScript interfaces matching the Pydantic models
export interface NewsResponse {
    uuid: string;
    title: string;
    publisher?: string | null;
    link: string;
    providerPublishedTime?: string | null;
    thumbnail?: string | null;
    relatedTickers?: string[] | null;
}

export interface QuoteResponse {
    symbol: string;
    shortName?: string | null;
    quoteType?: string | null;
    exchange?: string | null;
    sector?: string | null;
    sectorDisplay?: string | null;
    industry?: string | null;
    industryDisplay?: string | null;
}

export interface SearchResult {
    news: NewsResponse[];
    quotes: QuoteResponse[];
}

export interface SearchErrorResponse {
    success: false;
    error: string;
    statusCode: number;
}

export interface SearchSuccessResponse {
    success: true;
    data: SearchResult;
}

export interface SearchProps {
    query: string;
    newsCount?: number;
    quoteCount?: number;
}