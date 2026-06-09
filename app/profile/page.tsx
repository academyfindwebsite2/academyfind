import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import LogoutButton from "@/components/layout/LogOut"
import { Bookmark, Clock, PenTool, ArrowRight, FileText, Scale, MapPin } from "lucide-react";
// 👇 Shadcn Dialog component for Popups
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default async function ProfilePage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) redirect('/login');
    const { user } = session;

    // 🚀 Fetch Shortlisted Institutes (Sirf top 3 profile par dikhane ke liye)
    const shortlistedItems = await prisma.userShortlist.findMany({
        where: { userId: user.id },
        include: { institute: { include: { city: true } } },
        orderBy: { createdAt: "desc" }
    });

    // 🚀 Fetch Visit History (Last 20 entries)
    const historyItems = await prisma.userHistory.findMany({
        where: { userId: user.id },
        include: { institute: { include: { city: true } } },
        orderBy: { viewedAt: "desc" }
    });

    const displayShortlist = shortlistedItems.slice(0, 3); // 3 items preview
    const displayHistory = historyItems.slice(0, 3);       // 3 items preview

    return (
        <div className="container mx-auto py-10 px-4 max-w-4xl font-sans">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-8 tracking-tight">My Profile</h1>
            
            <div className="flex flex-col gap-8">
                {/* Personal Info Card (Aapka dynamic design same rahega) */}
                <Card className="rounded-3xl border-slate-100 shadow-sm overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between bg-slate-50/50 border-b border-slate-100 pb-5">
                        <div className="flex items-center gap-3">
                            <CardTitle className="text-xl">Personal Information</CardTitle>
                            <Badge className={user.role === 'ADMIN' ? 'bg-green-500 hover:bg-green-600' : 'bg-amber-500 hover:bg-amber-600'}>
                                {user.role}
                            </Badge>
                        </div>
                        <LogoutButton />
                    </CardHeader>
                    <CardContent className="space-y-8 pt-8">
                        <div className="flex items-center gap-6">
                            <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center text-2xl font-bold text-amber-600 shrink-0">
                                {user.image ? (
                                    <Image src={user.image} alt={user.name || "User"} width={64} height={64} className="rounded-full border h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center rounded-full bg-amber-100 font-semibold text-amber-700">
                                        {user.name?.charAt(0).toUpperCase() || "U"}
                                    </div>
                                )}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">{user.name}</h2>
                                <p className="text-slate-500">{user.email}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-slate-100">
                            <div>
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Phone</label>
                                <p className="mt-1 font-medium text-slate-700">{user.phone || "Not Added"}</p>
                            </div>
                            <div>
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Member Since</label>
                                <p className="mt-1 font-medium text-slate-700">{format(new Date(user.createdAt),"PPP")}</p>
                            </div>
                            <div>
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Account Status</label>
                                <div className="mt-1"><span className="inline-flex items-center gap-1.5 font-medium text-slate-700"><span className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>{user.isActive ? "Active" : "Inactive"}</span></div>
                            </div>
                            <div>
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Verification</label>
                                <p className="mt-1 font-medium text-slate-700">{user.emailVerified ? "Verified ✅" : "Pending ⏳"}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 2 & 3. Grid sections for Shortlisted & History logs */}
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
                                <div className="space-y-3 w-full">
                                    {displayShortlist.map((item: any) => (
                                        <Link key={item.instituteId} href={`/institute/${item.institute.id}-${item.institute.slug}`} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                                            <div className="flex-1 overflow-hidden">
                                                <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-amber-600 transition-colors">{item.institute.name}</p>
                                                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3"/>{item.institute.city.name}</p>
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
                                    <DialogContent className="w-[95vw] sm:max-w-xl rounded-3xl max-h-[85vh] overflow-y-auto p-4 sm:p-6 border-slate-100">
                                        <DialogHeader className="mb-2 pr-8 text-left"> {/* pr-8 for close button space */}
                                            <DialogTitle className="text-lg sm:text-xl font-bold text-slate-800">All Shortlisted Institutes</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-3 mt-2">
                                            {shortlistedItems.map((item: any) => (
                                                <Link 
                                                    key={item.instituteId} 
                                                    href={`/institute/${item.institute.id}-${item.institute.slug}`} 
                                                    className="flex items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl border border-slate-100 hover:border-amber-200 hover:shadow-md hover:bg-amber-50/30 transition-all group"
                                                >
                                                    <div className="flex flex-col min-w-0 flex-1">
                                                        {/* truncate ki jagah line-clamp-2 lagaya mobile ke liye */}
                                                        <p className="font-bold text-sm sm:text-[15px] text-slate-800 line-clamp-2 sm:truncate group-hover:text-amber-600 transition-colors leading-tight">
                                                            {item.institute.name}
                                                        </p>
                                                        <p className="text-[11px] sm:text-xs text-slate-500 mt-1 sm:mt-1.5 flex items-center gap-1.5 truncate">
                                                            <MapPin className="w-3 h-3 shrink-0"/> {item.institute.city.name}
                                                        </p>
                                                    </div>
                                                    
                                                    {/* Button shrink kiya mobile ke liye */}
                                                    <div className="shrink-0 bg-amber-50 text-amber-600 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-[11px] sm:text-xs font-semibold group-hover:bg-amber-100 transition-colors">
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
                                <div className="space-y-3 w-full">
                                    {displayHistory.map((item: any) => (
                                        <Link key={item.id} href={`/institute/${item.institute.id}-${item.institute.slug}`} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group">
                                            <div className="w-2.5 h-2.5 rounded-full bg-blue-400"></div>
                                            <div className="flex-1 overflow-hidden">
                                                <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-amber-600 transition-colors">{item.institute.name}</p>
                                                <p className="text-xs text-slate-400 mt-0.5">{format(new Date(item.viewedAt), "do MMM, h:mm a")}</p>
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
                                    <DialogContent className="w-[95vw] sm:max-w-xl rounded-3xl max-h-[85vh] overflow-y-auto p-4 sm:p-6 border-slate-100">
                                        <DialogHeader className="mb-2 pr-8 text-left">
                                            <DialogTitle className="text-lg sm:text-xl font-bold text-slate-800">Browsing History</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-3 mt-2">
                                            {historyItems.map((item: any) => (
                                                <Link 
                                                    key={item.id} 
                                                    href={`/institute/${item.institute.id}-${item.institute.slug}`} 
                                                    className="flex items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-md hover:bg-blue-50/20 transition-all group"
                                                >
                                                    <div className="flex flex-col min-w-0 flex-1">
                                                        {/* truncate ki jagah line-clamp-2 lagaya mobile ke liye */}
                                                        <p className="font-bold text-sm sm:text-[15px] text-slate-800 line-clamp-2 sm:truncate group-hover:text-blue-600 transition-colors leading-tight">
                                                            {item.institute.name}
                                                        </p>
                                                        <p className="text-[11px] sm:text-xs text-slate-500 mt-1 sm:mt-1.5 flex items-center gap-1.5 truncate">
                                                            <Clock className="w-3 h-3 shrink-0"/> Visited: {format(new Date(item.viewedAt), "PPp")}
                                                        </p>
                                                    </div>
                                                    
                                                    {/* Button shrink kiya mobile ke liye */}
                                                    <div className="shrink-0 bg-slate-100 text-slate-600 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-[11px] sm:text-xs font-semibold group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
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

                {/* 4. Contributions (Submit Blog / Comparison - Same as your premium panel) */}
                <Card className="rounded-3xl border-amber-100 shadow-sm bg-gradient-to-br from-amber-50/50 to-white overflow-hidden relative">
                    <div className="absolute right-0 top-0 -mr-16 -mt-16 w-48 h-48 bg-amber-400 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
                    <CardHeader className="pb-2">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="p-2 bg-amber-100 rounded-lg text-amber-600"><PenTool className="w-5 h-5" /></div>
                            <CardTitle className="text-xl">Your Contributions</CardTitle>
                        </div>
                        <CardDescription>Help other students by sharing your knowledge and experiences.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Link href="/blog/submit" className="group p-4 rounded-2xl border border-slate-100 bg-white hover:border-amber-200 hover:shadow-md transition-all flex items-start gap-4">
                                <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors"><FileText className="w-5 h-5" /></div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-slate-800 text-sm flex items-center justify-between">Write a Blog <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-amber-500 transition-transform group-hover:translate-x-1" /></h4>
                                    <p className="text-xs text-slate-500 mt-1">Share tips, preparation strategies, or your success story.</p>
                                </div>
                            </Link>
                            <Link href="/compare/submit" className="group p-4 rounded-2xl border border-slate-100 bg-white hover:border-amber-200 hover:shadow-md transition-all flex items-start gap-4">
                                <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors"><Scale className="w-5 h-5" /></div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-slate-800 text-sm flex items-center justify-between">Compare Institutes <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-amber-500 transition-transform group-hover:translate-x-1" /></h4>
                                    <p className="text-xs text-slate-500 mt-1">Help students decide between two top coaching centers.</p>
                                </div>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}