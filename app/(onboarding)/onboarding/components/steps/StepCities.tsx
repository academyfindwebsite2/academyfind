"use client";

import { useMemo, useState } from "react";
import { Check, Search, X } from "lucide-react";

import type { StepProps } from "../../types";

export default function CitiesStep({
  cities,
  formData,
  updateForm,
}: StepProps) {
  const [query, setQuery] = useState("");

  const filteredCities = useMemo(() => {
    if (!query.trim()) return cities;

    const search = query.toLowerCase();

    return cities.filter(
      (city) =>
        city.name.toLowerCase().includes(search) ||
        city.state.toLowerCase().includes(search)
    );
  }, [cities, query]);

  function toggleCity(cityId: string) {
    const exists = formData.cities.includes(cityId);

    updateForm({
      cities: exists
        ? formData.cities.filter((id) => id !== cityId)
        : [...formData.cities, cityId],
    });
  }

  const selectedCities = cities.filter((city) =>
    formData.cities.includes(city.id)
  );

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold">
          Which cities are you interested in?
        </h2>

        <p className="mt-2 text-slate-600">
          We'll prioritize institutes and recommendations from your preferred
          cities.
        </p>
      </div>

      {/* Search */}
      <div className="relative mt-6">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search cities..."
          className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
        />
      </div>

      {/* Selected */}
      {selectedCities.length > 0 && (
        <div className="mt-5">
          <p className="mb-3 text-sm font-medium text-slate-600">
            Selected ({selectedCities.length})
          </p>

          <div className="flex flex-wrap gap-2">
            {selectedCities.map((city) => (
              <button
                key={city.id}
                type="button"
                onClick={() => toggleCity(city.id)}
                className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-200"
              >
                {city.name}

                <X className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="mt-6 flex-1 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
        <div className="h-full overflow-y-auto p-4">
          {filteredCities.length === 0 ? (
            <div className="flex h-full items-center justify-center text-slate-500">
              No cities found.
            </div>
          ) : (
            <div className="h-112 overflow-y-auto">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {filteredCities.map((city) => {
                const selected = formData.cities.includes(city.id);

                return (
                  <button
                    key={city.id}
                    type="button"
                    onClick={() => toggleCity(city.id)}
                    className={[
                      "group rounded-xl border bg-white p-4 text-left transition-all",
                      selected
                        ? "border-amber-500 bg-amber-50 ring-2 ring-amber-200"
                        : "border-slate-200 hover:border-amber-300 hover:shadow-sm",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {city.name}
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                          {city.state}
                        </p>
                      </div>

                      {selected && (
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-white">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}