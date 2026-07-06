import { AccountForm } from "@/app/(app)/settings/account/AccountForm";
import { requireAuth } from "@/lib/auth/requireAuth";
import { prisma } from "@/lib/prisma";

export default async function AccountSettingsPage() {
  const session = await requireAuth();
  const socials = await prisma.user.findUniqueOrThrow({
    where: { id: session.user.id },
    select: {
      twitterUrl: true,
      linkedinUrl: true,
      instagramUrl: true,
      youtubeUrl: true,
      facebookUrl: true,
      telegramUrl: true,
      whatsappUrl: true,
    },
  });
  return (
    <div>
      <h1 className="text-3xl font-bold">Account & social</h1>
      <p className="mt-2 text-slate-500">
        Add the public links associated with your identity.
      </p>
      <AccountForm socials={socials} />
    </div>
  );
}
