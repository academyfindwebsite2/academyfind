"use client";

import { useState, useEffect, useCallback } from "react";
import { User, Check, X, Loader2 } from "lucide-react";
import type { StepProps } from "../../types";
import { getAvailableUsernameSuggestions } from "../../../../../lib/User/user/getAvailableUsernameSuggestions";
import { checkUsernameAvailability } from "../../../../../lib/User/user/checkUsernameAvailability";

export default function UsernameStep({
  user,
  formData,
  updateForm,
}: StepProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  
  const [isValidating, setIsValidating] = useState(false);
  const [availability, setAvailability] = useState<{ available: boolean; reason?: string } | null>(null);

  // Fetch suggestions on mount
  useEffect(() => {
    if (!user?.name) return;
    let isMounted = true;

    async function fetchSuggestions() {
      setIsLoadingSuggestions(true);
      try {
        const result = await getAvailableUsernameSuggestions(user.name, 3);
        if (isMounted) setSuggestions(result);
      } catch (e) {
        console.error(e);
      } finally {
        if (isMounted) setIsLoadingSuggestions(false);
      }
    }

    fetchSuggestions();

    return () => { isMounted = false; };
  }, [user?.name]);

  // Debounce check for username availability
  useEffect(() => {
    const username = formData.username;
    if (!username || username.length < 3) {
      setAvailability(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsValidating(true);
      try {
        const result = await checkUsernameAvailability(username);
        setAvailability(result);
      } catch (e) {
        console.error(e);
        setAvailability({ available: false, reason: "Error checking username" });
      } finally {
        setIsValidating(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.username]);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold">
          Choose a username
        </h2>

        <p className="mt-2 text-slate-600">
          This is how you will be identified on AcademyFind. You can always change this later.
        </p>
      </div>

      <div className="mt-8 flex-1">
        <div className="w-full max-w-md">
            <div className="relative">
                <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={formData.username || ""}
                  onChange={(e) => {
                    const val = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "");
                    updateForm({ username: val });
                  }}
                  placeholder="Enter a username..."
                  className={`h-14 w-full rounded-xl border bg-white pl-12 pr-12 outline-none transition text-lg ${
                    availability
                      ? availability.available
                        ? "border-green-500 focus:ring-2 focus:ring-green-200"
                        : "border-red-500 focus:ring-2 focus:ring-red-200"
                      : "border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
                  }`}
                />

                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  {isValidating && <Loader2 className="h-5 w-5 animate-spin text-slate-400" />}
                  {!isValidating && availability && (
                    availability.available ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <X className="h-5 w-5 text-red-500" />
                    )
                  )}
                </div>
            </div>

            {/* Error Message */}
            {!isValidating && availability && !availability.available && (
              <p className="text-red-500 text-sm mt-2">{availability.reason}</p>
            )}
            
            {formData.username && formData.username.length < 3 && !availability && (
               <p className="text-slate-500 text-sm mt-2">Username must be at least 3 characters.</p>
            )}

            {/* Suggestions */}
            <div className="mt-8">
              <h3 className="text-sm font-medium text-slate-600 mb-3">Available Suggestions</h3>
              {isLoadingSuggestions ? (
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating suggestions...
                </div>
              ) : suggestions.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => updateForm({ username: sug })}
                      className="inline-flex items-center rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200 hover:text-slate-900"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">No suggestions available.</p>
              )}
            </div>
        </div>
      </div>
    </div>
  );
}
