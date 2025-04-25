import authConfig from "./auth.config";
import NextAuth from "next-auth";

const { auth } = NextAuth(authConfig);
import { DEFAULT_LOGIN_REDIRECT, apiAuthPrefix, authRoutes, publicRoutes } from "./routes";
import { NextResponse } from "next/server";

export default (auth as unknown as (handler: any) => any)((req: any, ctx: any) => {
  const { nextUrl } = req;
  const isLoggedIn: boolean = !!req.auth;
  const isApiAuthRoute: boolean = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isRouteHandler: boolean = nextUrl.pathname.startsWith("/api");
  const isPublicRoute: boolean = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute: boolean = authRoutes.includes(nextUrl.pathname);

  const response = NextResponse.next();
  response.headers.set('X-Current-Route', nextUrl.pathname);

  if (isApiAuthRoute) {
    return null;
  }

  if (isRouteHandler) {
    return null;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/login", nextUrl));
  }

  return response;
});

export const config = {
  matcher: ['/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)']
}