"use client";

import { Bell, Mail, MessageSquare } from "lucide-react";

import type { StepProps } from "../../types";

export default function NotificationStep({
  formData,
  updateForm,
}: StepProps) {
  function toggle(
    key: keyof typeof formData.notifications
  ) {
    updateForm({
      notifications: {
        ...formData.notifications,
        [key]: !formData.notifications[key],
      },
    });
  }

  const options = [
    {
      id: "emailOnDm",
      title: "Direct Messages",
      description:
        "Receive email notifications when someone sends you a message.",
      icon: MessageSquare,
    },
    {
      id: "emailOnNews",
      title: "AcademyFind News",
      description:
        "Get updates about new features, institutes and important announcements.",
      icon: Bell,
    },
    {
      id: "emailOnUpdates",
      title: "Product Updates",
      description:
        "Receive occasional emails about improvements and releases.",
      icon: Mail,
    },
  ] as const;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold">
          Notification Preferences
        </h2>

        <p className="mt-2 text-slate-600">
          Choose what you'd like to receive.
          You can change these anytime from settings.
        </p>
      </div>

      <div className="space-y-4">
        {options.map((option) => {
          const Icon = option.icon;

          const checked =
            formData.notifications[option.id];

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => toggle(option.id)}
              className="flex w-full items-center justify-between rounded-2xl border p-5 text-left transition hover:border-amber-400 hover:bg-amber-50"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-amber-100 p-3">
                  <Icon className="h-5 w-5 text-amber-600" />
                </div>

                <div>
                  <h3 className="font-semibold">
                    {option.title}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {option.description}
                  </p>
                </div>
              </div>

              <div
                className={`relative h-7 w-12 rounded-full transition ${
                  checked
                    ? "bg-amber-500"
                    : "bg-slate-300"
                }`}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                    checked
                      ? "left-6"
                      : "left-1"
                  }`}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}