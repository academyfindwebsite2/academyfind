import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import MasterEditForm from "@/components/admin/AdminMasterEditForm";
import { ShieldCheck, Eye, Scale } from "lucide-react"; // 🆕 Icons import kiye

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
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
            include: { 
                categories: { select: { categoryId: true } }, 
                teacherRecords: {
                    include: {
                        membership: {
                            include: {
                                user: {
                                    select: { name: true, image: true, email: true }
                                }
                            }
                        }
                    }
                },
                managers: true,
                facilities: true,
                faqs: true,
                batches: true,
                achievements: true,
                notablepersons: true,
                operatingHours: true,       // 🔥 ZAROORI HAI
                highlightStats: true 
            }
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
            <Card className="bg-white border-stone-200 shadow-sm overflow-hidden">
                <CardHeader className="p-6 md:p-8 flex flex-col md:flex-row justify-between md:items-center gap-6">
                    <div>
                        <CardTitle className="text-3xl font-extrabold text-stone-900 flex items-center gap-2 tracking-tight">
                            <ShieldCheck className="w-8 h-8 text-stone-800" /> Master Configuration
                        </CardTitle>
                        <p className="text-stone-500 mt-2 text-lg">
                            Editing: <span className="font-bold text-stone-800">{institute.name}</span>
                        </p>
                    </div>

                    {/* ==========================================
                        🆕 ADMIN ANALYTICS QUICK STATS STRIP
                        ========================================== */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-3 bg-stone-50 border border-stone-200 text-stone-800 px-5 py-3 rounded-2xl shadow-sm">
                            <div className="bg-stone-200 p-2 rounded-xl">
                                <Eye className="w-5 h-5 text-stone-700" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 leading-none">Total Views</span>
                                <span className="font-black text-xl leading-none mt-1">{institute.viewCount.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 bg-stone-50 border border-stone-200 text-stone-800 px-5 py-3 rounded-2xl shadow-sm">
                            <div className="bg-stone-200 p-2 rounded-xl">
                                <Scale className="w-5 h-5 text-stone-700" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 leading-none">Compared</span>
                                <span className="font-black text-xl leading-none mt-1">{institute.compareCount.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </CardHeader>
            </Card>

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