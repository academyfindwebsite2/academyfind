"use client"

import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Plus, Trash2, Save, Image as ImageIcon, Loader2 } from "lucide-react";
import { updateNotablePersons } from "@/lib/User/manager/updateRelateddata";

type Person = { id?: string; name: string; batchYear: string; placedAt: string; package: string; imageUrl: string; _file?: File | null; };

export default function EditNotablePersons({ instituteId, currentPersons, maxLimit }: { instituteId: string; currentPersons: any[]; maxLimit: number }) {
    const [items, setItems] = useState<Person[]>(
        currentPersons.map((p: any) => ({
            id: p.id, name: p.name || "", batchYear: p.batchYear?.toString() || "", placedAt: p.placedAt || "", package: p.package || "", imageUrl: p.imageUrl || "", _file: null
        }))
    );
    const [isSaving, setIsSaving] = useState(false);

    const addItem = () => {
        if (items.length >= maxLimit) {
            toast.error(`Limit reached (${maxLimit}).`);
            return;
        }
        setItems(prev => [...prev, { name: "", batchYear: "", placedAt: "", package: "", imageUrl: "", _file: null }]);
    };

    const updateField = (idx: number, field: keyof Person, value: any) =>
        setItems(prev => prev.map((it: any, i: any) => i === idx ? { ...it, [field]: value } : it));

    const handleImagePick = (idx: number, file: File | null) => {
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) return toast.error("Image too large (Max 5MB)");
        updateField(idx, "_file", file);
        updateField(idx, "imageUrl", URL.createObjectURL(file));
    };

    const removeItem = (idx: number) => setItems(prev => prev.filter((_: any, i: any) => i !== idx));

    const handleSave = async () => {
        const cleaned = items.filter((it: any) => it.name.trim());
        setIsSaving(true);

        const formData = new FormData();
        formData.append("data", JSON.stringify(cleaned.map(({ _file, ...rest }) => rest)));
        cleaned.forEach((it: any, idx: any) => { if (it._file) formData.append(`image_${idx}`, it._file); });

        const result = await updateNotablePersons(instituteId, formData);
        if (result.success) toast.success("Notable Alumni updated!");
        else toast.error(result.error || "Failed to save");

        setIsSaving(false);
    };

    return (
        <Card className="p-0 rounded-3xl border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/60 backdrop-blur-xl transition-all duration-700 ease-[cubic-bezier(0.2,1,0.2,1)] hover:scale-[1.01] overflow-hidden">
            <CardHeader className="rounded-t-3xl bg-gradient-to-r from-[#ebdbb7]/40 to-transparent border-b border-[#ebdbb7]/20 p-6 pb-4">
                <CardTitle className="flex items-center gap-2 text-base"><Users className="w-5 h-5 text-stone-800" /> Notable Alumni</CardTitle>
                <CardDescription>{items.length}/{maxLimit} alumni added</CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
                {items.length === 0 && <p className="text-sm text-stone-400 italic">No notable alumni added yet.</p>}

                {items.map((it: any, idx: any) => (
                    <div key={it.id || idx} className="border border-stone-200 rounded-2xl p-4 bg-stone-50 relative flex gap-4">
                        <button type="button" onClick={() => removeItem(idx)} className="absolute top-3 right-3 text-stone-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>

                        <label className="cursor-pointer shrink-0">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-white shadow-sm bg-stone-200 flex items-center justify-center overflow-hidden">
                                {it.imageUrl ? <img src={it.imageUrl} className="w-full h-full object-cover" /> : <ImageIcon className="w-6 h-6 text-stone-400" />}
                            </div>
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImagePick(idx, e.target.files?.[0] || null)} />
                        </label>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-grow pr-6">
                            <div className="space-y-1"><Label className="text-xs">Student Name</Label><Input value={it.name} onChange={(e) => updateField(idx, "name", e.target.value)} placeholder="Rahul Kumar" className="bg-white" /></div>
                            <div className="space-y-1"><Label className="text-xs">Batch Year</Label><Input type="number" value={it.batchYear} onChange={(e) => updateField(idx, "batchYear", e.target.value)} placeholder="2023" className="bg-white" /></div>
                            <div className="space-y-1"><Label className="text-xs">Placed At / College</Label><Input value={it.placedAt} onChange={(e) => updateField(idx, "placedAt", e.target.value)} placeholder="IIT Delhi / Google" className="bg-white" /></div>
                            <div className="space-y-1"><Label className="text-xs">Package / Rank (Optional)</Label><Input value={it.package} onChange={(e) => updateField(idx, "package", e.target.value)} placeholder="40 LPA / AIR 15" className="bg-white" /></div>
                        </div>
                    </div>
                ))}

                <div className="flex items-center justify-between pt-2">
                    <Button type="button" variant="outline" onClick={addItem} className="gap-1"><Plus className="w-4 h-4" /> Add Alumni</Button>
                    <Button type="button" onClick={handleSave} disabled={isSaving} className="bg-stone-900 hover:bg-[#ebdbb7] hover:text-stone-900 text-white gap-2 transition-colors">
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Alumni
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}