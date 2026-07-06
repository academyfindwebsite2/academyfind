import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getSession } from "@/lib/auth/getSession";
import { getCompletePublicProfile, getPublicProfile } from "@/lib/profile/queries";
import { ProfileHeader } from "@/app/(public)/u/[username]/components/ProfileHeader";
import { ProfileSidebar } from "@/app/(public)/u/[username]/components/ProfileSidebar";
import { ProfileTabs } from "@/app/(public)/u/[username]/components/ProfileTabs";

type Props = { params: Promise<{ username: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const profile = await getPublicProfile(username);
  if (!profile) return { title: "Profile not found | AcademyFind" };

  const title = `${profile.name ?? `@${username}`} | AcademyFind`;
  const description =
    profile.teacherProfile?.headline ??
    profile.studentProfile?.headline ??
    `View @${username}'s institutes, teaching, student profile, reviews and articles on AcademyFind.`;
  const canonical = `/u/${username}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "profile",
      images: profile.image ? [profile.image] : undefined,
    },
  };
}

export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params;
  const [profile, session] = await Promise.all([
    getCompletePublicProfile(username),
    getSession(),
  ]);
  if (!profile) notFound();

  const isOwnProfile = session?.user.id === profile.id;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: `https://academyfind.com/u/${profile.username}`,
    image: profile.image,
    sameAs: [
      profile.linkedinUrl,
      profile.twitterUrl,
      profile.instagramUrl,
      profile.youtubeUrl,
    ].filter(Boolean),
    affiliation: profile.memberships.map(({ institute }) => ({
      "@type": "EducationalOrganization",
      name: institute.name,
      url: `https://academyfind.com/institute/${institute.slug}`,
    })),
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProfileHeader profile={profile} isOwnProfile={isOwnProfile} />
      <div className="mt-6 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <ProfileSidebar profile={profile} isOwnProfile={isOwnProfile} />
        <ProfileTabs profile={profile} />
      </div>
    </main>
  );
}
