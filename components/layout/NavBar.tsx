"use client";

import Link from "next/link";
import {
  BookOpen,
  Search,
  BarChart3,
  FileText,
  Building2,
  LogIn,
  UserPlus,
  Menu,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";


export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/60 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-285 items-center justify-between px-4 py-4 lg:px-8">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-xl shadow-lg shadow-amber-500/30">
            <Image
              src="/logo.png"
              alt="AcademyFind Logo"
              width={120}
              height={120} 
              className="mx-6"/>
          </div>

          <div>
            <span className="block text-lg font-bold tracking-tight">
              AcademyFind
            </span>

            <p className="hidden text-[0.6rem] sm:block text-amber-400">
              Academy Search Simplified
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          <Link href="/">
          <Button variant="ghost" className="gap-2">
            <Search className="size-4" />
            Search
          </Button>
          </Link>

          <Link href="/about">
            <Button variant="ghost" className="gap-2">
              <Building2 className="size-4" />
              About
            </Button>
          </Link>

          <Button variant="ghost" className="gap-2">
            <BarChart3 className="size-4" />
            Compare
          </Button>

          <Link href="/blog">
            <Button variant="ghost" className="gap-2">
              <FileText className="size-4" />
              Blogs
            </Button>
          </Link>

          <Link href="/contact">
            <Button variant="ghost" className="gap-2">
              <Building2 className="size-4" />
              Contact
            </Button>
          </Link>

        </nav>

        {/* Desktop Auth */}
        
        <div className="hidden lg:flex items-center gap-2">
          <Link href="/login">
          <Button variant="ghost" className="gap-2 cursor-pointer">
            <LogIn className="size-4" />
            Login
          </Button>
          </Link>
        
          <Link href="/register">
          <Button className="gap-2 bg-amber-400 text-white hover:bg-amber-500 cursor-pointer">
            <UserPlus className="size-4" />
            Sign Up
          </Button>
          </Link>
        </div>

        {/* Mobile Menu */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-75">
              <div className="mt-8 flex flex-col gap-2">

                <Link href="/">
                <Button
                  variant="ghost"
                  className="justify-start gap-3"
                >
                  <Search className="size-4" />
                  Search
                </Button>
                </Link>

                <Link href="/about">
                  <Button variant="ghost" className="justify-start gap-3">
                    <Building2 className="size-4" />
                    About Us
                  </Button>
                </Link>

                <Button
                  variant="ghost"
                  className="justify-start gap-3"
                >
                  <BarChart3 className="size-4" />
                  Compare
                </Button>

                <Link href="/blog">
                  <Button
                    variant="ghost"
                    className="justify-start gap-3"
                  >
                    <FileText className="size-4" />
                    Blogs
                  </Button>
                </Link>


                <Link href="/contact">
                  <Button
                    variant="ghost"
                    className="justify-start gap-3"
                  >
                    <Building2 className="size-4" />
                    Contact
                  </Button>
                </Link>

                <div className="my-4 border-t" />

                <Link href="/login">
                <Button
                  variant="outline"
                  className="justify-start gap-3"
                >
                  <LogIn className="size-4" />
                  Login
                </Button>
                </Link>

                <Link href="/register">
                <Button className="gap-3 bg-amber-500 hover:bg-amber-600">
                  <UserPlus className="size-4" />
                  Sign Up
                </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </header>
  );
}