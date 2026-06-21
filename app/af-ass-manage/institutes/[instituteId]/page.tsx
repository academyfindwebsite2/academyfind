import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import MasterEditForm from "@/components/admin/AdminMasterEditForm";
import { ShieldCheck, Eye, Scale } from "lucide-react"; // 🆕 Icons import kiye

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
            include: { categories: { select: { categoryId: true } }, teachers: true, managers: true,facilities: true,       // 🔥 ZAROORI HAI
                highlightStats: true }
        }),
        prisma.city.findMany({ orderBy: { name: 'asc' } }),
        prisma.category.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } })
    ]);

    if (!institute) redirect("/af-ass-manage/institutes");

    // Extract connected category IDs cleanly into plain string array
    const currentCategoryIds = institute.categories.map((c) => c.categoryId);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2 tracking-tight">
                            <ShieldCheck className="w-8 h-8 text-purple-600" /> Master Configuration
                        </h1>
                        <p className="text-slate-500 mt-1 text-lg">
                            Editing: <span className="font-bold text-slate-800">{institute.name}</span>
                        </p>
                    </div>

                    {/* ==========================================
                        🆕 ADMIN ANALYTICS QUICK STATS STRIP
                        ========================================== */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 px-4 py-2.5 rounded-xl shadow-sm">
                            <Eye className="w-5 h-5 text-blue-500" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500/80 leading-none">Total Views</span>
                                <span className="font-black text-lg leading-none">{institute.viewCount.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 text-amber-700 px-4 py-2.5 rounded-xl shadow-sm">
                            <Scale className="w-5 h-5 text-amber-500" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500/80 leading-none">Compared</span>
                                <span className="font-black text-lg leading-none">{institute.compareCount.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Master Edit Form */}
            <MasterEditForm 
                institute={institute} 
                allCities={allCities} 
                allCategories={allCategories}
                currentCategoryIds={currentCategoryIds}
            />
        </div>
    );
}