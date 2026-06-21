"use client"

import { useState } from "react";
import toast from "react-hot-toast";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Clock, Save, Loader2 } from "lucide-react";
import { updateOperatingHours } from "@/lib/User/manager/updateRelateddata";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

type Hour = { dayOfWeek: number; openTime: string; closeTime: string; isClosed: boolean };

export default function EditOperatingHours({ instituteId, currentHours }: { instituteId: string; currentHours: any[] }) {
    const [hours, setHours] = useState<Hour[]>(
        DAYS.map((_:any, i:any) => {
            const existing = currentHours.find((h: any) => h.dayOfWeek === i);
            return existing 
                ? { dayOfWeek: i, openTime: existing.openTime || "09:00", closeTime: existing.closeTime || "18:00", isClosed: existing.isClosed }
                : { dayOfWeek: i, openTime: "09:00", closeTime: "18:00", isClosed: i === 0 }; // Default Sunday closed
        })
    );
    const [isSaving, setIsSaving] = useState(false);

    const updateDay = (idx: number, field: keyof Hour, val: any) => {
        setHours(prev => prev.map((h: any, i:any) => i === idx ? { ...h, [field]: val } : h));
    };

    const handleSave = async () => {
        setIsSaving(true);
        const result = await updateOperatingHours(instituteId, hours);
        if (result.success) toast.success("Operating hours saved!");
        else toast.error("Failed to save hours");
        setIsSaving(false);
    };

    return (
        <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-4">
                <Label className="text-base flex items-center gap-2 text-slate-800"><Clock className="w-4 h-4 text-blue-600"/> Weekly Operating Hours</Label>
                <Button type="button" onClick={handleSave} disabled={isSaving} size="sm" variant="outline" className="gap-2">
                    {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Save Hours
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {hours.map((h:any, idx:any) => (
                    <div key={idx} className={`flex items-center justify-between p-3 rounded-xl border ${h.isClosed ? 'bg-slate-50 border-slate-200' : 'bg-white border-blue-100'}`}>
                        <div className="w-24">
                            <span className={`text-sm font-semibold ${h.isClosed ? 'text-slate-400' : 'text-slate-700'}`}>{DAYS[idx]}</span>
                        </div>
                        
                        {!h.isClosed ? (
                            <div className="flex items-center gap-1.5 flex-grow justify-center">
                                <Input type="time" value={h.openTime} onChange={(e) => updateDay(idx, "openTime", e.target.value)} className="h-8 w-24 text-xs px-2" />
                                <span className="text-slate-400 text-xs">-</span>
                                <Input type="time" value={h.closeTime} onChange={(e) => updateDay(idx, "closeTime", e.target.value)} className="h-8 w-24 text-xs px-2" />
                            </div>
                        ) : (
                            <div className="flex-grow text-center text-xs font-semibold text-rose-400">CLOSED</div>
                        )}
                        
                        <div className="flex items-center gap-2 pl-3">
                            <Switch checked={!h.isClosed} onCheckedChange={(checked) => updateDay(idx, "isClosed", !checked)} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}