import NextAuth from "next-auth";
import { authConfig } from "./auth/auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  // Run middleware on all paths except static files, API routes, and favicons
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
