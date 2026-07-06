import { NotificationPreferences } from "@/app/(app)/settings/notifications/NotificationPreferences";
import { requireAuth } from "@/lib/auth/requireAuth";
import { prisma } from "@/lib/prisma";

export default async function NotificationSettingsPage() {
  const session = await requireAuth();
  const preferences = await prisma.userPreference.findUnique({
    where: { userId: session.user.id },
    select: { emailOnDm: true, emailOnNews: true, emailOnUpdates: true },
  });
  return (
    <div>
      <h1 className="text-3xl font-bold">Notification settings</h1>
      <p className="mt-2 text-slate-500">Choose how AcademyFind reaches you.</p>
      <NotificationPreferences
        values={{
          emailOnDm: preferences?.emailOnDm ?? true,
          emailOnNews: preferences?.emailOnNews ?? true,
          emailOnUpdates: preferences?.emailOnUpdates ?? true,
        }}
      />
    </div>
  );
}
