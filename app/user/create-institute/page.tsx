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
        const latestReq = await prisma.instituteRequest.findFirst({
            where:{
                userId: user.id,
                status: "PENDING",
            },
            orderBy:{createdAt: "desc"}
        })

        const latestInstitute = latestReq
            ? await prisma.institute.findUnique({
                where: { id: latestReq.instituteId },
                select: { id: true, name: true }
            })
            : null;

        return (
            <div className="container mx-auto py-10 px-4 space-y-8">
                <div className="flex flex-col items-center justify-center text-center p-4">
                    <h1 className="text-2xl font-bold text-slate-800">Your Institute Is Under Review</h1>
                    <p className="text-slate-500 mt-2 max-w-2xl">
                        You have already submitted a request to add an institute. Until admin approves it, complete the claim form here so ownership details stay attached to the same institute request.
                    </p>
                </div>

                {latestReq && latestInstitute ? (
                    <ClaimForm
                        instituteId={latestInstitute.id}
                        instituteName={latestInstitute.name}
                        userId={user.id}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center min-h-[40vh] text-center p-4">
                        <h2 className="text-xl font-semibold text-slate-700">Request Received</h2>
                        <p className="text-slate-500 mt-2">Please wait while AcademyFind reviews your institute request.</p>
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