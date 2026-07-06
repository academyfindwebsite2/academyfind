import { PrivacyForm } from "@/app/(app)/settings/privacy/PrivacyForm";
import { requireAuth } from "@/lib/auth/requireAuth";
import { prisma } from "@/lib/prisma";

export default async function PrivacySettingsPage() {
  const session = await requireAuth();
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: session.user.id },
    select: { allowDms: true, isVisible: true, chatSettings: true },
  });
  return (
    <div>
      <h1 className="text-3xl font-bold">Privacy & visibility</h1>
      <p className="mt-2 text-slate-500">
        Control who can find and contact you.
      </p>
      <PrivacyForm
        values={{
          allowDms: user.allowDms,
          isVisible: user.isVisible,
          allowMessageRequests:
            user.chatSettings?.allowMessageRequests ?? true,
          showOnlineStatus: user.chatSettings?.showOnlineStatus ?? true,
          showLastSeen: user.chatSettings?.showLastSeen ?? true,
          readReceiptsEnabled:
            user.chatSettings?.readReceiptsEnabled ?? true,
        }}
      />
    </div>
  );
}
