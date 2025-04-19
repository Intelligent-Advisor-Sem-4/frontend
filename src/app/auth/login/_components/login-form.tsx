'use client';

import React, {useActionState, useEffect} from 'react';
import {login} from "@/actions/auth";
import {Lock, User} from 'lucide-react';
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Alert, AlertDescription} from "@/components/ui/alert";

function LoginForm() {
	const [state, action, pending] = useActionState(login, '');

	// Clear LocalStorage on mount
	useEffect(() => {
		localStorage.clear();
	}, []);

	return (
		<form action={action} className="flex flex-col gap-6">
			<div className="flex flex-col items-center gap-2 text-center">
				<h1 className="text-2xl font-bold">Login to your account</h1>
				<p className="text-muted-foreground text-sm text-balance">
					Enter your username below to login to your account
				</p>
			</div>

			{state && (
				<Alert variant="destructive" className="bg-red-50 border-red-200">
					<AlertDescription>{state}</AlertDescription>
				</Alert>
			)}

			<div className="grid gap-6">
				<div className="grid gap-3">
					<label className="text-sm font-medium" htmlFor="username">
						Username
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
							className="w-full pl-10 pr-4 py-2"
							placeholder="yourusername"
						/>
					</div>
				</div>

				<div className="grid gap-3">
					<div className="flex items-center">
						<label className="text-sm font-medium" htmlFor="password">
							Password
						</label>
						<a
							href="#"
							className="ml-auto text-sm underline-offset-4 hover:underline"
						>
							Forgot your password?
						</a>
					</div>
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<Lock className="h-5 w-5 text-gray-400"/>
						</div>
						<Input
							id="password"
							name="password"
							type="password"
							required
							className="w-full pl-10 pr-4 py-2"
							placeholder="••••••••"
						/>
					</div>
				</div>

				<Button
					type="submit"
					disabled={pending}
					className="w-full relative"
				>
          <span className={`flex items-center justify-center ${pending ? 'opacity-0' : 'opacity-100'}`}>
            Login
          </span>
					{pending && (
						<div className="absolute inset-0 flex items-center justify-center">
							<div
								className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"/>
						</div>
					)}
				</Button>
			</div>

			<div className="text-center text-sm">
				Don&apos;t have an account?{" "}
				<a href="/auth/register" className="underline underline-offset-4">
					Sign up
				</a>
			</div>
		</form>
	);
}

export default LoginForm;