"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";

import { authClient } from "@/lib/auth-client";

export function AuthPromptModal() {
  const pathname = usePathname();

  const { data: session } = authClient.useSession();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (session?.user) return;

    setOpen(false);

    const excludedRoutes = [
    "/login",
    "/register",
    "/confirm-otp",
    ];

    if (excludedRoutes.includes(pathname)) {
    return;
    }

    const timer = setTimeout(() => {
      setOpen(true);
    }, 15000);

    return () => clearTimeout(timer);
  }, [pathname, session]);

  if (session?.user) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md rounded-3xl border-0 p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-amber-50 via-white to-orange-50 p-8">

          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100">
            <Sparkles className="h-7 w-7 text-amber-600" />
          </div>

          <h2 className="text-center text-2xl font-bold">
            Want to Explore More?
          </h2>

          <p className="mt-3 text-center text-sm text-zinc-600">
            Create your free account to save institutes,
            compare coaching centers, write reviews,
            and get personalized recommendations.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <Link href="/register">
              <Button className="w-full bg-amber-500 hover:bg-amber-600">
                Create Free Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

            <Link href="/login">
              <Button
                variant="outline"
                className="w-full"
              >
                Login
              </Button>
            </Link>
          </div>

          <p className="mt-5 text-center text-xs text-zinc-500">
            Join thousands of students discovering the
            best coaching institutes.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}