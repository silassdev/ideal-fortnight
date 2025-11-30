import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


const PUBLIC_PATHS = [
    "/",
    "/login",
    "/register",
    "/auth",
    "/api/auth/register",
    "/api/auth/login",
    "/api/auth/confirm",
    "/api/auth/confirmed",
    "/api/auth/confirm-failed",
    "/api/auth/reset-request",
    "/api/auth/forgot",
    "/api/auth/reset",
    "/api/auth/google",
];

export function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/static") ||
        pathname.startsWith("/favicon") ||
        pathname.startsWith("/assets") ||
        pathname.endsWith(".png") ||
        pathname.endsWith(".jpg") ||
        pathname.endsWith(".svg")
    ) {
        return NextResponse.next();
    }

    if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
        return NextResponse.next();
    }

    const token = req.cookies.get("session")?.value;

    if (!token) {
        if (
            pathname.startsWith("/dashboard") ||
            pathname.startsWith("/account") ||
            pathname.startsWith("/resume") ||
            pathname.startsWith("/admin")
        ) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
        return NextResponse.next();
    }

    if (pathname.startsWith("/admin")) {
        const role = req.cookies.get("role")?.value;
        if (role !== "admin") {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};
