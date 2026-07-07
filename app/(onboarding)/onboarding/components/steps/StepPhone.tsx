"use client";

import { Phone } from "lucide-react";
import type { StepProps } from "../../types";

export default function PhoneStep({
  formData,
  updateForm,
}: StepProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold">
          What is your phone number?
        </h2>

        <p className="mt-2 text-slate-600">
          We need your phone number for important updates and account recovery.
        </p>
      </div>

      <div className="mt-6 flex-1 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              type="tel"
              value={formData.phone || ""}
              onChange={(e) => updateForm({ phone: e.target.value })}
              required
              placeholder="Enter your phone number..."
              className="h-14 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200 text-lg"
            />
          </div>
          {formData.phone && formData.phone.length < 10 && (
            <p className="text-red-500 text-sm mt-2">Phone number must be at least 10 digits.</p>
          )}
        </div>
      </div>
    </div>
  );
}
