import Navbar from "@/components/layout/NavBar";
import { getCachedSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCachedSession();

  if (session?.user) {
    // if (!session.user.onboardingCompleted) {
    //   redirect("/onboarding");
    // }

    redirect("/");
  }

  return (
    <>
      <Navbar session={session} />

      <main className="min-h-[calc(100vh-80px)]">
        {children}
      </main>
    </>
  );
}