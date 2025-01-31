import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    // allow auth routes
    // get NEXTAUTH_SECRET from environment variables
    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) {
        throw new Error("NEXTAUTH_SECRET is not set");
    }
    // get token from request
    const token = await getToken({ req, secret });
    if (!token) {
        // allow access to auth paths if no token meaning not authenticated
        if (path.startsWith("/api/auth") || path.startsWith("/auth")) {
            return NextResponse.next();
        }
        // do not allow access to non-auth api paths if not authenticated
        if (path.startsWith("/api")) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                    data: null,
                },
                {
                    status: 401,
                }
            );
        } else {
            // redirect non-auth pages to login page if not authenticated
            return NextResponse.redirect(new URL("/auth/login", req.url));
        }
    }

    // check if email is verified, redirect to verify if not
    if (!token.isEmailVerified) {
        return NextResponse.redirect(new URL("/auth/verify-email", req.url));
    }
    // allow if email is verified
    if (path === "/") {
        return NextResponse.redirect(new URL("/manage/levels", req.url));
    }
    return NextResponse.next();
}

// Apply middleware only to protected routes
export const config = {
    matcher: ["/api/:path*", "/"],
};
