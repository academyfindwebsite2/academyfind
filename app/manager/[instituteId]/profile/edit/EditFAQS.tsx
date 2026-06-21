"use client"

import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { HelpCircle, Plus, Trash2, Save, ArrowUp, ArrowDown } from "lucide-react";
import { updateInstituteFAQs } from "@/lib/User/manager/updateRelateddata";

type FAQ = { id?: string; question: string; answer: string };

export default function EditFAQs({ instituteId, currentFAQs, maxLimit }: { instituteId: string; currentFAQs: any[]; maxLimit: number }) {
    const [faqs, setFaqs] = useState<FAQ[]>(
        currentFAQs.length
            ? [...currentFAQs].sort((a: any, b:any) => a.order - b.order).map((f:any) => ({ id: f.id, question: f.question, answer: f.answer }))
            : []
    );
    const [isSaving, setIsSaving] = useState(false);

    const addFAQ = () => {
        if (faqs.length >= maxLimit) {
            toast.error(`Your plan allows a maximum of ${maxLimit} FAQs.`);
            return;
        }
        setFaqs(prev => [...prev, { question: "", answer: "" }]);
    };

    const updateField = (idx: number, field: keyof FAQ, value: string) =>
        setFaqs(prev => prev.map((f:any, i:any) => i === idx ? { ...f, [field]: value } : f));

    const removeFAQ = (idx: number) => setFaqs(prev => prev.filter((_:any, i:any) => i !== idx));

    const move = (idx: number, dir: -1 | 1) => {
        setFaqs(prev => {
            const next = [...prev];
            const target = idx + dir;
            if (target < 0 || target >= next.length) return prev;
            [next[idx], next[target]] = [next[target], next[idx]];
            return next;
        });
    };

    const handleSave = async () => {
        const cleaned = faqs.filter((f:any) => f.question.trim() && f.answer.trim());
        setIsSaving(true);
        const result = await updateInstituteFAQs(instituteId, cleaned);
        if (result.success) {
            toast.success("FAQs updated!");
        } else {
            toast.error(result.error || "Failed to save FAQs");
        }
        setIsSaving(false);
    };

    return (
        <Card className="rounded-3xl border-slate-200 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-slate-50 border-b border-slate-100">
                <CardTitle className="flex items-center gap-2 text-base"><HelpCircle className="w-5 h-5 text-purple-600" /> FAQs</CardTitle>
                <CardDescription>{faqs.length}/{maxLimit} questions added — these also power your FAQ rich results on Google</CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
                {faqs.length === 0 && <p className="text-sm text-slate-400 italic">No FAQs added yet.</p>}

                {faqs.map((f: any, idx:any) => (
                    <div key={f.id || idx} className="border border-slate-200 rounded-2xl p-4 space-y-2 bg-slate-50 relative">
                        <div className="flex items-center justify-between">
                            <Label className="text-xs text-slate-500">Question {idx + 1}</Label>
                            <div className="flex items-center gap-1">
                                <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => move(idx, -1)} disabled={idx === 0}><ArrowUp className="w-3.5 h-3.5" /></Button>
                                <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => move(idx, 1)} disabled={idx === faqs.length - 1}><ArrowDown className="w-3.5 h-3.5" /></Button>
                                <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-red-600" onClick={() => removeFAQ(idx)}><Trash2 className="w-3.5 h-3.5" /></Button>
                            </div>
                        </div>
                        <Input value={f.question} onChange={(e) => updateField(idx, "question", e.target.value)} placeholder="e.g. Do you provide study material?" className="bg-white" />
                        <Textarea value={f.answer} onChange={(e) => updateField(idx, "answer", e.target.value)} placeholder="Write a clear, helpful answer..." rows={2} className="bg-white" />
                    </div>
                ))}

                <div className="flex items-center justify-between pt-2">
                    <Button type="button" variant="outline" onClick={addFAQ} className="gap-1">
                        <Plus className="w-4 h-4" /> Add FAQ
                    </Button>
                    <Button type="button" onClick={handleSave} disabled={isSaving} className="bg-purple-600 hover:bg-purple-700 text-white gap-2">
                        {isSaving ? "Saving..." : <><Save className="w-4 h-4" /> Save FAQs</>}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}