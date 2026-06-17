import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import MasterEditForm from "@/components/admin/AdminMasterEditForm";
import { ShieldCheck } from "lucide-react";

export default async function AdminMasterInstituteEditorPage({
    params
}: {
    params: Promise<{ instituteId: string }>
}) {
    const { instituteId } = await params;

    // Parallel promise collection standard handling mapping
    const [institute, allCities, allCategories] = await Promise.all([
        prisma.institute.findUnique({
            where: { id: instituteId },
            include: { categories: { select: { categoryId: true } }, teachers: true, managers: true }
        }),
        prisma.city.findMany({ orderBy: { name: 'asc' } }),
        prisma.category.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } })
    ]);

    if (!institute) redirect("/af-ass-manage/institutes");

    // Extract connected category IDs cleanly into plain string array
    const currentCategoryIds = institute.categories.map((c) => c.categoryId);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2 tracking-tight">
                    <ShieldCheck className="w-8 h-8 text-purple-600" /> Master Institute Configuration
                </h1>
                <p className="text-slate-500 mt-1">
                    System administrative parameters override controller for: <span className="font-bold text-slate-700">{institute.name}</span>
                </p>
            </div>

            <MasterEditForm 
                institute={institute} 
                allCities={allCities} 
                allCategories={allCategories}
                currentCategoryIds={currentCategoryIds}
            />
        </div>
    );
}