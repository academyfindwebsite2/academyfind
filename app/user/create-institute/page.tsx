import CreateInstituteForm from "@/components/User/CreateInstitute";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function UserCreateInstitutePage() {
    // 1. Session check karo
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) redirect('/login');

    // 2. Permission check (Kya Admin ne access diya hai?)
    const user = await prisma.user.findUnique({
        where: { id: session.user.id }
    });

    if(!user)
        redirect('/login')

    if (!user?.canAddInstitute) {
        const latestReq = await prisma.instituteRequest.findFirst({
            where:{
                userId: user.id,
                status: "PENDING",
            },
            orderBy:{createdAt: "desc"}
        })

        let needClaim = false;
        if(latestReq){
            const existingClaim = await prisma.instituteClaim.findFirst({
                where:{
                    userId: user.id,
                    instituteId: latestReq.instituteId
                }
            })
            if(!existingClaim){
                needClaim = true;
            }
        }
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
                <h1 className="text-2xl font-bold text-slate-800">Wait Until Admin Approves</h1>
                <p className="text-slate-500 mt-2">You have already submitted a request to add an institute. Please wait for AcademyFind support.</p>
                
                {/* Agar Claim pending hai, toh ye UI dikhega */}
                {needClaim && latestReq && (
                    <div className="mt-8 p-6 bg-amber-50 border border-amber-200 rounded-2xl max-w-md shadow-sm">
                        <h3 className="font-bold text-amber-900 mb-2 text-lg">⚠️ Incomplete Step Detected</h3>
                        <p className="text-sm text-amber-700 mb-5">
                            We noticed you created the institute profile but haven't provided your ownership/contact details yet. 
                        </p>
                        <Link 
                            href={`/user/create-institute/${latestReq.instituteId}/claim`}
                            className="inline-block w-full px-6 py-3.5 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-all shadow-md shadow-amber-500/20"
                        >
                            Complete Claim Step &rarr;
                        </Link>
                    </div>
                )}
            </div>
        );
    }

    // 3. Dropdowns ke liye data fetch karo
    const allCities = await prisma.city.findMany({ orderBy: { name: 'asc' } });
    const allCategories = await prisma.category.findMany({ orderBy: { name: 'asc' } });

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-8">List Your Institute</h1>
            <CreateInstituteForm 
                userId={user.id} 
                allCities={allCities} 
                allCategories={allCategories} 
            />
        </div>
    );
}