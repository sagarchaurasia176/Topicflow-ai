import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@radix-ui/themes/styles.css";
import { Toaster } from "sonner";
import { ContextProvider } from "./context/GlobalStateManager";
import { getUser } from "@/lib/auth/get-user";
import { SessionProvider } from "next-auth/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Topic Flow | AI",
  description: "Topic Flow AI is a platform for convert url to mind map",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* auth-wrapper */}
        <SessionProvider>
          <ContextProvider User={user}> 
            {children}
            <Toaster position="bottom-right"/>
          </ContextProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

