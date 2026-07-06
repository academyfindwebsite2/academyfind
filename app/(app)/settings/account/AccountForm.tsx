"use client";

import { useActionState } from "react";

import { updateSocialLinks } from "@/app/(app)/settings/actions";
import {
  ActionMessage,
  SubmitButton,
} from "@/app/(app)/settings/components/FormStatus";

const fields = [
  ["twitterUrl", "Twitter / X"],
  ["linkedinUrl", "LinkedIn"],
  ["instagramUrl", "Instagram"],
  ["youtubeUrl", "YouTube"],
  ["facebookUrl", "Facebook"],
  ["telegramUrl", "Telegram"],
  ["whatsappUrl", "WhatsApp"],
] as const;

type Socials = Record<(typeof fields)[number][0], string | null>;

export function AccountForm({ socials }: { socials: Socials }) {
  const [state, action] = useActionState(updateSocialLinks, {
    success: false,
    message: "",
  });
  return (
    <form
      action={action}
      className="mt-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-xl font-semibold">Social links</h2>
      <p className="mt-1 text-sm text-slate-500">
        Use full URLs. Every field is optional.
      </p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {fields.map(([name, label]) => (
          <label key={name} className="text-sm font-medium text-slate-700">
            {label}
            <input
              type="url"
              name={name}
              defaultValue={socials[name] ?? ""}
              placeholder="https://"
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-amber-400"
            />
          </label>
        ))}
      </div>
      <div className="mt-5 flex items-center gap-4">
        <SubmitButton />
        <ActionMessage state={state} />
      </div>
    </form>
  );
}
