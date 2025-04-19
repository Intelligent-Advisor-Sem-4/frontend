"use client"

import LoginForm from "@/app/auth/login/_components/login-form"


export default function LoginPage() {
	return (
		<div className="flex flex-1 items-center justify-center">
			<div className="w-full max-w-xs">
				<LoginForm/>
			</div>
		</div>
	)
}
