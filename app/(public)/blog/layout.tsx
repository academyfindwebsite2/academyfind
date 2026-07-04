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
  const session = await getCachedSession();

  const authorProfile = session?.user?.id
    ? await prisma.blogAuthorProfile.findUnique({
        where: { userId: session.user.id },
        select: {
          username: true,
          displayName: true,
        },
      })
    : null;

  return (
    <div className="bg-slate-50/50">
      <div className="border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-600">
              Blog
            </p>
            <h1 className="text-lg font-semibold text-slate-950">
              AcademyFind Blog Workspace
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="outline" className="rounded-full border-slate-200 bg-white">
              <Link href="/blog">Blog Home</Link>
            </Button>

            {session?.user ? (
              <>
                <Button asChild className="rounded-full bg-amber-500 text-slate-950 hover:bg-amber-400">
                  <Link href="/blog/write">
                    <FileText className="mr-2 size-4" />
                    Write a Blog
                  </Link>
                </Button>

                <Button asChild variant="outline" className="rounded-full border-slate-200 bg-white">
                  <Link href="/blog/my-posts">My Posts</Link>
                </Button>

                <Button asChild variant="outline" className="rounded-full border-slate-200 bg-white">
                  <Link href="/blog/bookmark">
                    <Bookmark className="mr-2 size-4" />
                    Bookmarks
                  </Link>
                </Button>

                {authorProfile ? (
                  <Button asChild variant="outline" className="rounded-full border-slate-200 bg-white">
                    <Link href={`/blog/author/${authorProfile.username}`}>
                      <User className="mr-2 size-4" />
                      Author Profile
                    </Link>
                  </Button>
                ) : null}
              </>
            ) : (
              <>
                <Button asChild className="rounded-full bg-amber-500 text-slate-950 hover:bg-amber-400">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full border-slate-200 bg-white">
                  <Link href="/register">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {children}
    </div>
  );
}
