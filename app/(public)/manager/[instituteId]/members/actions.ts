"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAuth } from "@/lib/auth/requireAuth";
import { getUserInstituteRole } from "@/lib/auth/getInstituteRole";
import { handleMembershipApproval } from "@/lib/membership/handleApproval";
import { notifyUser } from "@/lib/notifications/notify";
import { prisma } from "@/lib/prisma";

async function assertManagerAccess(userId: string, instituteId: string) {
  const role = await getUserInstituteRole(userId, instituteId);
  if (role !== "MANAGER" && role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
}

export async function approveMembership(membershipId: string) {
  const session = await requireAuth();
  const membership = await prisma.instituteMembership.findUniqueOrThrow({
    where: { id: membershipId },
    select: { instituteId: true, userId: true },
  });
  await assertManagerAccess(session.user.id, membership.instituteId);
  await handleMembershipApproval(membershipId, session.user.id);
  revalidatePath(`/manager/${membership.instituteId}/members`);
  return { success: true };
}

export async function rejectMembership(membershipId: string, reason?: string) {
  const session = await requireAuth();
  const membership = await prisma.instituteMembership.findUniqueOrThrow({
    where: { id: membershipId },
    select: { instituteId: true, userId: true, institute: { select: { name: true } } },
  });
  await assertManagerAccess(session.user.id, membership.instituteId);

  await prisma.instituteMembership.update({
    where: { id: membershipId },
    data: { status: "REJECTED", isActive: false },
  });

  await notifyUser(
    membership.userId,
    "SYSTEM",
    "Membership request declined",
    reason
      ? `Your request for ${membership.institute.name} was declined: ${reason}`
      : `Your request for ${membership.institute.name} was declined.`,
    membership.instituteId,
  );

  revalidatePath(`/manager/${membership.instituteId}/members`);
  return { success: true };
}

export async function removeMember(membershipId: string) {
  const session = await requireAuth();
  const membership = await prisma.instituteMembership.findUniqueOrThrow({
    where: { id: membershipId },
    select: { instituteId: true, userId: true, institute: { select: { name: true } } },
  });
  await assertManagerAccess(session.user.id, membership.instituteId);

  await prisma.instituteMembership.update({
    where: { id: membershipId },
    data: { status: "REMOVED", isActive: false },
  });

  await notifyUser(
    membership.userId,
    "SYSTEM",
    "Membership removed",
    `You have been removed from ${membership.institute.name}.`,
    membership.instituteId,
  );

  revalidatePath(`/manager/${membership.instituteId}/members`);
  return { success: true };
}

const updateStudentSchema = z.object({
  courseName: z.string().trim().max(120).optional(),
  batchYear: z.coerce.number().int().optional(),
  passoutYear: z.coerce.number().int().optional(),
  isVerified: z.coerce.boolean().optional(),
  bio: z.string().trim().max(500).optional(),
});

export async function updateStudentRecord(
  recordId: string,
  instituteId: string,
  data: unknown,
) {
  const session = await requireAuth();
  await assertManagerAccess(session.user.id, instituteId);
  const parsed = updateStudentSchema.parse(data);
  await prisma.studentInstituteRecord.update({
    where: { id: recordId },
    data: parsed,
  });
  revalidatePath(`/manager/${instituteId}/members`);
  return { success: true };
}

const updateTeacherSchema = z.object({
  designation: z.string().trim().max(120).optional(),
  department: z.string().trim().max(120).optional(),
  isFeatured: z.coerce.boolean().optional(),
  isVerified: z.coerce.boolean().optional(),
  bio: z.string().trim().max(500).optional(),
});

export async function updateTeacherRecord(
  recordId: string,
  instituteId: string,
  data: unknown,
) {
  const session = await requireAuth();
  await assertManagerAccess(session.user.id, instituteId);
  const parsed = updateTeacherSchema.parse(data);
  await prisma.teacherInstituteRecord.update({
    where: { id: recordId },
    data: parsed,
  });
  revalidatePath(`/manager/${instituteId}/members`);
  return { success: true };
}
