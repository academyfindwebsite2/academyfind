import { prisma } from "@/lib/prisma"
import { FolderTree, Plus, Tag } from "lucide-react"
import CategoryFilters from "@/components/admin/AdminCategoryFilters"
import CategoryTreeView from "@/components/admin/AdminCategoryTreeView"
import CategoryStatusToggle from "@/components/admin/AdminCategoryStatusToggle"
import AddCategoryModal from "@/components/admin/AddCategoryModal"

export default async function AdminCategoriesPage({
    searchParams
}: {
    searchParams: Promise<{ search?: string }>
}) {
    const params = await searchParams;
    const search = params.search || "";

    // 1. Fetch ALL Categories
    const categories = await prisma.category.findMany({
        include: {
            parent: { select: { name: true } },
            _count: { select: { institutes: true } }
        },
        orderBy: [
            { level: 'asc' },
            { name: 'asc' }
        ]
    });

    // 2. SEARCH LOGIC (Flat View)
    let searchResults: typeof categories = [];
    if (search) {
        searchResults = categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
    }

    // 3. TREE BUILDER LOGIC (Nested View)
    const categoryMap = new Map();
    categories.forEach(c => categoryMap.set(c.id, { ...c, children: [] }));
    const categoryTree: any[] = [];
    
    categories.forEach(c => {
        if (c.parentId) {
            categoryMap.get(c.parentId)?.children.push(categoryMap.get(c.id));
        } else {
            categoryTree.push(categoryMap.get(c.id));
        }
    });

    return (
        <div className="space-y-4 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
                        <FolderTree className="w-8 h-8 text-indigo-600" /> Category Tree
                    </h1>
                    <p className="text-slate-500 mt-1">Organize your platform's hierarchy and mappings.</p>
                </div>
                <div className="flex items-center gap-3">
                    
                        <AddCategoryModal categories={categories} />
                
                </div>
            </div>

            {/* Filter Search Bar */}
            <CategoryFilters />

            {/* Main Content Area */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                
                {/* SCENARIO A: Search Results (Flat Table List) */}
                {search ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-indigo-50 text-indigo-800 font-semibold border-b border-indigo-100">
                                <tr>
                                    <th className="p-4">Search Results for "{search}"</th>
                                    <th className="p-4">Hierarchy Path</th>
                                    <th className="p-4 text-center">Listed</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {searchResults.length === 0 ? (
                                    <tr><td colSpan={4} className="p-8 text-center text-slate-400">No categories found matching "{search}".</td></tr>
                                ) : (
                                    searchResults.map((cat) => (
                                        <tr key={cat.id} className="hover:bg-slate-50">
                                            <td className="p-4 font-bold text-slate-800 flex items-center gap-2">
                                                <Tag className="w-4 h-4 text-indigo-400" /> {cat.name}
                                            </td>
                                            <td className="p-4 text-xs text-slate-500 font-medium">
                                                {cat.parent?.name ? `${cat.parent.name} > ${cat.name}` : 'Main Category'}
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className="bg-slate-100 px-2 py-1 rounded-full text-xs font-bold">{cat._count.institutes}</span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <CategoryStatusToggle categoryId={cat.id} isActive={cat.isActive} />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    
                    // SCENARIO B: No Search -> Beautiful Tree View
                    <div className="flex flex-col w-full">
                        <div className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 p-3 px-4 text-sm flex justify-between">
                            <span>Category Structure</span>
                            <span>Controls</span>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {categoryTree.map(rootCat => (
                                <CategoryTreeView key={rootCat.id} category={rootCat} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}