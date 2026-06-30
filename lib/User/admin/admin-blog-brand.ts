"use server";

import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { z } from "zod";

import { getCachedSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

const brandSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(2).max(100),
  slug: z.string().trim().max(120),
  bio: z.string().trim().max(1000),
  avatarUrl: z.union([z.literal(""), z.url()]),
});

async function isAdmin() {
  const session = await getCachedSession();
  return session?.user?.role === "ADMIN";
}

export async function saveBlogBrand(input: z.input<typeof brandSchema>) {
  if (!(await isAdmin())) {
    return { success: false, error: "Administrator access is required." };
  }

  const parsed = brandSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Check the brand details.",
    };
  }

  const value = parsed.data;
  const slug = slugify(value.slug || value.name, {
    lower: true,
    strict: true,
    trim: true,
  });
  if (!slug) return { success: false, error: "Enter a valid brand slug." };

  const duplicate = await prisma.blogBrand.findFirst({
    where: {
      OR: [{ name: value.name }, { slug }],
      ...(value.id ? { id: { not: value.id } } : {}),
    },
    select: { id: true },
  });
  if (duplicate) {
    return { success: false, error: "That brand name or slug already exists." };
  }

  try {
    const data = {
      name: value.name,
      slug,
      bio: value.bio || null,
      avatarUrl: value.avatarUrl || null,
    };

    const brand = value.id
      ? await prisma.blogBrand.update({
          where: { id: value.id },
          data,
          select: { id: true },
        })
      : await prisma.blogBrand.create({
          data,
          select: { id: true },
        });

    revalidatePath("/af-ass-manage/blog");
    revalidatePath("/af-ass-manage/blog/brands");
    return { success: true, id: brand.id };
  } catch {
    return { success: false, error: "Unable to save this brand." };
  }
}

export async function toggleBlogBrand(brandId: string, isActive: boolean) {
  if (!(await isAdmin())) {
    return { success: false, error: "Administrator access is required." };
  }

  try {
    await prisma.blogBrand.update({
      where: { id: brandId },
      data: { isActive },
    });
    revalidatePath("/af-ass-manage/blog/brands");
    return { success: true };
  } catch {
    return { success: false, error: "Unable to update this brand." };
  }
}
