import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

//
// PUBLIC ROUTES — never blocked
//
const PUBLIC_PATHS = [
    "/",
    "/login",
    "/register",
    "/auth",
    "/api/auth/register",
    "/api/auth/login",
    "/api/auth/confirm",
    "/api/auth/forgot",
    "/api/auth/reset",
    "/api/auth/google",
];

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Allow all static files, images, Next internal routes
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

    // Allow all explicitly public paths
    if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
        return NextResponse.next();
    }

    // Fetch session cookie (your JWT cookie)
    const token = req.cookies.get("session")?.value;

    // If no token, block protected areas
    if (!token) {
        // Protect dashboard, account, resume editor, admin, etc.
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

    // Admin route enforcement
    if (pathname.startsWith("/admin")) {
        const role = req.cookies.get("role")?.value; // set this at login
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
