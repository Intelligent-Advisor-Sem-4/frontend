import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";
import {decodeJwt} from "jose";

const publicRoutes = ["/", "/auth/login", "/auth/forgot-password", "/auth/reset-password", "/auth/register"];

export default async function middleware(req: NextRequest) {
	const path = req.nextUrl.pathname;
	const isPublicRoute = publicRoutes.includes(path);

	const cookie = (await cookies()).get("token")?.value;

	let session: { sub?: string, exp?: number } | null = null;

	if (cookie) {
		try {
			session = decodeJwt(cookie) as { sub?: string, exp?: number };
		} catch (err) {
			console.error("JWT Decode Failed:", err);
		}
	}

	// ❌ Redirect if trying to access a protected route without a session
	if (!isPublicRoute && !session?.sub) {
		return NextResponse.redirect(new URL("/auth/login", req.nextUrl));
	}

	// ✅ Redirect authenticated users away from the login page
	if (path === "/auth/login" && session?.sub) {
		return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
	}

	return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
	matcher: ["/((?!api|_next/static|_next/image|.*\\.png$|.*\\.jpg$).*)"],
};