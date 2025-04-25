import {clsx, type ClassValue} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}


export function parseServerErrorMessage(message: string): string {
    try {
        const parsed = JSON.parse(message);

        // FastAPI usually sends { detail: "Something went wrong" } or { detail: [{ msg: "..." }] }
        if (typeof parsed?.detail === 'string') {
            return parsed.detail;
        } else if (Array.isArray(parsed?.detail) && parsed.detail.length > 0) {
            return parsed.detail[0]?.msg || "Validation failed.";
        }
    } catch (e) {
        // If not JSON, return as-is or a fallback
        console.error("Failed to parse error message:", e);
    }

    if (message.includes('404')) return 'Invalid credentials';
    return message || 'Failed to login. Please try again.';
}