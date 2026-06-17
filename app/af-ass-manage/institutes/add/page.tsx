import { prisma } from "@/lib/prisma";
import AddInstituteForm from "@/components/admin/AddInstituteForm";
import { Building2 } from "lucide-react";

export default async function AdminAddInstitutePage() {
    // Fetch all required data for the form
    const [allCities, allCategories] = await Promise.all([
        prisma.city.findMany({ orderBy: { name: 'asc' } }),
        prisma.category.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } })
    ]);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
                    <Building2 className="w-8 h-8 text-purple-600" /> Create New Academy
                </h1>
                <p className="text-slate-500 mt-1">
                    Fill in all the details below. You can use Google Places API to quickly fetch accurate coordinates and addresses.
                </p>
            </div>

            <AddInstituteForm 
                allCities={allCities} 
                allCategories={allCategories}
            />
        </div>
    );
}