'use server'

import {calculateOffset} from "./utils";
import AxiosInstance from "@/lib/server-fetcher";
import {ScreenerType} from "./definitions";
import {revalidatePath} from "next/cache";
import axios from "axios";
import {HTTPValidationError} from "@/lib/types/register";

// Define types for the response data based on the API response structure
export interface MinimalStockInfo {
    symbol: string;
    name: string;
    price: number;
    marketCap: number | null;
    analystRating: string | null;
    dividendYield: number | null;
    peRatio: number | null;
    priceChangePercent: number | null;
    exchange: string | null;
    market: string | null;
    risk_score: number | null;
    in_db: boolean | null;
}

export interface ScreenerResponse {
    quotes: MinimalStockInfo[];
    start: number;
    count: number;
}

export interface ScreenerErrorResponse {
    success: false;
    error: string;
    statusCode: number;
}

export interface ScreenerSuccessResponse {
    success: true;
    data: ScreenerResponse;
}

export async function getScreenStocks({
                                          filter,
                                          page,
                                          result_per_page
                                      }: {
    filter: ScreenerType;
    page: number;
    result_per_page: number;
}): Promise<ScreenerSuccessResponse | ScreenerErrorResponse> {
    try {
        // Calculate the offset based on page and results per page
        const offset = calculateOffset(page, result_per_page);

        // Make the API request using path parameter for screen_type and query parameters for the rest
        const response = await AxiosInstance.get(`/assets/screen/${filter}`, {
            params: {
                offset: offset,
                size: result_per_page,
                minimal: true
            }
        });

        // Return success response with typed data
        return {
            success: true,
            data: response.data as ScreenerResponse
        };
    } catch (error) {
        // Handle error cases
        let errorMessage = 'Failed to fetch stock data';
        let statusCode = 500;

        if (error instanceof Error) {
            errorMessage = error.message;
        }

        // If it's an Axios error with response data
        if (typeof error === 'object' && error !== null && 'response' in error) {
            const axiosError = error as { response?: { status?: number; data?: { detail?: string } } };

            if (axiosError.response?.status) {
                statusCode = axiosError.response.status;
            }

            if (axiosError.response?.data?.detail) {
                errorMessage = axiosError.response.data.detail;
            }
        }

        // Return structured error response
        return {
            success: false,
            error: errorMessage,
            statusCode
        };
    }
}

type CreateStockResponse = {
    success: boolean;
    message: string;
    data?: {
        stock_id: number;
        ticker_symbol: string;
        asset_name: string;
        exchange_name: string;
        status: string;
    };
};

export async function createStockAction(ticker: string): Promise<CreateStockResponse> {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    try {
        const response = await AxiosInstance.post('/assets/create-stock', null, {
            params: {ticker},
        });

        revalidatePath('/admin/stocks');
        revalidatePath('/assets');

        return {
            success: true,
            message: 'Stock created successfully!',
            data: response.data,
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const errorData = error.response?.data as HTTPValidationError | { detail?: string };

            if (Array.isArray(errorData?.detail) && errorData.detail.length > 0) {
                return {
                    success: false,
                    message: errorData.detail[0].msg,
                };
            } else if (typeof errorData?.detail === 'string') {
                return {
                    success: false,
                    message: errorData.detail,
                };
            } else if (status === 404) {
                return {
                    success: false,
                    message: 'No data found for this ticker',
                };
            } else {
                console.error('Create stock API error:', error.response?.data);
                return {
                    success: false,
                    message: 'Failed to create stock. Please try again.',
                };
            }
        }

        throw error; // Let unknown errors bubble up
    }
}
