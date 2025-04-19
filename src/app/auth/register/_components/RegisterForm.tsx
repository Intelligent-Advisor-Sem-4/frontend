'use client';

import React, {useActionState} from 'react';
import {z} from 'zod';
import {registerUser} from "@/actions/auth";
import {Lock, User, Mail, ImageIcon, BadgeInfo, Calendar, Users} from 'lucide-react';
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {Gender} from "@/lib/types";
import {registerSchema} from "@/actions/authTypes";

// Type for the form data based on the Zod schema
type RegisterFormData = z.infer<typeof registerSchema>;

// State for form validation and submission
interface FormState {
    success: boolean;
    message: string;
    errors: Record<string, string>;
}

const initialState: FormState = {
    success: false,
    message: '',
    errors: {}
};

function RegisterForm() {
    const [formData, setFormData] = React.useState<Partial<RegisterFormData>>({});
    const [validationErrors, setValidationErrors] = React.useState<Record<string, string>>({});
    const [state, formAction] = useActionState(registerUser, initialState);
    const [isPending, startTransition] = React.useTransition();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const validateForm = () => {
        try {
            registerSchema.parse(formData);
            setValidationErrors({});
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errors: Record<string, string> = {};
                error.errors.forEach(err => {
                    if (err.path[0]) {
                        errors[err.path[0].toString()] = err.message;
                    }
                });
                setValidationErrors(errors);
            }
            return false;
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            const formDataObj = new FormData();

            // Add all form fields to FormData
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== undefined) {
                    formDataObj.append(key, value.toString());
                }
            });

            startTransition(() => {
                formAction(formDataObj);
            });
        }
    };

    // If registration was successful, show a success message
    if (state.success) {
        return (
            <div className="flex flex-col items-center justify-center gap-6 p-8">
                <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-md">
                    <p className="font-medium">Registration successful!</p>
                    <p className="mt-2">You can now login to your account.</p>
                </div>
                <Button asChild className="w-full">
                    <a href="/login">Go to Login</a>
                </Button>
            </div>
        );
    }

    // Combine server validation errors with client validation errors
    const errors = {...validationErrors, ...state.errors};

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Create an account</h1>
                <p className="text-muted-foreground text-sm text-balance">
                    Enter your information below to register a new account
                </p>
            </div>

            {state.message && (
                <Alert variant="destructive" className="bg-red-50 border-red-200">
                    <AlertDescription>{state.message}</AlertDescription>
                </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-3">
                    <label className="text-sm font-medium" htmlFor="name">
                        Full Name
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <BadgeInfo className="h-5 w-5 text-gray-400"/>
                        </div>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={formData.name || ''}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-4 py-2 ${errors?.name ? 'border-destructive' : ''}`}
                            placeholder="John Doe"
                            aria-invalid={errors?.name ? "true" : "false"}
                        />
                    </div>
                    {errors?.name && (
                        <p className="text-sm text-destructive">{errors.name}</p>
                    )}
                </div>

                <div className="flex flex-col gap-3">
                    <label className="text-sm font-medium" htmlFor="username">
                        Username (For login)
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400"/>
                        </div>
                        <Input
                            id="username"
                            name="username"
                            type="text"
                            required
                            value={formData.username || ''}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-4 py-2 ${errors?.username ? 'border-destructive' : ''}`}
                            placeholder="yourusername"
                            aria-invalid={errors?.username ? "true" : "false"}
                        />
                    </div>
                    {errors?.username && (
                        <p className="text-sm text-destructive">{errors.username}</p>
                    )}
                </div>

                <div className="flex flex-col gap-3">
                    <label className="text-sm font-medium" htmlFor="birthday">
                        Birthday
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar className="h-5 w-5 text-gray-400"/>
                        </div>
                        <Input
                            id="birthday"
                            name="birthday"
                            type="date"
                            required
                            value={formData.birthday || ''}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-4 py-2 ${errors?.birthday ? 'border-destructive' : ''}`}
                            aria-invalid={errors?.birthday ? "true" : "false"}
                        />
                    </div>
                    {errors?.birthday && (
                        <p className="text-sm text-destructive">{errors.birthday}</p>
                    )}
                </div>

                <div className="flex flex-col gap-3">
                    <label className="text-sm font-medium" htmlFor="gender">
                        Gender
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 z-10 pl-3 flex items-center pointer-events-none">
                            <Users className="h-5 w-5 text-gray-400"/>
                        </div>
                        <Select
                            name="gender"
                            required
                            value={formData.gender}
                            onValueChange={(value) => setFormData({...formData, gender: value as Gender})}
                        >
                            <SelectTrigger
                                className={`w-full pl-10 pr-4 py-2 ${errors?.gender ? 'border-destructive' : ''}`}>
                                <SelectValue placeholder="Select gender"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="undefined">Prefer Not To Say</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {errors?.gender && (
                        <p className="text-sm text-destructive">{errors.gender}</p>
                    )}
                </div>

                <div className="flex flex-col gap-3">
                    <label className="text-sm font-medium" htmlFor="email">
                        Email
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400"/>
                        </div>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email || ''}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-4 py-2 ${errors?.email ? 'border-destructive' : ''}`}
                            placeholder="your.email@example.com"
                            aria-invalid={errors?.email ? "true" : "false"}
                        />
                    </div>
                    {errors?.email && (
                        <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                </div>

                <div className="flex flex-col gap-3">
                    <label className="text-sm font-medium" htmlFor="avatar">
                        Profile Picture (URL)
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <ImageIcon className="h-5 w-5 text-gray-400"/>
                        </div>
                        <Input
                            id="avatar"
                            name="avatar"
                            type="text"
                            value={formData.avatar || ''}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-4 py-2 ${errors?.avatar ? 'border-destructive' : ''}`}
                            placeholder="https://example.com/your-avatar.jpg"
                            aria-invalid={errors?.avatar ? "true" : "false"}
                        />
                    </div>
                    {errors?.avatar && (
                        <p className="text-sm text-destructive">{errors.avatar}</p>
                    )}
                </div>

                <div className="flex flex-col gap-3">
                    <label className="text-sm font-medium" htmlFor="password">
                        Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400"/>
                        </div>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            required
                            value={formData.password || ''}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-4 py-2 ${errors?.password ? 'border-destructive' : ''}`}
                            placeholder="••••••••"
                            aria-invalid={errors?.password ? "true" : "false"}
                        />
                    </div>
                    {errors?.password && (
                        <p className="text-sm text-destructive">{errors.password}</p>
                    )}
                </div>

                <div className="flex flex-col gap-3">
                    <label className="text-sm font-medium" htmlFor="confirmPassword">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400"/>
                        </div>
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            required
                            value={formData.confirmPassword || ''}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-4 py-2 ${errors?.confirmPassword ? 'border-destructive' : ''}`}
                            placeholder="••••••••"
                            aria-invalid={errors?.confirmPassword ? "true" : "false"}
                        />
                    </div>
                    {errors?.confirmPassword && (
                        <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                    )}
                </div>
            </div>

            <Button
                type="submit"
                disabled={isPending}
                className="w-full relative mt-4"
            >
                <span className={`flex items-center justify-center ${isPending ? 'opacity-0' : 'opacity-100'}`}>
                  Register
                </span>
                {isPending && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div
                            className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                    </div>
                )}
            </Button>

            <div className="text-center text-sm">
                Already have an account?{" "}
                <a href="/login" className="underline underline-offset-4">
                    Log in
                </a>
            </div>
        </form>
    );
}

export default RegisterForm;