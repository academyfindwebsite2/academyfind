"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth/auth-client";
import {
  BookOpen,
  Search,
  BarChart3,
  FileText,
  Building2,
  LogIn,
  UserPlus,
  Menu,
  User,
  Building,
  IdCard,
} from "lucide-react";
// 👇 Hooks import kiye hain auto-close logic ke liye
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation"; 

import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader, 
  SheetTitle,
} from "@/components/ui/sheet";
import Image from "next/image";
import UserDropdown from "@/components/navigation/UserDropdown";

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname(); 

  // 👇 Mobile Menu ko control karne ke liye state
  const [isOpen, setIsOpen] = useState(false);

  // 👇 Route change hone par menu auto-close hoga
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const handleLogOut = async () => {
    try {
      await authClient.signOut();
      setIsOpen(false); // Logout par bhi menu close karein
      router.push("/");
    } catch (err) {
      console.error(err);
    }
  };

  

  return (
    <header className="sticky top-0 z-110 border-b border-zinc-200/60 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-285 items-center justify-between px-4 py-4 lg:px-8">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-xl shadow-lg shadow-amber-500/30">
            <Image
              src="/logo.png"
              alt="AcademyFind Logo"
              width={120}
              height={120}
              className="mx-6"
            />
          </div>

          <div>
            <span className="block text-lg font-bold tracking-tight">
              AcademyFind
            </span>
            <p className="text-[0.6rem] text-amber-400">
              Academy Search Simplified
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-7 mr-4">
          <Link href="/" className="text-sm font-semibold text-slate-600 hover:text-amber-500 transition-colors">
            Search
          </Link>
          <Link href="/about" className="text-sm font-semibold text-slate-600 hover:text-amber-500 transition-colors">
            About Us
          </Link>
          <Link href="/careers" className="text-sm font-semibold text-slate-600 hover:text-amber-500 transition-colors">
            Careers
          </Link>
          <Link href="/blog" className="text-sm font-semibold text-slate-600 hover:text-amber-500 transition-colors">
            Resources
          </Link>
          <Link href="/contact" className="text-sm font-semibold text-slate-600 hover:text-amber-500 transition-colors">
            Contact
          </Link>

          {/* Visual Separator */}
          <div className="h-5 w-px bg-slate-200/80"></div>

          <Link 
            href="/user/create-institute" 
            className="group flex items-center gap-1.5 text-sm font-bold text-amber-600 hover:text-amber-700 transition-colors"
          >
            <Building className="size-4 group-hover:scale-110 transition-transform" />
            List your Institute
          </Link>
        </nav>

        {/* Desktop Auth */}
        <div className="hidden lg:flex items-center gap-3">
          {session?.user ? (
            <>
              <UserDropdown user={session.user}/>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" className="gap-2 cursor-pointer">
                <Link href="/login">
                  <LogIn className="size-4" />
                  Login
                </Link>
              </Button>

              <Button asChild className="gap-2 bg-amber-400 text-white hover:bg-amber-500 cursor-pointer">
                <Link href="/register">
                  <UserPlus className="size-4" />
                  Sign Up
                </Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="lg:hidden">
          {/* 🚀 Fix: Sheet ko state-driven banaya */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-75 z-110">
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-8 flex flex-col gap-2">
                
                {/* 🚀 Fix: Mobile Links mein bhi asChild lagaya */}
                <Button asChild variant="ghost" className="justify-start gap-3">
                  <Link href="/">
                    <Search className="size-4" />
                    Search
                  </Link>
                </Button>

                <Button asChild variant="ghost" className="justify-start gap-3">
                  <Link href="/about">
                    <Building2 className="size-4" />
                    About Us
                  </Link>
                </Button>

                <Button asChild variant="ghost" className="justify-start gap-3">
                  <Link href="/careers">
                    <IdCard className="size-4" />
                    Careers
                  </Link>
                </Button>

                <Button asChild variant="ghost" className="justify-start gap-3">
                  <Link href="/blog">
                    <FileText className="size-4" />
                    Resources
                  </Link>
                </Button>

                <Button asChild variant="ghost" className="justify-start gap-3">
                  <Link href="/contact">
                    <Building2 className="size-4" />
                    Contact Us
                  </Link>
                </Button>

                <Button asChild variant="ghost" className="justify-start gap-3">
                  <Link href="/contact">
                    <Building className="size-4" />
                    List Your Institute?
                  </Link>
                </Button>

                <div className="my-4 border-t" />

                {session?.user ? (
                  <>
                    <UserDropdown user={session.user} />
                  </>
                ) : (
                  <>
                    <Button asChild variant="outline" className="justify-start gap-3">
                      <Link href="/login">
                        <LogIn className="size-4" />
                        Login
                      </Link>
                    </Button>

                    <Button asChild className="gap-3 bg-amber-500 hover:bg-amber-600">
                      <Link href="/register">
                        <UserPlus className="size-4" />
                        Sign Up
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </header>
  );
}