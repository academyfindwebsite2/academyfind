"use client"

import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trophy, Plus, Trash2, Save, Image as ImageIcon } from "lucide-react";
import { updateAchievements } from "@/lib/User/manager/updateRelateddata";

type Achievement = {
    id?: string;
    year: string;
    title: string;
    studentName: string;
    achievementType: string;
    imageUrl: string;
    _file?: File | null;
};

export default function EditAchievements({ instituteId, currentAchievements, maxLimit }: { instituteId: string; currentAchievements: any[]; maxLimit: number }) {
    const [items, setItems] = useState<Achievement[]>(
        currentAchievements.map((a:any) => ({
            id: a.id, year: a.year?.toString() || "", title: a.title || "", studentName: a.studentName || "",
            achievementType: a.achievementType || "", imageUrl: a.imageUrl || "", _file: null
        }))
    );
    const [isSaving, setIsSaving] = useState(false);

    const addItem = () => {
        if (items.length >= maxLimit) {
            toast.error(`Your plan allows a maximum of ${maxLimit} achievements.`);
            return;
        }
        setItems(prev => [...prev, { year: new Date().getFullYear().toString(), title: "", studentName: "", achievementType: "", imageUrl: "", _file: null }]);
    };

    const updateField = (idx: number, field: keyof Achievement, value: any) =>
        setItems(prev => prev.map((it: any, i: any) => i === idx ? { ...it, [field]: value } : it));

    const handleImagePick = (idx: number, file: File | null) => {
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image too large. Max 5MB.");
            return;
        }
        updateField(idx, "_file", file);
        updateField(idx, "imageUrl", URL.createObjectURL(file));
    };

    const removeItem = (idx: number) => setItems(prev => prev.filter((_: any, i: any) => i !== idx));

    const handleSave = async () => {
        const cleaned = items.filter((it: any) => it.title.trim() && it.year);
        setIsSaving(true);

        const formData = new FormData();
        formData.append("data", JSON.stringify(cleaned.map(({ _file, ...rest }) => rest)));
        cleaned.forEach((it: any, idx: any) => {
            if (it._file) formData.append(`image_${idx}`, it._file);
        });

        const result = await updateAchievements(instituteId, formData);
        if (result.success) {
            toast.success("Achievements updated!");
        } else {
            toast.error(result.error || "Failed to save achievements");
        }
        setIsSaving(false);
    };

    return (
        <Card className="rounded-3xl border-slate-200 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-slate-50 border-b border-slate-100">
                <CardTitle className="flex items-center gap-2 text-base"><Trophy className="w-5 h-5 text-yellow-600" /> Achievements Timeline</CardTitle>
                <CardDescription>{items.length}/{maxLimit} achievements added</CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
                {items.length === 0 && <p className="text-sm text-slate-400 italic">No achievements added yet.</p>}

                {items.map((it: any, idx: any) => (
                    <div key={it.id || idx} className="border border-slate-200 rounded-2xl p-4 bg-slate-50 relative flex gap-4">
                        <button type="button" onClick={() => removeItem(idx)} className="absolute top-3 right-3 text-slate-400 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                        </button>

                        <label className="cursor-pointer shrink-0">
                            <div className="w-20 h-20 rounded-xl border border-slate-200 bg-white flex items-center justify-center overflow-hidden">
                                {it.imageUrl ? <img src={it.imageUrl} className="w-full h-full object-cover" /> : <ImageIcon className="w-6 h-6 text-slate-300" />}
                            </div>
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImagePick(idx, e.target.files?.[0] || null)} />
                        </label>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-grow pr-6">
                            <div className="space-y-1">
                                <Label className="text-xs">Title</Label>
                                <Input value={it.title} onChange={(e) => updateField(idx, "title", e.target.value)} placeholder="AIR 45 - UPSC CSE" className="bg-white" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">Year</Label>
                                <Input type="number" value={it.year} onChange={(e) => updateField(idx, "year", e.target.value)} className="bg-white" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">Student Name (optional)</Label>
                                <Input value={it.studentName} onChange={(e) => updateField(idx, "studentName", e.target.value)} className="bg-white" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">Type</Label>
                                <select value={it.achievementType} onChange={(e) => updateField(idx, "achievementType", e.target.value)} className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm">
                                    <option value="">Select Type</option>
                                    <option value="Exam Rank">Exam Rank</option>
                                    <option value="Tournament Win">Tournament Win</option>
                                    <option value="Certification">Certification</option>
                                    <option value="Performance Award">Performance Award</option>
                                </select>
                            </div>
                        </div>
                    </div>
                ))}

                <div className="flex items-center justify-between pt-2">
                    <Button type="button" variant="outline" onClick={addItem} className="gap-1">
                        <Plus className="w-4 h-4" /> Add Achievement
                    </Button>
                    <Button type="button" onClick={handleSave} disabled={isSaving} className="bg-yellow-600 hover:bg-yellow-700 text-white gap-2">
                        {isSaving ? "Saving..." : <><Save className="w-4 h-4" /> Save Achievements</>}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}