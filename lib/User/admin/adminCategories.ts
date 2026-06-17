"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

function generateSlug(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

export async function createCategory(formData: FormData) {
    try {
        const name = formData.get("name") as string;
        const parentId = formData.get("parentId") as string; // Optional hai

        if (!name) return { success: false, error: "Category name is required." };

        let slug = generateSlug(name);

        // 🚀 Duplicate Slug Handler: Agar same name ki category pehle se hai toh -1, -2 laga dega
        let existing = await prisma.category.findUnique({ where: { slug } });
        let counter = 1;
        while (existing) {
            slug = `${generateSlug(name)}-${counter}`;
            existing = await prisma.category.findUnique({ where: { slug } });
            counter++;
        }

        // 🚀 Hierarchy Level Check
        let level = 0;
        if (parentId) {
            const parent = await prisma.category.findUnique({ where: { id: parentId } });
            if (parent) level = parent.level + 1; // Parent se ek level niche
        }

        await prisma.category.create({
            data: {
                name,
                slug,
                level,
                parentId: parentId ? parentId : null,
                isActive: true
            }
        });

        revalidatePath("/af-ass-manage/categories");
        revalidatePath("/");
        
        return { success: true, message: `Category "${name}" created successfully!` };
    } catch (error) {
        console.error("Create Category Error:", error);
        return { success: false, error: "Failed to create category. Please try again." };
    }
}

export async function toggleCategoryStatus(categoryId: string, currentStatus: boolean) {
    try {
        await prisma.category.update({
            where: { id: categoryId },
            data: { isActive: !currentStatus }
        });
        
        // af-ass-manage page aur public category pages ko revalidate karo
        revalidatePath("/af-ass-manage/categories");
        revalidatePath("/"); // Agar navbar mein categories hain toh update ho jayengi
        
        return { success: true, message: `Category ${!currentStatus ? 'Visible' : 'Hidden'} successfully!` };
    } catch (error) {
        console.error("Category Toggle Error:", error);
        return { success: false, error: "Failed to update category status." };
    }
}