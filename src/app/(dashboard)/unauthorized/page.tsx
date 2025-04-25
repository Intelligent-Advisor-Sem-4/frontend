"use client";

import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {Shield, AlertTriangle, ArrowLeft, LogOut} from "lucide-react";
import {logout} from "@/actions/auth";

export default function UnauthorizedPage() {
    const router = useRouter();

    return (
        <div className="flex h-full items-center justify-center bg-background">
            <div className="w-full max-w-md rounded-lg border border-border p-6 shadow-sm">
                <div className="flex flex-col items-center text-center">
                    <div className="mb-4 rounded-full bg-destructive/10 p-3">
                        <Shield className="h-10 w-10 text-destructive"/>
                    </div>

                    <h1 className="mb-2 text-2xl font-bold tracking-tight text-foreground">
                        Unauthorized Access
                    </h1>

                    <div className="mb-6 flex items-center rounded-md bg-muted p-3">
                        <AlertTriangle className="mr-2 h-5 w-5 text-muted-foreground"/>
                        <p className="text-sm text-muted-foreground">
                            You don&apos;t have permission to access this page.
                        </p>
                    </div>

                    <p className="mb-6 text-muted-foreground">
                        Please contact your administrator if you believe this is an error.
                    </p>

                    <div className="flex flex-col gap-4 w-full">
                        <Button
                            onClick={logout}
                            className="w-full bg-primary hover:bg-primary/90"
                        >
                            <LogOut className={'mr-2 h-4 w-4'}/>Logout
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => router.back()}
                            className="w-full border-border text-muted-foreground hover:bg-accent"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4"/>
                            Go Back
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}