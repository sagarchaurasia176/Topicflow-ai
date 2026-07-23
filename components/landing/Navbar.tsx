"use client";
import Link from "next/link";
import { useGlobalContextApiState } from "@/app/context/GlobalStateManager";
import { Button } from "@/components/ui/button";
// import { LogOut, User } from "lucide-react";

export default function Navbar() {
  const { User: user, loading } = useGlobalContextApiState();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
            </div>
            <span className="text-lg font-bold text-gray-900">TopicFlow</span>
          </Link>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            {loading ? (
              <div className="px-4 py-2 text-sm text-gray-500">Welcome To Topic Flow</div>
            ) : user ? (
              // User is logged in
              <div className="flex items-center gap-3">
                <Link
                  href="/Dashboard"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  Dashboard
                </Link>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                  {/* <User className="w-4 h-4 text-gray-600" /> */}
                  <span className="text-sm text-gray-700 font-medium">
                    {user.name || user.email}
                  </span>
                </div>
                {/* <SignOutForm>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    type="submit"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                </SignOutForm> */}
              </div>
            ) : (
              // User is not logged in
              <>
                <Link href="/sign-in">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-in">
                  <Button
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    Get Started Free
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
