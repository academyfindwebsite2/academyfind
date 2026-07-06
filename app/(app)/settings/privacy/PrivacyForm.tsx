"use client";

import { useActionState } from "react";

import { updatePrivacySettings } from "@/app/(app)/settings/actions";
import {
  ActionMessage,
  SubmitButton,
} from "@/app/(app)/settings/components/FormStatus";

type Values = {
  allowDms: boolean;
  isVisible: boolean;
  allowMessageRequests: boolean;
  showOnlineStatus: boolean;
  showLastSeen: boolean;
  readReceiptsEnabled: boolean;
};

export function PrivacyForm({ values }: { values: Values }) {
  const [state, action] = useActionState(updatePrivacySettings, {
    success: false,
    message: "",
  });
  return (
    <form action={action} className="mt-7 space-y-6">
      <Card title="Direct messages">
        <Toggle name="allowDms" label="Allow direct messages" checked={values.allowDms} />
        <Toggle name="allowMessageRequests" label="Allow message requests" checked={values.allowMessageRequests} />
        <Toggle name="showOnlineStatus" label="Show online status" checked={values.showOnlineStatus} />
        <Toggle name="showLastSeen" label="Show last seen" checked={values.showLastSeen} />
        <Toggle name="readReceiptsEnabled" label="Enable read receipts" checked={values.readReceiptsEnabled} />
      </Card>
      <Card title="Profile visibility">
        <Toggle name="isVisible" label="Profile visible publicly" checked={values.isVisible} />
        <p className="text-sm text-slate-500">
          Student and faculty directory visibility is controlled per institute
          membership record.
        </p>
      </Card>
      <div className="flex items-center gap-4">
        <SubmitButton />
        <ActionMessage state={state} />
      </div>
    </form>
  );
}

function Toggle({
  name,
  label,
  checked,
}: {
  name: string;
  label: string;
  checked: boolean;
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium">
      {label}
      <input type="checkbox" name={name} defaultChecked={checked} className="size-4 accent-amber-500" />
    </label>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}
