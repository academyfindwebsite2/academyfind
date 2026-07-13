"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/getSession";
import { EducationType, SkillLevel } from "@/app/generated/prisma/client";

async function verifyAuth() {
  const session = await getSession();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user;
}

// ========================
// EDUCATION
// ========================
export async function addEducation(data: {
  type: EducationType;
  institutionName: string;
  courseOrClass: string;
  startDate?: Date;
  endDate?: Date;
  score?: string;
}) {
  const user = await verifyAuth();
  await prisma.userEducation.create({
    data: { ...data, userId: user.id },
  });
  revalidatePath(`/u/${user.username}`);
  return { success: true };
}

export async function deleteEducation(id: string) {
  const user = await verifyAuth();
  await prisma.userEducation.delete({
    where: { id, userId: user.id },
  });
  revalidatePath(`/u/${user.username}`);
  return { success: true };
}

// ========================
// EXPERIENCE
// ========================
export async function addExperience(data: {
  company: string;
  role: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
}) {
  const user = await verifyAuth();
  await prisma.userExperience.create({
    data: { ...data, userId: user.id },
  });
  revalidatePath(`/u/${user.username}`);
  return { success: true };
}

export async function deleteExperience(id: string) {
  const user = await verifyAuth();
  await prisma.userExperience.delete({
    where: { id, userId: user.id },
  });
  revalidatePath(`/u/${user.username}`);
  return { success: true };
}

// ========================
// ACHIEVEMENT
// ========================
export async function addAchievement(data: {
  title: string;
  description?: string;
  date?: Date;
}) {
  const user = await verifyAuth();
  await prisma.userAchievement.create({
    data: { ...data, userId: user.id },
  });
  revalidatePath(`/u/${user.username}`);
  return { success: true };
}

export async function deleteAchievement(id: string) {
  const user = await verifyAuth();
  await prisma.userAchievement.delete({
    where: { id, userId: user.id },
  });
  revalidatePath(`/u/${user.username}`);
  return { success: true };
}

// ========================
// SKILL
// ========================
export async function addSkill(data: { name: string; level: SkillLevel }) {
  const user = await verifyAuth();
  await prisma.userSkill.create({
    data: { ...data, userId: user.id },
  });
  revalidatePath(`/u/${user.username}`);
  return { success: true };
}

export async function deleteSkill(id: string) {
  const user = await verifyAuth();
  await prisma.userSkill.delete({
    where: { id, userId: user.id },
  });
  revalidatePath(`/u/${user.username}`);
  return { success: true };
}
