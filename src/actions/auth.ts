'use server';

import {redirect} from "next/navigation";
import {cookies} from 'next/headers';
import AxiosInstance from "@/lib/axiosInstance";
import axios from "axios";
import {HTTPValidationError, LoginResponse, User} from "@/lib/types";
import {FormState, RegisterResponse, registerSchema} from "@/actions/authTypes";

async function createSession(loginResponse: LoginResponse) {
    const {token} = loginResponse;

    // Set secure HTTP-only cookies instead of localStorage
    const cookieStore = await cookies();

    cookieStore.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
        sameSite: 'strict'
    });

    cookieStore.set('user', JSON.stringify(loginResponse), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
        sameSite: 'strict'
    });
}

async function deleteSession() {
    const cookieStore = await cookies();

    // Clear all auth cookies
    cookieStore.delete('token');
    cookieStore.delete('user');
}


export async function login(_previousState: string, formData: FormData): Promise<string> {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    // Validate form input
    if (!username || !password) {
        return "Please fill in all fields";
    }

    try {
        const response = await AxiosInstance.post<LoginResponse>('/auth/login', {
            username,
            password
        });
        console.log(response);

        await createSession(response.data);


        // Redirect to dashboard after successful login
        redirect('/dashboard');
    } catch (error) {
        // Type narrowing for the axios error
        if (axios.isAxiosError(error)) {
            console.log(error.response?.data);
            const errorData = error.response?.data as HTTPValidationError | { detail?: string };

            if (Array.isArray(errorData?.detail) && errorData.detail.length > 0) {
                console.error(errorData.detail);
                return errorData.detail[0].msg;
            } else if (typeof errorData?.detail === "string") {
                return errorData.detail;
            } else if (error.response?.status === 404) {
                return "Invalid credentials";
            } else {
                console.error("Login API error:", error.response?.data);
                return "Failed to login. Please try again.";
            }
        }
        throw error;
    }
}

export async function getUser() {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('user')?.value;
    if (!userCookie) {
        return null;
    }

    const user: User = JSON.parse(userCookie);
    return user;
}

export const registerUser = async (
    prevState: FormState,
    formData: FormData
): Promise<FormState> => {
    // Extract data from FormData
    const rawData = {
        name: formData.get('name') as string,
        username: formData.get('username') as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        birthday: formData.get('birthday') as string,
        gender: formData.get('gender') as string,
        confirmPassword: formData.get('confirmPassword') as string,
        avatar: formData.get('avatar') as string || undefined,
    };

    // Double-check server-side validation (as a safeguard)
    // Client validation should have already caught errors, but this ensures security
    const validationResult = registerSchema.safeParse(rawData);

    if (!validationResult.success) {
        const errors: Record<string, string> = {};
        validationResult.error.issues.forEach(issue => {
            if (issue.path[0]) {
                errors[issue.path[0].toString()] = issue.message;
            }
        });

        console.error("Validation errors:", errors);

        return {
            success: false,
            message: "Please correct the errors in the form",
            errors
        };
    }

    try {
        // Send registration request to the server
        const response = await AxiosInstance.post<RegisterResponse>("/auth/user/reg", rawData);

        return {
            success: true,
            message: response.data.message || "User registered successfully",
            errors: {}
        };
    } catch (error: unknown) {
        console.error("Registration error:", error);

        let message = "An error occurred during registration. Please try again.";
        const errors: Record<string, string> = {};

        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const detail = error.response?.data?.detail;

            if (status === 409 && typeof detail === "string") {
                if (detail.includes("Username")) {
                    errors.username = detail;
                } else if (detail.includes("Email")) {
                    errors.email = detail;
                }
                message = detail;
            } else if (typeof detail === "string") {
                message = detail;
            }
        }

        return {
            success: false,
            message,
            errors
        };
    }
};

export async function logout(): Promise<void> {
    await deleteSession();
    redirect('/login');
}