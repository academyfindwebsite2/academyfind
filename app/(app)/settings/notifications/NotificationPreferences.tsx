"use client";

import { useActionState } from "react";

import { updateNotificationPreferences } from "@/app/(app)/settings/actions";
import {
  ActionMessage,
  SubmitButton,
} from "@/app/(app)/settings/components/FormStatus";

export function NotificationPreferences({
  values,
}: {
  values: {
    emailOnDm: boolean;
    emailOnNews: boolean;
    emailOnUpdates: boolean;
  };
}) {
  const [state, action] = useActionState(updateNotificationPreferences, {
    success: false,
    message: "",
  });
  return (
    <form action={action} className="mt-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid grid-cols-[1fr_auto_auto] gap-3 text-sm">
        <b>Event</b><b>In-app</b><b>Email</b>
        <Row label="New direct message" name="emailOnDm" checked={values.emailOnDm} />
        <Row label="AcademyFind news" name="emailOnNews" checked={values.emailOnNews} />
        <Row label="Memberships, reviews and system updates" name="emailOnUpdates" checked={values.emailOnUpdates} />
      </div>
      <div className="mt-6 flex items-center gap-4">
        <SubmitButton />
        <ActionMessage state={state} />
      </div>
    </form>
  );
}

function Row({
  label,
  name,
  checked,
}: {
  label: string;
  name: string;
  checked: boolean;
}) {
  return (
    <>
      <span className="border-t border-slate-100 py-3">{label}</span>
      <input type="checkbox" checked disabled aria-label={`${label} in-app`} className="m-auto size-4 accent-amber-500" />
      <input type="checkbox" name={name} defaultChecked={checked} aria-label={`${label} email`} className="m-auto size-4 accent-amber-500" />
    </>
  );
}
