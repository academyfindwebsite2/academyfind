// app/onboarding/page.tsx

import { redirect } from "next/navigation";

import { getCachedSession } from "@/lib/auth/session";
import { OnboardingContainer } from "./components/OnboardingContainer";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const session = await getCachedSession();

  // User not logged in
  if (!session?.user) {
    redirect("/login");
  }

  // Already completed onboarding
  if (session.user.onboardingCompleted) {
    redirect("/");
  }

  return (
    <OnboardingContainer
      user={{
        id: session.user.id,
        name: session.user.name ?? "",
        email: session.user.email,
        image: session.user.image ?? null,
      }}
    />
  );
}