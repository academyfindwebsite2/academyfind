import type { Metadata } from "next";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

import { ConversationSidebar } from "./ConversationSidebar";

export const metadata: Metadata = {
  title: "Chat | AcademyFind",
  robots: { index: false, follow: false },
};

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  return (
    <div className="flex h-[calc(100vh-65px)] overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <ConversationSidebar userId={session.user.id} />

      {/* Main content */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}
