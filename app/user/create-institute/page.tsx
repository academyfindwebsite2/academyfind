import CreateInstituteForm from "@/components/User/CreateInstitute";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

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

    if (!user?.canAddInstitute) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
                <h1 className="text-2xl font-bold text-slate-800">Access Restricted</h1>
                <p className="text-slate-500 mt-2">You don't have permission to add an institute. Please contact AcademyFind support.</p>
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