import {Gender} from "@/lib/types";
import {z} from "zod";


export const registerSchema = z.object({
    name: z.string().min(2, {message: "Name must be at least 2 characters"}),
    username: z.string()
        .min(3, {message: "Username must be at least 3 characters"})
        .max(50, {message: "Username cannot exceed 50 characters"})
        .regex(/^[a-zA-Z0-9_]+$/, {message: "Username can only contain letters, numbers, and underscores"}),
    birthday: z.string()
        .refine((date) => {
            const birthDate = new Date(date);
            const today = new Date();
            const minAge = new Date(today);
            minAge.setFullYear(today.getFullYear() - 13); // 13 years minimum age
            return birthDate <= minAge && birthDate >= new Date('1900-01-01');
        }, {message: "You must be at least 13 years old to register"}),
    gender: z.nativeEnum(Gender, {message: "Please select a valid gender"}),
    email: z.string().email({message: "Please enter a valid email address"}),
    avatar: z.string().url({message: "Please enter a valid URL"}).optional().or(z.literal('')),
    password: z.string()
        .min(8, {message: "Password must be at least 8 characters"})
        .regex(/[A-Z]/, {message: "Password must contain at least one uppercase letter"})
        .regex(/[a-z]/, {message: "Password must contain at least one lowercase letter"})
        .regex(/[0-9]/, {message: "Password must contain at least one number"}),
    confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});

interface RegisterFormData {
    name: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    birthday: string; // Format: YYYY-MM-DD
    gender: Gender;
    avatar?: string; // Optional
}

// Server response type for registration
interface RegisterResponse {
    success: boolean;
    message: string;
    errors?: {
        name?: string;
        username?: string;
        email?: string;
        password?: string;
        birthday?: string;
        gender?: string;
        avatar?: string;
    };
    userId?: string; // Only present on successful registration
}

// Type for the form state
interface FormState {
    success: boolean;
    message: string;
    errors: {
        [key: string]: string;
    };
}

// Type for the useFormState hook
type UseFormStateReturn = [
    FormState,
    (formData: FormData) => void
];

export type {
    RegisterFormData,
    RegisterResponse,
    FormState,
    UseFormStateReturn,
};
