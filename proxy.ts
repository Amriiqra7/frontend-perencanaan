import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const hasToken = request.cookies.has('token_p');

    // Allow root path to proceed
    if (pathname === "/") {
        return NextResponse.next();
    }

    // Allow access to the receiver page without a token
    if (pathname.startsWith("/authentication/receiver") || pathname.startsWith("/pub")) {
        return NextResponse.next();
    }

    // If no token, redirect to Portal
    if (!hasToken) {
        const portalUrl = process.env.NEXT_PUBLIC_PORTAL_URL;
        if (portalUrl) {
            return NextResponse.redirect(new URL(portalUrl));
        } else {
            // Fallback if env is missing (though it should be there)
            // Maybe redirect to a generic error page or keep on current page but it will fail
            return NextResponse.next();
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
