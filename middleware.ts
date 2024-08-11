import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


const isPublicRoutes = createRouteMatcher(["/sign-in", "/sign-up", "/", "/home"])
const isPublicApiRoutes = createRouteMatcher(["/api/videos"])

export default clerkMiddleware((auth, req) => {
    const { userId } = auth()
    const currentUrl = new URL(req.url)
    const isAccessingDashboard = currentUrl.pathname === "/home"
    const isApiRequest = currentUrl.pathname.startsWith("/api")

    if (userId && isPublicRoutes(req) && !isAccessingDashboard) {
        return NextResponse.redirect(new URL("/home", req.url))
    }

    if (!userId) {
        if (!isPublicRoutes(req) && !isPublicApiRoutes(req)) {
            return NextResponse.redirect(new URL("/sign-in", req.url))
        }

        if (isApiRequest && !isPublicApiRoutes(req)) {
            return NextResponse.redirect(new URL("/sign-in", req.url))
        }
    }

    return NextResponse.next()
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};