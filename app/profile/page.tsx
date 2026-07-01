import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import LogoutButton from "@/components/layout/LogOut";
import { Bookmark, Clock, PenTool, ArrowRight, FileText, Scale, MapPin, Building2, PlusCircle } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Profile Page | AcademyFind",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ProfilePage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) redirect('/login');
    const { user: sessionUser } = session;

    const dbUser = await prisma.user.findUnique({
        where: { id: sessionUser.id },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            isActive: true,
            emailVerified: true,
            createdAt: true,
            canAddInstitute: true,
            blogAuthorProfile: {
                select: {
                    username: true,
                    displayName: true,
                }
            }
        }
    });

    if (!dbUser) redirect('/login');

    // 🚀 Fetch Shortlisted Institutes
    const shortlistedItems = await prisma.userShortlist.findMany({
        where: { userId: dbUser.id },
        include: { institute: { include: { city: true } } },
        orderBy: { createdAt: "desc" }
    });

    // 🚀 Fetch Visit History
    const historyItems = await prisma.userHistory.findMany({
        where: { userId: dbUser.id },
        include: { institute: { include: { city: true } } },
        orderBy: { viewedAt: "desc" }
    });

    const displayShortlist = shortlistedItems.slice(0, 3);
    const displayHistory = historyItems.slice(0, 3);

    // 🚀 Fetch Managed Institutes (Only if user is a manager or admin)
    const managedInstitutes = (dbUser.role === 'INSTITUTE_MANAGER' || dbUser.role === 'ADMIN') 
        ? await prisma.instituteManager.findMany({
            where: { userId: dbUser.id },
            include: { institute: { select: { id: true, name: true, slug: true } } }
          })
        : [];

    return (
        <div className="container mx-auto py-10 px-4 max-w-4xl font-sans">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-8 tracking-tight">My Profile</h1>
            
            <div className="flex flex-col gap-8">
                {/* Personal Info Card */}
                <Card className="rounded-3xl border-slate-100 shadow-sm overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between bg-slate-50/50 border-b border-slate-100 pb-5">
                        <div className="flex items-center gap-3">
                            <CardTitle className="text-xl">Personal Information</CardTitle>
                                <Badge className={
                                    dbUser.role === 'ADMIN' ? 'bg-purple-600 hover:bg-purple-700' : 
                                    dbUser.role === 'SALES_MANAGER' ? 'bg-green-600 hover:bg-green-700' :
                                    dbUser.role === 'INSTITUTE_MANAGER' ? 'bg-blue-600 hover:bg-blue-700' : 
                                    'bg-amber-500 hover:bg-amber-600'
                                }>
                                    {dbUser.role === 'INSTITUTE_MANAGER' ? 'Institute Manager' : dbUser.role}
                                </Badge>
                        </div>
                        <LogoutButton />
                    </CardHeader>
                    <CardContent className="space-y-8 pt-8">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center text-2xl font-bold text-amber-600 shrink-0">
                                {dbUser.image ? (
                                    <Image src={dbUser.image} alt={dbUser.name || "User"} width={64} height={64} className="rounded-full border h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center rounded-full bg-amber-100 font-semibold text-amber-700">
                                        {dbUser.name?.charAt(0).toUpperCase() || "U"}
                                    </div>
                                )}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">{dbUser.name}</h2>
                                <p className="text-slate-500">{dbUser.email}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-slate-100">
                            <div>
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Member Since</label>
                                <p className="mt-1 font-medium text-slate-700">{format(new Date(dbUser.createdAt),"PPP")}</p>
                            </div>
                            <div>
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Account Status</label>
                                <div className="mt-1"><span className="inline-flex items-center gap-1.5 font-medium text-slate-700"><span className={`w-2 h-2 rounded-full ${dbUser.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>{dbUser.isActive ? "Active" : "Inactive"}</span></div>
                            </div>
                            <div>
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Verification</label>
                                <p className="mt-1 font-medium text-slate-700">{dbUser.emailVerified ? "Verified ✅" : "Pending ⏳"}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 🚀 NAYA CONDITIONAL SECTION: ADD LISTING PASS */}
                {dbUser.canAddInstitute && (
                    <Card className="rounded-3xl border-emerald-200 shadow-sm bg-linear-to-br from-emerald-50 via-white to-white overflow-hidden relative border-2 animate-in fade-in zoom-in-95 duration-300">
                        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-48 h-48 bg-emerald-400 rounded-full blur-[80px] opacity-15 pointer-events-none"></div>
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="p-2 bg-emerald-100 rounded-xl text-emerald-600 shadow-xs"><PlusCircle className="w-5 h-5" /></div>
                                <CardTitle className="text-xl text-emerald-950 font-bold">List Your Academy</CardTitle>
                            </div>
                            <CardDescription className="text-emerald-700 font-medium">
                                Admin has unlocked your specialized one-time pass to create an official institute listing.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
                            <div className="flex-1 w-full text-sm text-slate-600 leading-relaxed">
                                Fill out your setup details to deploy your dashboard profile. This form configuration automatically establishes your workspace backend once submitted.
                            </div>
                            <Button asChild className="w-full sm:w-auto gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md px-6 transition-all transform hover:-translate-y-0.5">
                                <Link href="/user/create-institute">
                                    Create Listing <ArrowRight className="w-4 h-4" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* MANAGER QUICK ACCESS CARD */}
                {managedInstitutes.length > 0 && (
                    <Card className="rounded-3xl border-blue-100 shadow-sm bg-linear-to-br from-blue-50/50 to-white overflow-hidden relative">
                        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-48 h-48 bg-blue-400 rounded-full blur-[80px] opacity-10 pointer-events-none"></div>
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-9 h-9 bg-blue-100 rounded-xl text-blue-600 flex items-center justify-center shadow-xs"><Building2 className="w-5 h-5" /></div>
                                <CardTitle className="text-xl">Manager Workspace</CardTitle>
                            </div>
                            <CardDescription>Quick access to the institutes you manage.</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
                            <div className="flex-1 w-full text-sm font-medium text-slate-700">
                                You currently manage <span className="font-bold text-blue-600">{managedInstitutes.length}</span> academy profile(s).
                            </div>
                            <Button asChild className="w-full sm:w-auto gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-sm">
                                <Link href="/manager">
                                    Go to Dashboard <ArrowRight className="w-4 h-4" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                 )} 

                {/* Grid sections for Shortlisted & History logs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* SHORTLISTED BOX */}
                    <Card className="rounded-3xl border-slate-100 shadow-sm flex flex-col justify-between">
                        <CardHeader className="border-b border-slate-50 pb-4">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-red-50 rounded-lg text-red-500"><Bookmark className="w-5 h-5" /></div>
                                <div>
                                    <CardTitle className="text-lg">Shortlisted</CardTitle>
                                    <CardDescription className="text-xs">Saved institutes</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-5 flex-1 flex flex-col justify-start">
                            {shortlistedItems.length === 0 ? (
                                <div className="py-8 text-center text-slate-400 text-sm">No saved institutes.</div>
                            ) : (
                                <div className="flex flex-col gap-3 w-full">
                                    {displayShortlist.map((item: any) => (
                                        <Link key={item.instituteId} href={`/institute/${item.institute.id}-${item.institute.slug}`} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-400 shrink-0 mt-1.5"></div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-slate-800 line-clamp-2 text-wrap leading-snug group-hover:text-amber-600 transition-colors">{item.institute.name}</p>
                                                <p className="text-xs text-slate-400 flex items-center gap-1 mt-1 truncate"><MapPin className="w-3 h-3 shrink-0"/>{item.institute.city.name}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                        {shortlistedItems.length > 3 && (
                            <div className="p-4 bg-slate-50/50 border-t border-slate-50 rounded-b-3xl">
                               <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="ghost" className="cursor-pointer w-full text-xs text-amber-600 font-semibold hover:bg-amber-50 rounded-xl justify-between">
                                            View All Saved ({shortlistedItems.length}) <ArrowRight className="w-4 h-4"/>
                                        </Button>
                                    </DialogTrigger>
                                    
                                    <DialogContent 
                                        className="p-5 bg-white border-slate-100 shadow-2xl outline-none"
                                        style={{ width: '92vw', maxWidth: '600px', borderRadius: '1.5rem', maxHeight: '85vh', overflowY: 'auto' }}
                                    >
                                        <DialogHeader className="text-left mb-2 pr-6">
                                            <DialogTitle className="text-xl font-bold text-slate-800">All Shortlisted Institutes</DialogTitle>
                                        </DialogHeader>
                                        <div className="flex flex-col gap-3">
                                            {shortlistedItems.map((item: any) => (
                                                <Link 
                                                    key={item.instituteId} 
                                                    href={`/institute/${item.institute.id}-${item.institute.slug}`} 
                                                    className="flex items-center justify-between gap-3 p-4 rounded-2xl border border-slate-100 hover:border-amber-200 hover:bg-amber-50/50 transition-all group"
                                                >
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-bold text-[15px] text-slate-800 line-clamp-2 text-wrap leading-snug group-hover:text-amber-600 transition-colors">
                                                            {item.institute.name}
                                                        </h4>
                                                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 truncate">
                                                            <MapPin className="w-3 h-3 shrink-0"/> {item.institute.city.name}
                                                        </p>
                                                    </div>
                                                    <div className="shrink-0 bg-amber-100/50 text-amber-700 px-4 py-2 rounded-full text-xs font-bold group-hover:bg-amber-200/50 transition-colors">
                                                        View
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        )}
                    </Card>

                    {/* RECENTLY VISITED BOX */}
                    <Card className="rounded-3xl border-slate-100 shadow-sm flex flex-col justify-between">
                        <CardHeader className="border-b border-slate-50 pb-4">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-blue-50 rounded-lg text-blue-500"><Clock className="w-5 h-5" /></div>
                                <div>
                                    <CardTitle className="text-lg">Recently Visited</CardTitle>
                                    <CardDescription className="text-xs">Last 20 views</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-5 flex-1 flex flex-col justify-start">
                            {historyItems.length === 0 ? (
                                <div className="py-8 text-center text-slate-400 text-sm">Browsing history is clear.</div>
                            ) : (
                                <div className="flex flex-col gap-3 w-full">
                                    {displayHistory.map((item: any) => (
                                        <Link key={item.id} href={`/institute/${item.institute.id}-${item.institute.slug}`} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group">
                                            <div className="w-2.5 h-2.5 rounded-full bg-blue-400 shrink-0 mt-1.5"></div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-slate-800 line-clamp-2 text-wrap leading-snug group-hover:text-blue-600 transition-colors">{item.institute.name}</p>
                                                <p className="text-xs text-slate-400 mt-1 truncate"><Clock className="w-3 h-3 inline-block mr-1 shrink-0"/>{format(new Date(item.viewedAt), "do MMM, h:mm a")}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                        {historyItems.length > 3 && (
                            <div className="p-4 bg-slate-50/50 border-t border-slate-50 rounded-b-3xl">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="ghost" className="cursor-pointer w-full text-xs text-slate-600 font-semibold hover:bg-slate-100 rounded-xl justify-between">
                                            View Browsing History ({historyItems.length}) <ArrowRight className="w-4 h-4"/>
                                        </Button>
                                    </DialogTrigger>
                                    
                                    <DialogContent 
                                        className="p-5 bg-white border-slate-100 shadow-2xl outline-none"
                                        style={{ width: '92vw', maxWidth: '600px', borderRadius: '1.5rem', maxHeight: '85vh', overflowY: 'auto' }}
                                    >
                                        <DialogHeader className="text-left mb-2 pr-6">
                                            <DialogTitle className="text-xl font-bold text-slate-800">Browsing History</DialogTitle>
                                        </DialogHeader>
                                        <div className="flex flex-col gap-3">
                                            {historyItems.map((item: any) => (
                                                <Link 
                                                    key={item.id} 
                                                    href={`/institute/${item.institute.id}-${item.institute.slug}`} 
                                                    className="flex items-center justify-between gap-3 p-4 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group"
                                                >
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-bold text-[15px] text-slate-800 line-clamp-2 text-wrap leading-snug group-hover:text-blue-600 transition-colors">
                                                            {item.institute.name}
                                                        </h4>
                                                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 truncate">
                                                            <Clock className="w-3 h-3 shrink-0"/> Visited: {format(new Date(item.viewedAt), "PPp")}
                                                        </p>
                                                    </div>
                                                    <div className="shrink-0 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-xs font-bold group-hover:bg-blue-100 transition-colors">
                                                        Visit
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        )}
                    </Card>

                </div>

                {/* 4. Contributions */}
                <Card className="rounded-3xl border-amber-100 shadow-sm bg-linear-to-br from-amber-50/50 to-white overflow-hidden relative">
                    <div className="absolute right-0 top-0 -mr-16 -mt-16 w-48 h-48 bg-amber-400 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
                    <CardHeader className="pb-2">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                            <div className="p-2 bg-amber-100 rounded-lg text-amber-600"><PenTool className="w-5 h-5" /></div>
                            <CardTitle className="text-xl">Your Contributions</CardTitle>
                            {dbUser.blogAuthorProfile?.username && (
                                <Button asChild size="sm" variant="outline" className="ml-auto rounded-full border-amber-200 bg-white text-amber-700 hover:bg-amber-50">
                                    <Link href={`/blog/author/${dbUser.blogAuthorProfile.username}`}>
                                        Author Profile
                                    </Link>
                                </Button>
                            )}
                        </div>
                        <CardDescription>Help other students by sharing your knowledge and experiences.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Link href="/blog/write" className="group p-4 rounded-2xl border border-slate-100 bg-white hover:border-amber-200 hover:shadow-md transition-all flex items-start gap-4">
                                <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors"><FileText className="w-5 h-5" /></div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-slate-800 text-sm flex items-center justify-between">Write a Blog <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-amber-500 transition-transform group-hover:translate-x-1" /></h4>
                                    <p className="text-xs text-slate-500 mt-1">Share tips, preparation strategies, or your success story.</p>
                                </div>
                            </Link>
                            <Link href="/blog/my-posts" className="group p-4 rounded-2xl border border-slate-100 bg-white hover:border-amber-200 hover:shadow-md transition-all flex items-start gap-4">
                                <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors"><FileText className="w-5 h-5" /></div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-slate-800 text-sm flex items-center justify-between">My Posts <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-amber-500 transition-transform group-hover:translate-x-1" /></h4>
                                    <p className="text-xs text-slate-500 mt-1">Track drafts, published posts, and everything you have saved.</p>
                                </div>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}