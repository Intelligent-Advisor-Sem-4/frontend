import AxiosInstance from "@/lib/client-fetcher";
import {SearchResult, SearchProps, SearchSuccessResponse, SearchErrorResponse} from "./definitions";

export async function searchYahooFinance(
    {query, newsCount = 8, quoteCount = 5}: SearchProps
): Promise<SearchSuccessResponse | SearchErrorResponse> {
    try {
        const response = await AxiosInstance.get<SearchResult>('/assets/search', {
            params: {
                query,
                news_count: newsCount,
                quote_count: quoteCount
            }
        });

        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        // Default error information
        let errorMessage = 'Failed to fetch search results';
        let statusCode = 500;

        // Extract basic error message if available
        if (error instanceof Error) {

            errorMessage = error.message;
        }

        // If it's an Axios error with response data
        if (typeof error === 'object' && error !== null && 'response' in error) {
            const axiosError = error as { response?: { status?: number; data?: { detail?: string } } };

            // Extract status code if available
            if (axiosError.response?.status) {
                statusCode = axiosError.response.status;
            }

            // Extract detailed error message if available
            if (axiosError.response?.data?.detail) {
                errorMessage = axiosError.response.data.detail;
            }
        }

        console.error(`Yahoo Finance search error (${statusCode}):`, errorMessage);

        // Return structured error response
        return {
            success: false,
            error: errorMessage,
            statusCode
        };
    }
}