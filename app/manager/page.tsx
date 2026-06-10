import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { ArrowRight, Badge, Building2, MapPin } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";

export default async function ManagerRootPage(){
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if(!session){
        toast.error("You are not logged in");
        redirect('/login');
    }

    if(session.user.role !== "INSTITUTE_MANAGER"){
        toast.error("You are not an institute manager, log in with an authorized id or become one")
        redirect('/');
    }

    const managedInstitutes = await prisma.instituteManager.findMany({
        where:{
            userId: session.user.id
        },
        include:{
            institute:{
                include:{
                    city:true,
                    categories: true,
                }
            }
        }
    })

    if(managedInstitutes.length === 0){
        return (
            <div className="min-h-[60vh] flex items-center justify-center p-4">
                <Card className="max-w-md w-full text-center p-6 border-dashed shadow-sm">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center max-auto mb-4">
                        <Building2 className="w-8 h-8 text-slate-400"/>
                    </div>
                        <CardTitle className="mb-2">No Claimed Institutes</CardTitle>
                        <CardDescription className="mb-6">
                            You do not have manager access to any institutes yet. If you recently claimed a profile, please wait for admin approval.
                        </CardDescription>
                        <Link href="/" className="text-blue-600 font-medium hover:underline text-sm">
                        Return to Homepage
                    </Link>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto max-w-5xl py-12 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Select Workspace</h1>
                <p className="text-slate-500 mt-2">You manage multiple academies. Choose one to view its dashboard.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {managedInstitutes.map(({ institute: institute }) => (
                    <Link key={institute.id} href={`/manager/${institute.id}/profile`}>
                        <Card className="h-full rounded-2xl border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group">
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start gap-4">
                                    <CardTitle className="text-lg leading-tight group-hover:text-blue-700 transition-colors">
                                        {institute.name}
                                    </CardTitle>
                                    <Badge className="bg-slate-50 uppercase text-[10px] tracking-wider shrink-0">
                                        {institute.subscriptionPlan}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center text-xs text-slate-500 mb-4">
                                    <MapPin className="w-3.5 h-3.5 mr-1" />
                                    {institute.city.name}
                                </div>
                                <div className="flex items-center text-sm font-semibold text-blue-600">
                                    Manage Profile <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );


}