import { notFound } from "next/navigation";

import { getCompletePublicProfile } from "@/lib/profile/queries";

export default async function UserBlogsPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const profile = await getCompletePublicProfile((await params).username);
  if (!profile) notFound();
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold">All blogs by {profile.name}</h1>
      <p className="mt-3 text-slate-500">The complete paginated archive is coming soon.</p>
    </main>
  );
}
