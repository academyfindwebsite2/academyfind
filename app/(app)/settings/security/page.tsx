import { deactivateAccount } from "@/app/(app)/settings/actions";
import { requireAuth } from "@/lib/auth/requireAuth";
import { prisma } from "@/lib/prisma";

export default async function SecuritySettingsPage() {
  const session = await requireAuth();
  const accounts = await prisma.account.findMany({
    where: { userId: session.user.id },
    select: { id: true, providerId: true, createdAt: true },
  });
  return (
    <div>
      <h1 className="text-3xl font-bold">Security</h1>
      <p className="mt-2 text-slate-500">
        Passwords and connected sign-in providers.
      </p>
      <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Connected accounts</h2>
        <div className="mt-4 space-y-2">
          {accounts.map((account: any) => (
            <div key={account.id} className="rounded-xl bg-slate-50 px-4 py-3 capitalize">
              {account.providerId}
            </div>
          ))}
          {!accounts.length ? <p className="text-sm text-slate-500">No OAuth providers connected.</p> : null}
        </div>
      </section>
      <section className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-6">
        <h2 className="text-xl font-semibold text-rose-700">Danger zone</h2>
        <p className="mt-2 text-sm text-rose-600">
          Deactivation hides your profile and prevents further account use.
        </p>
        <form action={deactivateAccount} className="mt-4">
          <button type="submit" className="rounded-xl border border-rose-300 bg-white px-4 py-2.5 font-semibold text-rose-700">
            Deactivate account
          </button>
        </form>
      </section>
    </div>
  );
}
