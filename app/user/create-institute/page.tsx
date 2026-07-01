import CreateInstituteForm from "@/components/User/CreateInstitute";
import ClaimForm from "@/components/institute/ClaimForm";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "List Your Institute | AcademyFind",
  robots: {
    index: false,
    follow: false,
  },
};

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
        // 1. Fetch the absolute latest request without filtering by status
        const latestReq = await prisma.instituteRequest.findFirst({
            where: {
                userId: user.id,
            },
            orderBy: { createdAt: "desc" }
        });

        // ❌ 2. Handle REJECTED State
        if (latestReq?.status === "REJECTED") {
            return (
                <div className="container mx-auto py-10 px-4 space-y-8 font-sans">
                    <div className="flex flex-col items-center justify-center text-center p-8 bg-red-50 border-2 border-red-200 rounded-3xl max-w-2xl mx-auto shadow-sm">
                        <h1 className="text-2xl font-bold text-red-700 mb-2">Institute Request Rejected</h1>
                        <p className="text-red-600 mb-6 font-medium">
                            Unfortunately, your previous submission did not meet our guidelines and was not approved by the admin team.
                        </p>
                        <p className="text-sm text-slate-500">
                            Please contact support for more details or if you believe this was a mistake.
                        </p>
                    </div>
                </div>
            );
        }

        // 🕒 3. Handle PENDING State
        if (latestReq?.status === "PENDING") {
            const latestInstitute = await prisma.institute.findUnique({
                where: { id: latestReq.instituteId },
                select: { id: true, name: true }
            });

            return (
                <div className="container mx-auto py-10 px-4 space-y-8 font-sans">
                    <div className="flex flex-col items-center justify-center text-center p-4">
                        <h1 className="text-2xl font-bold text-slate-800">Your Institute Is Under Review</h1>
                        <p className="text-slate-500 mt-2 max-w-2xl">
                            You have already submitted a request to add an institute. Until admin approves it, complete the claim form here so ownership details stay attached to the same institute request.
                        </p>
                    </div>

                    {latestInstitute ? (
                        <ClaimForm
                            instituteId={latestInstitute.id}
                            instituteName={latestInstitute.name}
                            userId={user.id}
                        />
                    ) : (
                        <div className="text-center p-4 text-slate-500">Loading institute details...</div>
                    )}
                </div>
            );
        }

        // 🔒 4. Fallback (If canAddInstitute is false but no recent request exists)
        return (
            <div className="container mx-auto py-10 px-4 font-sans">
                <div className="flex flex-col items-center justify-center text-center p-8 bg-slate-50 border rounded-3xl max-w-2xl mx-auto">
                    <h2 className="text-xl font-bold text-slate-800">Action Restricted</h2>
                    <p className="text-slate-500 mt-2">You currently do not have permission to add a new institute.</p>
                </div>
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