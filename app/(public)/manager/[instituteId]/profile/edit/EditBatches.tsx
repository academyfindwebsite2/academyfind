"use client"

import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GraduationCap, Plus, Trash2, Save, IndianRupee } from "lucide-react";
import { updateInstituteBatches } from "@/lib/User/manager/updateRelateddata";

type Batch = {
    id?: string;
    name: string;
    duration: string;
    fee: string;
    originalFee: string;
    batchType: string;
    mode: "OFFLINE" | "ONLINE" | "HYBRID";
    timing: string;
    seatsTotal: string;
    seatsLeft: string;
    ageGroupMin: string;
    ageGroupMax: string;
};

const emptyBatch: Batch = {
    name: "", duration: "", fee: "", originalFee: "", batchType: "", mode: "OFFLINE",
    timing: "", seatsTotal: "", seatsLeft: "", ageGroupMin: "", ageGroupMax: ""
};

export default function EditBatches({ instituteId, currentBatches, maxLimit }: { instituteId: string; currentBatches: any[]; maxLimit: number }) {
    const [batches, setBatches] = useState<Batch[]>(
        currentBatches.length
            ? currentBatches.map((b: any) => ({
                id: b.id, name: b.name || "", duration: b.duration || "", fee: b.fee?.toString() || "",
                originalFee: b.originalFee?.toString() || "", batchType: b.batchType || "", mode: b.mode || "OFFLINE",
                timing: b.timing || "", seatsTotal: b.seatsTotal?.toString() || "", seatsLeft: b.seatsLeft?.toString() || "",
                ageGroupMin: b.ageGroupMin?.toString() || "", ageGroupMax: b.ageGroupMax?.toString() || ""
            }))
            : []
    );
    const [isSaving, setIsSaving] = useState(false);

    const addBatch = () => {
        if (batches.length >= maxLimit) {
            toast.error(`Your plan allows a maximum of ${maxLimit} batches.`);
            return;
        }
        setBatches(prev => [...prev, { ...emptyBatch }]);
    };

    const updateField = (idx: number, field: keyof Batch, value: string) => {
        setBatches(prev => prev.map((b: any, i: any) => i === idx ? { ...b, [field]: value } : b));
    };

    const removeBatch = (idx: number) => setBatches(prev => prev.filter((_: any, i:any) => i !== idx));

    const handleSave = async () => {
        const cleaned = batches.filter((b:any) => b.name.trim());
        setIsSaving(true);
        const result = await updateInstituteBatches(instituteId, cleaned);
        if (result.success) {
            toast.success("Batches updated!");
        } else {
            toast.error(result.error || "Failed to save batches");
        }
        setIsSaving(false);
    };

    return (
        <Card className="rounded-3xl border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/60 backdrop-blur-xl transition-all duration-700 ease-[cubic-bezier(0.2,1,0.2,1)] hover:scale-[1.01]">
            <CardHeader className="bg-gradient-to-r from-stone-50 to-stone-50 border-b border-stone-100">
                <CardTitle className="flex items-center gap-2 text-base"><GraduationCap className="w-5 h-5 text-stone-800" /> Batches & Fee Structure</CardTitle>
                <CardDescription>{batches.length}/{maxLimit} batches added</CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
                {batches.length === 0 && <p className="text-sm text-stone-400 italic">No batches added yet.</p>}

                {batches.map((b: any, idx: any) => (
                    <div key={b.id || idx} className="border border-stone-200 rounded-2xl p-4 space-y-3 bg-stone-50 relative">
                        <button type="button" onClick={() => removeBatch(idx)} className="absolute top-3 right-3 text-stone-400 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-6">
                            <div className="space-y-1">
                                <Label className="text-xs">Batch Name</Label>
                                <Input value={b.name} onChange={(e) => updateField(idx, "name", e.target.value)} placeholder="UPSC Foundation Batch" className="bg-white" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">Timing</Label>
                                <Input value={b.timing} onChange={(e) => updateField(idx, "timing", e.target.value)} placeholder="Mon-Sat, 6AM-9AM" className="bg-white" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">Duration</Label>
                                <Input value={b.duration} onChange={(e) => updateField(idx, "duration", e.target.value)} placeholder="12 months" className="bg-white" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">Batch Type</Label>
                                <select value={b.batchType} onChange={(e) => updateField(idx, "batchType", e.target.value)} className="flex h-10 w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm">
                                    <option value="">Select Type</option>
                                    <option value="Weekday">Weekday</option>
                                    <option value="Weekend">Weekend</option>
                                    <option value="Crash Course">Crash Course</option>
                                    <option value="Regular">Regular</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">Mode</Label>
                                <select value={b.mode} onChange={(e) => updateField(idx, "mode", e.target.value)} className="flex h-10 w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm">
                                    <option value="OFFLINE">Offline</option>
                                    <option value="ONLINE">Online</option>
                                    <option value="HYBRID">Hybrid</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">Fee (₹)</Label>
                                <div className="relative">
                                    <IndianRupee className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                                    <Input type="number" value={b.fee} onChange={(e) => updateField(idx, "fee", e.target.value)} className="bg-white pl-7" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">Original Fee (₹, optional — for discount display)</Label>
                                <Input type="number" value={b.originalFee} onChange={(e) => updateField(idx, "originalFee", e.target.value)} className="bg-white" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">Seats Total</Label>
                                <Input type="number" value={b.seatsTotal} onChange={(e) => updateField(idx, "seatsTotal", e.target.value)} className="bg-white" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">Seats Left</Label>
                                <Input type="number" value={b.seatsLeft} onChange={(e) => updateField(idx, "seatsLeft", e.target.value)} className="bg-white" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">Age Group Min (sports/dance/music)</Label>
                                <Input type="number" value={b.ageGroupMin} onChange={(e) => updateField(idx, "ageGroupMin", e.target.value)} className="bg-white" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">Age Group Max</Label>
                                <Input type="number" value={b.ageGroupMax} onChange={(e) => updateField(idx, "ageGroupMax", e.target.value)} className="bg-white" />
                            </div>
                        </div>
                    </div>
                ))}

                <div className="flex items-center justify-between pt-2">
                    <Button type="button" variant="outline" onClick={addBatch} className="gap-1">
                        <Plus className="w-4 h-4" /> Add Batch
                    </Button>
                    <Button type="button" onClick={handleSave} disabled={isSaving} className="bg-stone-800 hover:bg-stone-900 text-white gap-2">
                        {isSaving ? "Saving..." : <><Save className="w-4 h-4" /> Save Batches</>}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}