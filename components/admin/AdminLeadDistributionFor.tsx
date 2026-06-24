"use client";

import { useState, useEffect } from "react";
import { Search, Send, MapPin, CheckCircle2, X, CheckSquare, Square, AlertCircle, Zap, Star, BadgeCheck, Building2, Layers } from "lucide-react";
import toast from "react-hot-toast";
import { AnyARecord } from "node:dns";

interface SearchResult {
    id: string;
    name: string;
    city: { name: string };
    subscriptionPlan: string;
    hasExistingLead?: boolean;
}

const PLAN_CONFIG = {
  ULTRA:    { label: "Ultra",    icon: Zap,        badgeClass: "bg-purple-100 text-purple-700" },
  PREMIUM:  { label: "Premium",  icon: Star,       badgeClass: "bg-blue-100 text-blue-700" },
  VERIFIED: { label: "Verified", icon: BadgeCheck, badgeClass: "bg-emerald-100 text-emerald-700" },
  BASIC:    { label: "Basic",    icon: Building2,  badgeClass: "bg-slate-100 text-slate-700" },
};

const ALL_PLANS = ['ULTRA', 'PREMIUM', 'VERIFIED', 'BASIC'];

export default function LeadDistributionForm({
    enquiryId,
    originalInstituteId,
    studentName
}: {
    enquiryId: string,
    originalInstituteId: string,
    studentName: string
}) {
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<"individual" | "bulk">("individual");

    // ---- Individual mode state ----
    const [allInstitutes, setAllInstitutes] = useState<SearchResult[]>([]);
    const [searchingIndividual, setSearchingIndividual] = useState(false);
    const [individualSearch, setIndividualSearch] = useState("");
    const [individualSelected, setIndividualSelected] = useState<string[]>([]);

    // ---- Bulk mode state: each dimension has its own "All" flag ----
    const [plansAll, setPlansAll] = useState(false);
    const [selectedPlans, setSelectedPlans] = useState<string[]>(['ULTRA', 'PREMIUM']);

    const [citiesAll, setCitiesAll] = useState(true);
    const [selectedCities, setSelectedCities] = useState<{id: string, name: string}[]>([]);

    const [categoriesAll, setCategoriesAll] = useState(true);
    const [selectedCategories, setSelectedCategories] = useState<{id: string, name: string}[]>([]);

    const [bulkSearch, setBulkSearch] = useState("");
    const [estimatedCount, setEstimatedCount] = useState<{
        totalCount: number;
        alreadyHaveCount: number;
        newReach: number;
      } | null>(null);
    const [countLoading, setCountLoading] = useState(false);

    const [adminNote, setAdminNote] = useState("");

    const [cities, setCities] = useState<{id: string, name: string}[]>([]);
    const [categories, setCategories] = useState<{id: string, name: string}[]>([]);

    // Fetch filter dropdown options
    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const res = await fetch('/api/admin/distribution-filters');
                if (res.ok) {
                    const data = await res.json();
                    setCities(data.cities);
                    setCategories(data.categories);
                }
            } catch (e) { console.error("Filter fetch error", e); }
        };
        fetchFilters();
    }, []);

    // Fetch institutes from Meilisearch when user types in search bar (individual mode)
    useEffect(() => {
        if (mode !== "individual") return;

        const fetchIndividualInstitutes = async () => {
            setSearchingIndividual(true);
            try {
                const params = new URLSearchParams();
                params.append('exclude', originalInstituteId);
                params.append('enquiryId', enquiryId);
                
                // Only include search if user typed something, otherwise fetch all
                if (individualSearch.trim()) {
                    params.append('search', individualSearch.trim());
                }

                const res = await fetch(`/api/admin/find-targets?${params.toString()}`);
                if (res.ok) {
                    const data = await res.json();
                    setAllInstitutes(data.institutes || []);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setSearchingIndividual(false);
            }
        };

        // Debounce the search: wait 500ms after user stops typing
        const debounceTimer = setTimeout(fetchIndividualInstitutes, 500);
        return () => clearTimeout(debounceTimer);
    }, [individualSearch, mode, originalInstituteId, enquiryId]);

    // Bulk mode: live "estimated reach" count only — never fetches/displays the institute list
    useEffect(() => {
        if (mode !== "bulk") return;

        const fetchCount = async () => {
            setCountLoading(true);
            try {
                const params = new URLSearchParams();
                params.append('exclude', originalInstituteId);
                params.append('countOnly', 'true');

                params.append('plansAll', String(plansAll));
                if (!plansAll) params.append('plans', selectedPlans.join(','));

                params.append('citiesAll', String(citiesAll));
                if (!citiesAll) params.append('cities', selectedCities.map((c: { id: string }) => c.id).join(','));

                params.append('categoriesAll', String(categoriesAll));
                if (!categoriesAll) params.append('categories', selectedCategories.map((c: { id: string }) => c.id).join(','));

                if (bulkSearch.trim()) params.append('search', bulkSearch.trim());

                const res = await fetch(`/api/admin/find-targets?${params.toString()}`);
                if (res.ok) {
                    const data = await res.json();
                    setEstimatedCount(typeof data.totalCount === 'number' ? {
                    totalCount: data.totalCount,
                    alreadyHaveCount: data.alreadyHaveCount ?? 0,
                    newReach: data.newReach ?? data.totalCount
                  } : null);
                } else {
                    setEstimatedCount(null);
                }
            } catch (error) {
                console.error(error);
                setEstimatedCount(null);
            } finally {
                setCountLoading(false);
            }
        };

        const debounceTimer = setTimeout(fetchCount, 500);
        return () => clearTimeout(debounceTimer);
    }, [mode, plansAll, selectedPlans, citiesAll, selectedCities, categoriesAll, selectedCategories, bulkSearch, originalInstituteId]);

    const filteredIndividual = allInstitutes;

    // ---- Plans ----
    const togglePlan = (plan: string) => {
        if (plansAll) {
            setPlansAll(false);
            setSelectedPlans([plan]);
        } else {
            setSelectedPlans(prev => prev.includes(plan) ? prev.filter((p: string) => p !== plan) : [...prev, plan]);
        }
    };
    const selectAllPlans = () => {
        setPlansAll(true);
        setSelectedPlans([]);
    };

    // ---- Cities ----
    const handleAddCity = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.value;
        if (!id) return;
        const city = cities.find(c => c.id === id);
        if (city && !selectedCities.find((c: { id: string }) => c.id === id)) {
            setCitiesAll(false);
            setSelectedCities(prev => [...prev, city]);
        }
        e.target.value = "";
    };
    const removeCity = (id: string) => setSelectedCities((prev: any) => prev.filter((c: { id: string }) => c.id !== id));
    const selectAllCities = () => {
        setCitiesAll(true);
        setSelectedCities([]);
    };

    // ---- Categories ----
    const handleAddCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.value;
        if (!id) return;
        const cat = categories.find(c => c.id === id);
        if (cat && !selectedCategories.find((c: { id: string }) => c.id === id)) {
            setCategoriesAll(false);
            setSelectedCategories(prev => [...prev, cat]);
        }
        e.target.value = "";
    };
    const removeCategory = (id: string) => setSelectedCategories(prev => prev.filter((c: { id: string }) => c.id !== id));
    const selectAllCategories = () => {
        setCategoriesAll(true);
        setSelectedCategories([]);
    };

    // ---- Individual selection ----
    const toggleIndividual = (id: string) => {
        setIndividualSelected(prev => prev.includes(id) ? prev.filter((i: string) => i !== id) : [...prev, id]);
    };
    const toggleSelectAllIndividual = () => {
        if (individualSelected.length === filteredIndividual.length && filteredIndividual.length > 0) {
            setIndividualSelected([]);
        } else {
            setIndividualSelected(filteredIndividual.map((r: { id: string }) => r.id));
        }
    };

    const handleForwardLead = async () => {
        if (mode === "individual") {
            if (individualSelected.length === 0) return toast.error("Select at least one institute.");

            setLoading(true);
            try {
                const res = await fetch('/api/admin/forward-lead', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        originalEnquiryId: enquiryId,
                        targetInstituteIds: individualSelected,
                        adminNote,
                    }),
                });
                const data = await res.json();
                if (res.ok) {
                    toast.success(data.message || `Forwarded to ${individualSelected.length} institutes!`);
                    setIndividualSelected([]);
                    setAdminNote("");
                } else {
                    toast.error(data.error || "Failed to forward");
                }
            } catch (error) {
                toast.error("Error forwarding");
            } finally {
                setLoading(false);
            }
            return;
        }

        // Bulk mode
        if (!plansAll && selectedPlans.length === 0) return toast.error("Select at least one plan, or choose All Plans.");
        if (!citiesAll && selectedCities.length === 0) return toast.error("Select at least one city, or choose All Cities.");
        if (!categoriesAll && selectedCategories.length === 0) return toast.error("Select at least one category, or choose All Categories.");

        setLoading(true);
        try {
            const res = await fetch('/api/admin/bulk-forward-lead', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    originalEnquiryId: enquiryId,
                    originalInstituteId,
                    plansAll, plans: selectedPlans,
                    citiesAll, cityIds: selectedCities.map((c: { id: string }) => c.id),
                    categoriesAll, categoryIds: selectedCategories.map((c: { id: string }) => c.id),
                    search: bulkSearch.trim(),
                    adminNote,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(data.message || `Forwarded to ${data.count} institutes!`);
                setAdminNote("");
            } else {
                toast.error(data.error || "Failed to forward");
            }
        } catch (error) {
            toast.error("Error forwarding");
        } finally {
            setLoading(false);
        }
    };

    const InstituteRow = ({ inst, selected, onToggle, hasLead }: any) => {
        const cfg = PLAN_CONFIG[inst.subscriptionPlan as keyof typeof PLAN_CONFIG] || PLAN_CONFIG.BASIC;
        return (
            <div
                onClick={() => !hasLead && onToggle(inst.id)}
                className={`flex items-center justify-between p-4 border-b border-slate-100 text-sm transition-colors ${
                    hasLead ? 'bg-red-50 cursor-not-allowed' :
                    selected ? 'bg-amber-50' : 'hover:bg-slate-50 cursor-pointer'
                }`}
            >
                <div className="flex items-center gap-3 flex-1">
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                        hasLead ? 'border-red-300 bg-red-100' :
                        selected ? 'bg-amber-500 border-amber-600 text-white' : 'border-slate-300 bg-white'
                    }`}>
                        {hasLead ? <AlertCircle className="w-3.5 h-3.5 text-red-600" /> : selected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                        <p className={`font-bold leading-tight ${hasLead ? 'text-red-700' : 'text-slate-800'}`}>
                            {inst.name}
                        </p>
                        <p className={`text-[10px] ${hasLead ? 'text-red-600' : 'text-slate-500'}`}>
                            {inst.city.name}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {hasLead && <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-1 rounded">Already has this lead</span>}
                    <span className={`px-2 py-1 rounded text-[9px] font-extrabold uppercase tracking-widest ${cfg.badgeClass}`}>
                        {cfg.label}
                    </span>
                </div>
            </div>
        );
    };

    const canForward = mode === "individual"
  ? individualSelected.length > 0
  : (plansAll || selectedPlans.length > 0)
    && (citiesAll || selectedCities.length > 0)
    && (categoriesAll || selectedCategories.length > 0)
    && (estimatedCount?.newReach ?? 0) > 0;

    return (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 mt-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-amber-100 text-amber-600 rounded-xl"><Send className="w-5 h-5" /></div>
                <div>
                    <h3 className="text-xl font-bold text-amber-900">Broadcast Lead Engine</h3>
                    <p className="text-xs text-amber-700 mt-0.5">Distribute {studentName}'s enquiry intelligently.</p>
                </div>
            </div>

            <div className="flex gap-2 mb-6 bg-white rounded-xl p-1 border border-amber-200 w-fit">
                <button
                    onClick={() => setMode("individual")}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                        mode === "individual" ? "bg-amber-500 text-white shadow-md" : "text-slate-600 hover:text-slate-800"
                    }`}
                >
                    Individual Selection
                </button>
                <button
                    onClick={() => setMode("bulk")}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                        mode === "bulk" ? "bg-amber-500 text-white shadow-md" : "text-slate-600 hover:text-slate-800"
                    }`}
                >
                    Bulk Distribution
                </button>
            </div>

            {/* ========== INDIVIDUAL MODE ========== */}
            {mode === "individual" && (
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Search by institute name or city..."
                        value={individualSearch}
                        onChange={(e) => setIndividualSearch(e.target.value)}
                        className="w-full py-2.5 px-4 bg-white border border-amber-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-500"
                    />

                    <div className="bg-white rounded-xl border border-amber-100 overflow-hidden">
                        <div className="bg-slate-50 border-b border-slate-100 p-4 flex justify-between items-center">
                            <span className="font-bold text-slate-600 text-sm">Found {filteredIndividual.length} Institutes</span>
                            <button
                                onClick={toggleSelectAllIndividual}
                                disabled={filteredIndividual.length === 0}
                                className="flex items-center gap-1.5 text-amber-600 hover:text-amber-700 font-bold transition disabled:opacity-50"
                            >
                                {individualSelected.length === filteredIndividual.length && filteredIndividual.length > 0 ?
                                    <><CheckSquare className="w-4 h-4"/> Deselect All</> :
                                    <><Square className="w-4 h-4"/> Select All</>
                                }
                            </button>
                        </div>

                        <div className="max-h-[350px] overflow-y-auto">
                            {searchingIndividual ? (
                                <div className="p-8 text-center text-sm text-slate-400">Searching institutes...</div>
                            ) : filteredIndividual.length === 0 ? (
                                <div className="p-8 text-center text-sm text-slate-400">
                                    {individualSearch ? "No institutes found matching your search." : "Start typing to search institutes..."}
                                </div>
                            ) : (
                                <div>
                                    {filteredIndividual.map(inst => (
                                        <InstituteRow
                                            key={inst.id}
                                            inst={inst}
                                            selected={individualSelected.includes(inst.id)}
                                            onToggle={toggleIndividual}
                                            hasLead={inst.hasExistingLead}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ========== BULK MODE — no institute list, filters + estimated reach only ========== */}
            {mode === "bulk" && (
                <div className="space-y-5">
                    {/* Plans */}
                    <div>
                        <label className="text-xs font-bold text-amber-800 uppercase tracking-wide mb-2 block">Plans</label>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={selectAllPlans}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition flex items-center gap-1 ${
                                    plansAll ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                                }`}
                            >
                                <Layers className="w-3.5 h-3.5" /> All Plans
                            </button>
                            {ALL_PLANS.map((plan: string) => (
                                <button
                                    key={plan}
                                    onClick={() => togglePlan(plan)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                                        !plansAll && selectedPlans.includes(plan)
                                            ? 'bg-amber-500 text-white border-amber-600'
                                            : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                                    }`}
                                >
                                    {plan}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Cities */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-xs font-bold text-amber-800 uppercase tracking-wide block">Cities</label>
                                <button
                                    onClick={selectAllCities}
                                    className={`text-[10px] font-bold px-2 py-1 rounded-md border transition ${
                                        citiesAll ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                                    }`}
                                >
                                    All Cities
                                </button>
                            </div>
                            {citiesAll && (
                                <div className="text-xs text-slate-500 bg-white border border-dashed border-amber-200 rounded-xl p-3 mb-2">
                                    Targeting institutes in <b>every city</b>. Pick one below to narrow it down.
                                </div>
                            )}
                            <div className="relative mb-2">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                                <select onChange={handleAddCity} className="w-full pl-9 pr-4 py-2.5 bg-white border border-amber-200 text-slate-700 text-sm rounded-xl outline-none focus:ring-2 focus:ring-amber-500">
                                    <option value="">+ Add City...</option>
                                    {cities.map((c: { id: string; name: string }) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            {!citiesAll && (
                                <div className="flex flex-wrap gap-1.5">
                                    {selectedCities.length === 0 ? (
                                        <span className="text-[11px] text-red-500">No cities selected — pick one or use "All Cities".</span>
                                    ) : selectedCities.map((c: { id: string; name: string }) => (
                                        <span key={c.id} className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-1 rounded-md">
                                            {c.name} <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => removeCity(c.id)} />
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Categories */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-xs font-bold text-amber-800 uppercase tracking-wide block">Categories</label>
                                <button
                                    onClick={selectAllCategories}
                                    className={`text-[10px] font-bold px-2 py-1 rounded-md border transition ${
                                        categoriesAll ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                                    }`}
                                >
                                    All Categories
                                </button>
                            </div>
                            {categoriesAll && (
                                <div className="text-xs text-slate-500 bg-white border border-dashed border-amber-200 rounded-xl p-3 mb-2">
                                    Targeting <b>every category</b>. Pick one below to narrow it down.
                                </div>
                            )}
                            <div className="relative mb-2">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                                <select onChange={handleAddCategory} className="w-full pl-9 pr-4 py-2.5 bg-white border border-amber-200 text-slate-700 text-sm rounded-xl outline-none focus:ring-2 focus:ring-amber-500">
                                    <option value="">+ Add Category...</option>
                                    {categories.map((c: { id: string; name: string }) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            {!categoriesAll && (
                                <div className="flex flex-wrap gap-1.5">
                                    {selectedCategories.length === 0 ? (
                                        <span className="text-[11px] text-red-500">No categories selected — pick one or use "All Categories".</span>
                                    ) : selectedCategories.map((c: { id: string; name: string }) => (
                                        <span key={c.id} className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-1 rounded-md">
                                            {c.name} <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => removeCategory(c.id)} />
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <input
                        type="text"
                        placeholder="Optional: narrow by institute name..."
                        value={bulkSearch}
                        onChange={(e) => setBulkSearch(e.target.value)}
                        className="w-full py-2.5 px-4 bg-white border border-amber-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-500"
                    />

                    {/* No institute list — just the reach count */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl border border-amber-100 p-4">
                      <p className="text-xs font-bold text-amber-800 uppercase tracking-wide">Already Have This Lead</p>
                      <p className="text-sm text-slate-500 mt-1">Institutes excluded automatically.</p>
                      <div className="text-2xl font-extrabold text-red-600 min-w-[3ch] text-right mt-2">
                        {countLoading ? "…" : (estimatedCount?.alreadyHaveCount ?? 0)}
                      </div>
                    </div>

                    <div className="bg-white rounded-xl border border-amber-100 p-4">
                      <p className="text-xs font-bold text-amber-800 uppercase tracking-wide">Total Reach</p>
                      <p className="text-sm text-slate-500 mt-1">New institutes to target.</p>
                      <div className="text-2xl font-extrabold text-emerald-600 min-w-[3ch] text-right mt-2">
                        {countLoading ? "…" : (estimatedCount?.newReach ?? 0)}
                      </div>
                    </div>
                  </div>
                </div>
            )}

            <div className="space-y-4 mt-6 pt-6 border-t border-amber-200">
                <textarea
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="Add internal note for managers..."
                    className="w-full bg-white border border-amber-200 rounded-xl p-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-amber-500 resize-none h-16"
                />
                <button
                    onClick={handleForwardLead}
                    disabled={loading || !canForward}
                    className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                        canForward && !loading
                          ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-md'
                            : 'bg-amber-200 text-amber-50/50 cursor-not-allowed'
                    }`}
                >
                    {loading
                        ? "Forwarding..."
                        : mode === "individual"
                            ? `Forward to ${individualSelected.length} Institutes`
                            :  `Forward to ${estimatedCount?.newReach ?? 0} Institutes`
                    }
                    {!loading && <Send className="w-4 h-4" />}
                </button>
            </div>
        </div>
    );
}