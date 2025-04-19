'use server';

import axios from "axios";
import {cookies} from "next/headers";

// Axios Interceptor Instance
const AxiosInstance = axios.create({
    baseURL: process.env.BACKEND_BASE_URL
});

// Request Interceptor
AxiosInstance.interceptors.request.use(
    async (config) => {
        const token = (await cookies()).get("token")?.value;

        // If token is present, add it to request's Authorization Header
        if (token) {
            if (config.headers) config.headers.token = token;
        }
        return config;
    },
    (error) => {
        // Handle request errors here
        return Promise.reject(error);
    }
);

// Axios Interceptor: Response Method
AxiosInstance.interceptors.response.use(
    (response) => {
        // Can be modified response
        return response;
    },
    (error) => {
        // Handle response errors here
        return Promise.reject(error);
    }
);

export default AxiosInstance;