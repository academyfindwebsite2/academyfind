"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ label = "Save changes" }: { label?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-xl bg-amber-400 px-4 py-2.5 font-semibold text-slate-950 hover:bg-amber-500 disabled:opacity-50"
    >
      {pending ? "Saving…" : label}
    </button>
  );
}

export function ActionMessage({
  state,
}: {
  state: { success: boolean; message: string };
}) {
  if (!state.message) return null;
  return (
    <p
      aria-live="polite"
      className={`text-sm ${state.success ? "text-emerald-700" : "text-rose-600"}`}
    >
      {state.message}
    </p>
  );
}
