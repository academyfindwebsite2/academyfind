"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  GraduationCap,
  Star,
  MapPin,
  User,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";

export default function LoginPage() {
  const [method, setMethod] = useState<"email" | "phone">("email");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword,setShowConfirmPassword] = useState(false)

  return (
    <main className="min-h-screen bg-[#f8f8f8] p-4 lg:p-8">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-7xl overflow-hidden rounded-[32px] bg-white shadow-2xl">
        {/* LEFT PANEL */}
        <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-b from-amber-400 to-orange-500 p-12 text-white lg:flex lg:flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/90 backdrop-blur">
            <Image src="/logo.png" alt="academy find logo" width={120} height={120}/>
            </div>

            <span className="font-semibold">AcademyFind</span>
        </div>

        {/* Content */}
        <div className="mt-20">
            <h1 className="max-w-md text-5xl font-bold leading-tight">
            Start Your Learning Journey With Confidence
            </h1>

            <p className="mt-5 max-w-sm text-orange-100">
            Join thousands of students discovering the best coaching
            institutes across India.
            </p>

            {/* Journey Steps */}
            <div className="mt-12 space-y-4">
            {[
                {
                title: "Search Institutes",
                desc: "Explore coaching institutes across India",
                },
                {
                title: "Compare Options",
                desc: "Check ratings, reviews and facilities",
                },
                {
                title: "Connect Directly",
                desc: "Reach institutes without middlemen",
                },
                {
                title: "Choose Confidently",
                desc: "Make better academic decisions",
                },
            ].map((step, index) => (
                <div
                key={step.title}
                className="flex items-start gap-4 rounded-2xl bg-white/10 p-4 backdrop-blur-md"
                >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-orange-500">
                    {index + 1}
                </div>

                <div>
                    <h3 className="font-semibold">
                    {step.title}
                    </h3>

                    <p className="mt-1 text-sm text-orange-100">
                    {step.desc}
                    </p>
                </div>
                </div>
            ))}
            </div>
        </div>

        {/* Decorative Circle */}
        <div className="absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

        <div className="absolute -top-20 -left-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
        </div>

        {/* RIGHT PANEL */}
        <div className="flex flex-1 items-center justify-center bg-[#fafafa] px-6 py-10">
          <div className="w-full max-w-md">
            {/* Mobile Branding */}
            {/* <div className="mb-8 flex justify-center lg:hidden">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500 text-white">
                <GraduationCap />
              </div>
            </div> */}

            {/* Logo */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl  text-white shadow-lg shadow-amber-500/30">
                <Image
                    src="/logo.png"
                    alt="AcademyFind Logo"
                    width={120}
                    height={120} />
              </div>

              <h3 className="text-sm font-bold tracking-[0.25em] text-slate-900">
                ACADEMYFIND
              </h3>

              <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-amber-400">
                Academy Search Simplified
              </p>
            </div>

            {/* Heading */}
            <div className="mb-6 text-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-rose-200 bg-clip-text text-transparent">
                Create Account
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Join  AcademyFind  and  discover  India's  best  coaching  institutes.
              </p>
            </div>

            {/* Toggle */}
            <div className="mb-6 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setMethod("email")}
                className={`flex items-center justify-center gap-2 cursor-pointer rounded-lg py-2 text-sm font-medium transition-all ${
                  method === "email"
                    ? "bg-amber-400 text-white shadow-sm"
                    : "text-slate-600"
                }`}
              >
                <Mail size={16} />
                Email
              </button>

              <button
                type="button"
                onClick={() => setMethod("phone")}
                className={`flex items-center justify-center gap-2 cursor-pointer rounded-lg py-2 text-sm font-medium transition-all ${
                  method === "phone"
                    ? "bg-amber-400 text-white shadow-sm"
                    : "text-slate-600"
                }`}
              >
                <Phone size={16} />
                Phone
              </button>
            </div>

            <form className="space-y-5">

                <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                    Full Name
                </label>

                <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                    type="text"
                    placeholder="Enter your full name"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                    />
                </div>
                </div>
              {/* Email / Phone */}
              <div> 
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  {method === "email"
                    ? "Email Address"
                    : "Phone Number"}
                </label>

                <div className="relative">
                  {method === "email" ? (
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  ) : (
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  )}

                  <input
                    type={method === "email" ? "email" : "tel"}
                    placeholder={
                      method === "email"
                        ? "Enter your email"
                        : "Enter mobile number"
                    }
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700">
                    Password
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-xs text-amber-400 hover:text-amber-500"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-12 text-sm outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                    Confirm Password
                </label>

                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-12 text-sm outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                    />

                    <button
                    type="button"
                    onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                    {showConfirmPassword ? (
                        <EyeOff size={18} />
                    ) : (
                        <Eye size={18} />
                    )}
                    </button>
                </div>
                </div>

              {/* Login */}
              <button
                type="submit"
                className="h-12 w-full rounded-xl bg-amber-400 font-semibold text-white shadow-md transition-all hover:shadow-lg hover:shadow-amber-500/30"
              >
                Create Account
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="mx-4 text-xs text-slate-400">
                OR
              </span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            {/* Google Login */}
            <button
              type="button"
              className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <FcGoogle size={20} />
              Continue with Google
            </button>

            {/* SignIn */}
            <p className="mt-8 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-amber-400 hover:text-amber-500"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}