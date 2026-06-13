// app/life-coach/page.tsx
"use client";

import { useState } from "react";
import { submitLifeCoachRequest } from "@/lib/User/user/life-coach";
import { Sparkles, Brain, Target, ShieldCheck, CheckCircle2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function LifeCoachLandingPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await submitLifeCoachRequest(formData);

    if (res.success) {
      setSuccess(true);
      toast.success("Details received!");
    } else {
      toast.error(res.error || "Something went wrong.");
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 bg-slate-50/50">
        <div className="max-w-md w-full bg-white border rounded-3xl p-8 text-center shadow-xl shadow-amber-900/5">
          <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Session Requested!</h2>
          <p className="text-slate-500 mt-2 text-sm leading-relaxed">
            Thank you for reaching out. Your mentorship profile is locked in our system. Our admin team or a senior counselor will contact you back shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/40 font-sans pb-16">
      
      {/* Hero Header */}
      <header className="bg-linear-to-b from-amber-50 via-background to-transparent dark:from-amber-950/10 py-16 text-center px-4">
        <div className="inline-flex items-center gap-2 rounded-full border bg-white px-4 py-1.5 text-xs font-bold text-amber-700 shadow-xs uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5" /> 1-on-1 Personalized Mentorship
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mt-6 tracking-tight">
          What is a <span className="text-amber-400">Life Coach?</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-slate-500 text-base md:text-lg">
          A life coach isn't just a teacher; they are career architects. They help you clear confusion, align your internal goals with market realities, and pick the ultimate path.
        </p>
      </header>

      {/* Grid: Pillars & Form */}
      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-4 max-w-6xl">
        
        {/* Left Side: Concept Explainers */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border rounded-2xl p-5 flex gap-4 shadow-2xs border-amber-200">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl h-fit"><Brain className="w-5 h-5" /></div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Clarity Over Chaos</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Stuck between multiple stream options? Life coaching drills deep down into your behavioral strengths to clear out doubt layers.</p>
            </div>
          </div>

          <div className="bg-white border rounded-2xl p-5 flex gap-4 shadow-2xs border-amber-200">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl h-fit"><Target className="w-5 h-5" /></div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Goal Mapping blueprints</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Turn ambiguous targets into structured week-by-week educational modules. Track changes using micro-milestones metrics.</p>
            </div>
          </div>

          <div className="bg-white border rounded-2xl p-5 flex gap-4 shadow-2xs border-amber-200">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl h-fit"><ShieldCheck className="w-5 h-5" /></div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">100% Confidential</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Every data byte shared here is bound inside locked parameters. Peer validation audits remain completely internal.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Request Form */}
        <div className="lg:col-span-7 bg-white border border-amber-300 rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800">Book Free Strategy Call</h2>
            <p className="text-xs text-slate-400 mt-0.5">Fill out your telemetry parameters below for an automatic callback link log.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Full Name *</label>
                <input type="text" name="fullName" required placeholder="John Doe" className="w-full px-3 py-2.5 bg-white border border-amber-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 outline-none text-sm transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Contact Number *</label>
                <input type="tel" maxLength={10} name="phone" required placeholder="+91 98765 43210" className="w-full px-3 py-2.5 bg-white border border-amber-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 outline-none text-sm transition-all" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Email ID *</label>
              <input type="email" name="email" required placeholder="name@domain.com" className="w-full px-3 py-2.5 bg-white border border-amber-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 outline-none text-sm transition-all" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Current Dilemma / Message</label>
              <textarea name="message" rows={4} placeholder="Briefly describe what is confusing you (exams, branches, balancing school and coaching, etc.)..." className="w-full px-3 py-2.5 bg-white border border-amber-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 outline-none text-sm transition-all resize-none"></textarea>
            </div>

            <button type="submit" disabled={loading} className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-amber-600/10 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? "Locking Profile..." : "Submit Call Request"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}