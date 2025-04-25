// hooks/useAPI.ts
import useSWR, {SWRResponse} from 'swr';
import ClientAxiosInstance from '@/lib/client-fetcher';
import {AxiosError, AxiosRequestConfig} from 'axios';

export function useAPI<T = unknown>(
    endpoint: string,
    options?: AxiosRequestConfig
): SWRResponse<T, AxiosError> {
    const fetcher = async (url: string): Promise<T> => {
        const response = await ClientAxiosInstance({
            url,
            ...options
        });
        return response.data;
    };

    return useSWR<T, AxiosError>(endpoint, fetcher);
}