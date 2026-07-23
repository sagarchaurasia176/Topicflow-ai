import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      
      // Paths that require authentication
      const isProtectedRoute = 
        nextUrl.pathname.startsWith("/Dashboard") || 
        nextUrl.pathname.startsWith("/profile") || 
        nextUrl.pathname.startsWith("/settings");

      if (isProtectedRoute) {
        if (isLoggedIn) return true;
        // Redirect to sign-in page
        return false;
      }

      // Redirect logged-in users away from auth pages (sign-in, sign-up)
      if (isLoggedIn && (nextUrl.pathname === "/sign-in" || nextUrl.pathname === "/sign-up")) {
        return Response.redirect(new URL("/Dashboard", nextUrl));
      }

      return true;
    },
  },
  providers: [], // Will be populated in auth.ts (server runtime)
} satisfies NextAuthConfig;
