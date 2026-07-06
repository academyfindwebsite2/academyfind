"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAuth } from "@/lib/auth/requireAuth";
import { handleMembershipApproval } from "@/lib/membership/handleApproval";
import { notifyUser } from "@/lib/notifications/notify";
import { prisma } from "@/lib/prisma";
import { removeMembershipRecords } from "@/app/actions/membership";

async function requireManager(userId: string, instituteId: string) {
  const manager = await prisma.instituteManager.findUnique({
    where: { userId_instituteId: { userId, instituteId } },
  });
  if (!manager) throw new Error("Manager access required");
}

export async function approveMembership(membershipId: string) {
  const session = await requireAuth();
  const membership = await prisma.instituteMembership.findUnique({
    where: { id: membershipId },
  });
  if (!membership) return { error: "Membership not found." };
  await requireManager(session.user.id, membership.instituteId);
  await handleMembershipApproval(membershipId, session.user.id);
  revalidatePath(`/manager/${membership.instituteId}/members`);
  return { success: true };
}

export async function rejectMembership(
  membershipId: string,
  reason?: string,
) {
  const session = await requireAuth();
  const membership = await prisma.instituteMembership.findUnique({
    where: { id: membershipId },
    include: { institute: { select: { name: true } } },
  });
  if (!membership) return { error: "Membership not found." };
  await requireManager(session.user.id, membership.instituteId);
  await prisma.instituteMembership.update({
    where: { id: membershipId },
    data: { status: "REJECTED", isActive: false },
  });
  await notifyUser(
    membership.userId,
    "SYSTEM",
    "Membership request declined",
    reason
      ? `${membership.institute.name}: ${reason}`
      : `${membership.institute.name} declined your request.`,
    membershipId,
  );
  revalidatePath(`/manager/${membership.instituteId}/members`);
  return { success: true };
}

export async function removeMember(membershipId: string) {
  const session = await requireAuth();
  const membership = await prisma.instituteMembership.findUnique({
    where: { id: membershipId },
  });
  if (!membership) return { error: "Membership not found." };
  await requireManager(session.user.id, membership.instituteId);
  await removeMembershipRecords(membershipId, session.user.id);
  revalidatePath(`/manager/${membership.instituteId}/members`);
  return { success: true };
}

const inviteSchema = z.discriminatedUnion("role", [
  z.object({
    instituteId: z.string().cuid(),
    userId: z.string().cuid(),
    role: z.literal("STUDENT"),
    courseName: z.string().trim().min(2).max(120),
    batchYear: z.number().int().min(1950).max(2100).nullable(),
    passoutYear: z.number().int().min(1950).max(2100).nullable(),
  }),
  z.object({
    instituteId: z.string().cuid(),
    userId: z.string().cuid(),
    role: z.literal("TEACHER"),
    designation: z.string().trim().min(2).max(120),
    teachingSubjects: z.array(z.string().trim().min(1)).min(1).max(30),
  }),
]);

export async function inviteUser(input: z.input<typeof inviteSchema>) {
  const session = await requireAuth();
  const data = inviteSchema.parse(input);
  await requireManager(session.user.id, data.instituteId);

  const existing = await prisma.instituteMembership.findUnique({
    where: {
      userId_instituteId_role: {
        userId: data.userId,
        instituteId: data.instituteId,
        role: data.role,
      },
    },
  });
  if (existing && !["REJECTED", "REMOVED"].includes(existing.status)) {
    return { error: "This membership already exists." };
  }

  const membership = await prisma.$transaction(async (tx) => {
    const created = existing
      ? await tx.instituteMembership.update({
          where: { id: existing.id },
          data: { status: "PENDING", isActive: true },
        })
      : await tx.instituteMembership.create({
          data: {
            userId: data.userId,
            instituteId: data.instituteId,
            role: data.role,
          },
        });

    if (data.role === "STUDENT") {
      const profile = await tx.studentProfile.upsert({
        where: { userId: data.userId },
        create: { userId: data.userId },
        update: {},
      });
      await tx.studentInstituteRecord.upsert({
        where: { membershipId: created.id },
        create: {
          membershipId: created.id,
          studentProfileId: profile.id,
          instituteId: data.instituteId,
          courseName: data.courseName,
          batchYear: data.batchYear,
          passoutYear: data.passoutYear,
        },
        update: {
          courseName: data.courseName,
          batchYear: data.batchYear,
          passoutYear: data.passoutYear,
        },
      });
    } else {
      const profile = await tx.teacherProfile.upsert({
        where: { userId: data.userId },
        create: { userId: data.userId },
        update: {},
      });
      await tx.teacherInstituteRecord.upsert({
        where: { membershipId: created.id },
        create: {
          membershipId: created.id,
          teacherProfileId: profile.id,
          instituteId: data.instituteId,
          designation: data.designation,
          teachingSubjects: data.teachingSubjects,
        },
        update: {
          designation: data.designation,
          teachingSubjects: data.teachingSubjects,
        },
      });
    }
    return created;
  });

  await notifyUser(
    data.userId,
    "SYSTEM",
    "Institute invitation",
    `You were invited to join an institute as a ${data.role.toLowerCase()}.`,
    membership.id,
  );
  revalidatePath(`/manager/${data.instituteId}/members`);
  return { success: true };
}

export async function updateBatchSeats(batchId: string, seatsLeft: number) {
  const session = await requireAuth();
  const batch = await prisma.instituteBatch.findUnique({
    where: { id: batchId },
    select: { instituteId: true, seatsTotal: true },
  });
  if (!batch) return { error: "Batch not found." };
  await requireManager(session.user.id, batch.instituteId);
  if (
    !Number.isInteger(seatsLeft) ||
    seatsLeft < 0 ||
    (batch.seatsTotal !== null && seatsLeft > batch.seatsTotal)
  ) {
    return { error: "Invalid seat count." };
  }
  await prisma.instituteBatch.update({
    where: { id: batchId },
    data: { seatsLeft },
  });
  revalidatePath(`/manager/${batch.instituteId}/batches`);
  return { success: true };
}

export async function createBatch(formData: FormData) {
  const session = await requireAuth();
  const schema = z.object({
    instituteId: z.string().cuid(),
    name: z.string().trim().min(2).max(120),
    courseName: z.string().trim().max(120).nullable(),
    mode: z.enum(["OFFLINE", "ONLINE", "HYBRID"]),
    timing: z.string().trim().max(120).nullable(),
    seatsTotal: z.coerce.number().int().positive().nullable(),
    fee: z.coerce.number().int().nonnegative().nullable(),
    startDate: z.coerce.date().nullable(),
    endDate: z.coerce.date().nullable(),
  });
  const nullable = (name: string) => {
    const value = String(formData.get(name) ?? "").trim();
    return value || null;
  };
  const data = schema.parse({
    instituteId: formData.get("instituteId"),
    name: formData.get("name"),
    courseName: nullable("courseName"),
    mode: formData.get("mode"),
    timing: nullable("timing"),
    seatsTotal: nullable("seatsTotal"),
    fee: nullable("fee"),
    startDate: nullable("startDate"),
    endDate: nullable("endDate"),
  });
  await requireManager(session.user.id, data.instituteId);
  await prisma.instituteBatch.create({
    data: { ...data, seatsLeft: data.seatsTotal },
  });
  revalidatePath(`/manager/${data.instituteId}/batches`);
  return { success: true };
}
