'use server';

import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
}

function stripInstitutePrefix(id: string) {
  return id.startsWith('inst-') ? id.slice('inst-'.length) : id;
}

export async function goToComparison(idA: string, idB: string) {
  if (!idA || !idB || idA === idB) return { error: "Please select two different institutes." };
   const cleanIdA = stripInstitutePrefix(idA);
  const cleanIdB = stripInstitutePrefix(idB);

  if (!cleanIdA || !cleanIdB || cleanIdA === cleanIdB) return;

  // Always stable alphabetical order for cache consistency
  const [institute1Id, institute2Id] = [cleanIdA, cleanIdB].sort();
  
  let redirectSlug = "";

  try {
    // 1. Check if comparison already exists
    let comparison = await prisma.instituteComparisonCache.findUnique({
      where: { institute1Id_institute2Id: { institute1Id, institute2Id } },
      select: { slug: true },
    });

    // 2. If not, generate a new one
    if (!comparison) {
      const [inst1, inst2] = await Promise.all([
        prisma.institute.findUnique({ where: { id: institute1Id }, select: { name: true } }),
        prisma.institute.findUnique({ where: { id: institute2Id }, select: { name: true } }),
      ]);

      // 🔥 FIX: Agar Meilisearch ki ID galat hai, toh yahan error throw hoga
      if (!inst1 || !inst2) {
        return { error: "One or both institutes are missing from the database. Please re-sync Meilisearch!" };
      }

      let slug = `${slugify(inst1.name)}-vs-${slugify(inst2.name)}`;

      // Collision check
      const existingSlug = await prisma.instituteComparisonCache.findUnique({ where: { slug } });
      if (existingSlug) slug = `${slug}-${institute1Id.slice(-5)}`;

      comparison = await prisma.instituteComparisonCache.create({
        data: { institute1Id, institute2Id, slug },
        select: { slug: true },
      });

      // Update compare counts
      await prisma.institute.updateMany({
        where: { id: { in: [institute1Id, institute2Id] } },
        data: { compareCount: { increment: 1 } },
      });
    }

    redirectSlug = comparison.slug;
  } catch (error) {
    console.error("Comparison DB Error:", error);
    return { error: "A database error occurred while creating the comparison." };
  }

  // 🔥 NEXT.JS RULE: redirect() hamesha try-catch ke bahar hona chahiye!
  redirect(`/compare/${redirectSlug}`);
}