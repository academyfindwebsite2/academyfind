import { getCachedSession } from "@/lib/auth/session";
import Navbar from "@/components/layout/NavBar";
import { Footer } from "@/components/layout/Footer";
import { CursorGlow } from "@/components/ui/cursor-glow";
import GlobalCallbackFAB from "@/components/User/GlobalCallBack";
import { AuthPromptModal } from "@/components/layout/auth-prompt-model";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCachedSession();

  return (
    <>
      <Navbar session={session} />

      <CursorGlow />

      <AuthPromptModal isAuthenticated={Boolean(session?.user)} />

      <main className="flex-1">
        {children}
      </main>

      <Footer />

      <GlobalCallbackFAB />
    </>
  );
}