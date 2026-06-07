import type { Metadata } from "next";
import GoogleMapsProvider from "@/components/providers/GoogleMapsProvider";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";

import "./globals.css";

import Navbar from "@/components/layout/NavBar";
import { Footer } from "@/components/layout/Footer";
import { CursorGlow } from "@/components/ui/cursor-glow";
import { AuthPromptModal } from "@/components/layout/auth-prompt-model";

import { SpeedInsights } from "@vercel/speed-insights/next";
import NextTopLoader from 'nextjs-toploader'
import {Toaster} from 'react-hot-toast'

const inter = Inter({
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AcademyFind",
  description: "Academy Search Simplified",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.className} h-full antialiased`}
    >
      <body
        className={`min-h-full flex flex-col ${inter.className}`}
      >
        <Navbar />

        <CursorGlow />
        <GoogleMapsProvider >
        <NextTopLoader color="#f59e0b" showSpinner={false} />

        <main className="flex-1">
          {children}
        </main>
        </GoogleMapsProvider>

        <Toaster position="top-center" reverseOrder={false} />
        <AuthPromptModal />

        <Footer />

        <SpeedInsights />
      </body>
    </html>
  );
}