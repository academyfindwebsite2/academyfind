"use server"
import { headers } from 'next/headers';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth/auth';

export async function trackInstituteView(instituteId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  const today = new Date().toISOString().split('T')[0]; // "2026-06-20"

  if (session?.user) {
    // ===== LOGGED IN: per-user history upsert + counter increment =====
    await prisma.$transaction([
      prisma.userHistory.upsert({
        where: { userId_instituteId: { userId: session.user.id, instituteId } },
        update: { viewedAt: new Date() },
        create: { userId: session.user.id, instituteId },
      }),
      prisma.institute.update({
        where: { id: instituteId },
        data: { viewCount: { increment: 1 } },
      }),
      prisma.instituteDailyView.upsert({
        where: { instituteId_date: { instituteId, date: new Date(today) } },
        update: { viewCount: { increment: 1 } },
        create: { instituteId, date: new Date(today), viewCount: 1 },
      }),
    ]);
    return;
  }

  // ===== LOGGED OUT: cookie-based dedup, fir counter increment =====
  const cookieStore = await cookies();
  const cookieKey = `viewed_${instituteId}`;

  if (cookieStore.get(cookieKey)) return; // isi visitor ne already aaj count kara hai, skip

  await prisma.$transaction([
    prisma.institute.update({
      where: { id: instituteId },
      data: { viewCount: { increment: 1 } },
    }),
    prisma.instituteDailyView.upsert({
      where: { instituteId_date: { instituteId, date: new Date(today) } },
      update: { viewCount: { increment: 1 } },
      create: { instituteId, date: new Date(today), viewCount: 1 },
    }),
  ]);

  cookieStore.set(cookieKey, '1', { maxAge: 60 * 60 * 12 }); // 12hr ke liye dedup
}