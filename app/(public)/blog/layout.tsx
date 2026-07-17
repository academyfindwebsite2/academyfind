import Link from "next/link";

import { Bookmark, FileText, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getCachedSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export default async function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-slate-50/50">
      {children}
    </div>
  );
}
