'use server';

import AxiosInstance from "@/lib/server-fetcher";
import axios, {AxiosError} from "axios";
import {revalidatePath} from "next/cache";
import {HTTPValidationError} from "@/lib/types/register";

// TypeScript interfaces based on the Pydantic models
interface DBStock {
    in_db: boolean | null;
    status: string | null;
    asset_id: number | null;
    risk_score: number | null;
    risk_score_updated: string | null;
}

export interface Asset {
    name: string;
    company_url: string;
    exchange: string;
    ticker: string;
    type: string;
    sector: string;
    industry: string;
    currency: string;
    prev_close: number | null;
    open_price: number | null;
    last_price: number | null;
    day_high: number | null;
    day_low: number | null;
    volume: number | null;
    avg_volume: number | null;
    beta: number | null;
    market_cap: number | null;
    fifty_two_week_high: number | null;
    fifty_two_week_low: number | null;
    bid: number | null;
    ask: number | null;
    trailing_eps: number | null;
    trailing_pe: number | null;
    db: DBStock | null;
}


interface AssetErrorResponse {
    detail: string;
    statusCode: number;
}

// Server action to fetch asset by ticker
export async function getAssetByTicker(ticker: string): Promise<{ data?: Asset; error?: AssetErrorResponse }> {
    try {
        const response = await AxiosInstance.get<Asset>(`/assets/${ticker}`);
        console.log(response.data);
        return {data: response.data};
    } catch (error) {
        if (error instanceof AxiosError) {
            const statusCode = error.response?.status || 500;
            const errorMessage = error.response?.data?.detail || 'An unknown error occurred';

            return {
                error: {
                    detail: errorMessage,
                    statusCode
                }
            };
        }

        return {
            error: {
                detail: 'An unexpected error occurred',
                statusCode: 500
            }
        };
    }
}

type UpdateStockStatusResponse = {
    success: boolean;
    message: string;
    data?: {
        stock_id: number;
        status: string;
    };
};

export type AssetStatus = 'Active' | 'Pending' | 'Warning' | 'BlackList';

export async function updateStockStatusAction(
    stockId: number,
    status: AssetStatus
): Promise<UpdateStockStatusResponse> {
    // Optional: simulate network delay in development
    if (process.env.NODE_ENV === 'development') {
        await new Promise((resolve) => setTimeout(resolve, 500));
    }

    try {
        const response = await AxiosInstance.put(`/assets/${stockId}/status`, {
            status: status
        });

        // Revalidate relevant paths to refresh the UI
        revalidatePath('/global-assets');
        revalidatePath('/assets');

        return {
            success: true,
            message: response.data.message,
            data: {
                stock_id: stockId,
                status: status,
            },
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const errorData = error.response?.data as HTTPValidationError | { detail?: string };

            // Handle validation errors
            if (Array.isArray(errorData?.detail) && errorData.detail.length > 0) {
                return {
                    success: false,
                    message: errorData.detail[0].msg,
                };
            }
            // Handle string error messages
            else if (typeof errorData?.detail === 'string') {
                return {
                    success: false,
                    message: errorData.detail,
                };
            }
            // Handle 404 - stock not found
            else if (status === 404) {
                return {
                    success: false,
                    message: `Stock with ID ${stockId} not found`,
                };
            }
            // Handle 400 - bad request
            else if (status === 400) {
                return {
                    success: false,
                    message: 'Invalid status value provided',
                };
            }
            // Handle other errors
            else {
                console.error('Update stock status API error:', error.response?.data);
                return {
                    success: false,
                    message: 'Failed to update stock status. Please try again.',
                };
            }
        }

        // Log non-Axios errors
        console.error('Unexpected error updating stock status:', error);

        return {
            success: false,
            message: 'An unexpected error occurred. Please try again.',
        };
    }
}