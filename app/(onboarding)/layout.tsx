// app/onboarding/layout.tsx

import { getCachedSession } from "@/lib/auth/session";
import { redirect } from "next/dist/client/components/navigation";
import type { ReactNode } from "react";

interface OnboardingLayoutProps {
  children: ReactNode;
}

export default async function OnboardingLayout({
  children,
}: OnboardingLayoutProps) {
    const session = await getCachedSession();

    if (!session?.user) {
        // If the user is not logged in, redirect to the login page
        redirect("/login");
    }

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-3xl">
          {children}
        </div>
      </div>
    </main>
  );
}