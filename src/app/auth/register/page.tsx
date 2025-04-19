"use client"

import RegisterForm from "@/app/auth/register/_components/RegisterForm"


export default function LoginPage() {
    return (
        <div className="flex flex-1 items-center justify-center">
            <div className="w-full">
                <RegisterForm/>
            </div>
        </div>
    )
}
