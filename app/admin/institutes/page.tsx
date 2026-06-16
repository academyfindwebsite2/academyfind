import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Building2, Edit, MapPin, Plus } from "lucide-react"
import ToggleStatusButton from "@/components/admin/AdminToggleButton"
import InstituteFilters from "@/components/admin/AdminInstituteFilters"
import InstitutePagination from "@/components/admin/AdminInstitutePagination"

export default async function AdminInstitutesPage({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    // 1. Await Next.js 15 searchParams
    const params = await searchParams;
    
    const page = Number(params.page) || 1;
    const limit = 50; // Ek baar me sirf 50 load honge
    const search = typeof params.search === 'string' ? params.search : '';
    const cityId = typeof params.cityId === 'string' ? params.cityId : '';
    const categoryId = typeof params.categoryId === 'string' ? params.categoryId : '';

    // 2. Dynamic Prisma Filters Build Karna
    const whereCondition: any = {};

    if (search) {
        whereCondition.name = { contains: search, mode: 'insensitive' };
    }
    if (cityId) {
        whereCondition.cityId = cityId;
    }
    if (categoryId) {
        // Relation table filter for Categories
        whereCondition.categories = {
            some: { categoryId: categoryId }
        };
    }

    // 3. Parallel Database Queries (Boht Fast 🚀)
    const [totalInstitutes, institutes, cities, categories] = await Promise.all([
        // Count for pagination
        prisma.institute.count({ where: whereCondition }),
        
        // Fetch strictly 50 records based on page
        prisma.institute.findMany({
            where: whereCondition,
            take: limit,
            skip: (page - 1) * limit,
            include: {
                city: true,
                _count: { select: { managers: true } }
            },
            orderBy: { createdAt: 'desc' }
        }),

        // Fetch Dropdown lists
        prisma.city.findMany({ orderBy: { name: 'asc' } }),
        prisma.category.findMany({ orderBy: { name: 'asc' } })
    ]);

    const totalPages = Math.ceil(totalInstitutes / limit);

    return (
        <div className="space-y-4 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
                        <Building2 className="w-8 h-8 text-purple-600" /> All Institutes
                    </h1>
                    <p className="text-slate-500 mt-1">Found {totalInstitutes} matching institutes.</p>
                </div>
            </div>

            <div className="shrink-0">
                <Link 
                    href="/admin/institutes/add"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition shadow-sm"
                >
                    <Plus className="w-4 h-4" /> Add Academy Profile
                </Link>
            </div>

            {/* 🚀 Filter Component Inserted Here */}
            <InstituteFilters cities={cities} categories={categories} />

            {/* Data Table */}
            <div className="bg-white border border-slate-200 rounded-t-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                            <tr>
                                <th className="p-4">Academy Details</th>
                                <th className="p-4">Location</th>
                                <th className="p-4 text-center">Plan & Managers</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {institutes.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-400">No institutes match your filters.</td>
                                </tr>
                            ) : (
                                institutes.map((institute: any) => (
                                    <tr key={institute.id} className={`hover:bg-slate-50/50 transition-colors ${!institute.isActive ? 'opacity-60 grayscale-[0.5]' : ''}`}>
                                        <td className="p-4">
                                            <div className="font-bold text-slate-800 text-base">{institute.name}</div>
                                            <div className="text-xs text-slate-500 mt-0.5">{institute.email || "No Email"}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                                                <MapPin className="w-4 h-4 text-slate-400" /> {institute.city.name}
                                            </div>
                                        </td>
                                        <td className="p-4 text-center space-y-2">
                                            <span className="inline-block bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest">
                                                {institute.subscriptionPlan}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <ToggleStatusButton instituteId={institute.id} isActive={institute.isActive} />
                                        </td>
                                        <td className="p-4 text-right">
                                            <Link 
                                                href={`/admin/institutes/${institute.id}`}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-700 rounded-lg text-xs font-bold transition-all"
                                            >
                                                <Edit className="w-3.5 h-3.5" /> Master Edit
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 🚀 Pagination Component Inserted Here */}
            <InstitutePagination totalPages={totalPages} currentPage={page} />

        </div>
    )
}