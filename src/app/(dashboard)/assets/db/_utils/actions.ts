import {AssetStatus} from "@/app/(dashboard)/assets/[symbol]/_utils/definitions";
import AxiosInstance from "@/lib/server-fetcher";


export interface StockResponse {
    stock_id: number;
    ticker_symbol: string;
    asset_name: string | null;
    currency: string;
    exchange: string | null;
    sectorKey: string | null;
    sectorDisp: string | null;
    industryKey: string | null;
    industryDisp: string | null;
    timezone: string | null;
    status: AssetStatus | null;
    type: string | null;
    first_data_point_date: string | null;
    last_data_point_date: string | null;
    risk_score: string | null;
    risk_score_updated: string | null;
    created_at: string;
    updated_at: string | null;
}

export async function fetchStocks({offset = 0, limit = 10}: {
    offset: number,
    limit: number
}): Promise<StockResponse[]> {
    try {
        const response = await AxiosInstance.get('/assets/db/stocks', {
            params: {
                offset,
                limit
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching stocks:', error);
        throw new Error('Failed to fetch stocks data');
    }
}

export async function getStocksCount(): Promise<number | null> {
    try {
        const response = await AxiosInstance.get('/assets/db/stocks/count');
        return response.data.count;
    } catch (error) {
        console.error('Error fetching stocks count:', error);
        return null;
    }
}