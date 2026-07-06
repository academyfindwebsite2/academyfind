"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import type { InstituteMemberRole } from "@/app/generated/prisma/client";
import { requireAuth } from "@/lib/auth/requireAuth";
import { handleMembershipApproval } from "@/lib/membership/handleApproval";
import { notifyAdmins, notifyUser } from "@/lib/notifications/notify";
import { prisma } from "@/lib/prisma";

const studentJoinSchema = z.object({
  instituteId: z.string().cuid(),
  courseName: z.string().trim().min(2).max(120),
  batchYear: z.coerce.number().int().min(1950).max(2100).nullable(),
  passoutYear: z.coerce.number().int().min(1950).max(2100).nullable(),
  bio: z.string().trim().max(1000).nullable(),
  isVisible: z.boolean(),
  allowMessaging: z.boolean(),
});

const teacherJoinSchema = z.object({
  instituteId: z.string().cuid(),
  designation: z.string().trim().min(2).max(120),
  department: z.string().trim().max(120).nullable(),
  teachingSubjects: z.array(z.string().trim().min(1).max(60)).min(1).max(30),
  bio: z.string().trim().max(1000).nullable(),
});

async function notifyManagers(
  instituteId: string,
  instituteName: string,
  userName: string,
  membershipId: string,
) {
  const managers = await prisma.instituteManager.findMany({
    where: { instituteId },
    select: { userId: true },
  });
  await Promise.all([
    ...managers.map(({ userId }: { userId: string }) =>
      notifyUser(
        userId,
        "SYSTEM",
        "New membership request",
        `${userName} requested to join ${instituteName}.`,
        membershipId,
      ),
    ),
    notifyAdmins(
      "MEMBERSHIP_REQUEST",
      "New membership request",
      `${userName} requested to join ${instituteName}.`,
      "/af-ass-manage/memberships",
      membershipId,
    ),
  ]);
}

export async function requestStudentJoin(
  input: z.input<typeof studentJoinSchema>,
) {
  const session = await requireAuth();
  const data = studentJoinSchema.parse(input);

  const institute = await prisma.institute.findUnique({
    where: { id: data.instituteId },
    select: { name: true, slug: true },
  });
  if (!institute) return { error: "Institute not found." };

  const existing = await prisma.instituteMembership.findUnique({
    where: {
      userId_instituteId_role: {
        userId: session.user.id,
        instituteId: data.instituteId,
        role: "STUDENT",
      },
    },
  });
  if (existing && !["REJECTED", "REMOVED"].includes(existing.status)) {
    return { error: "A student membership already exists." };
  }

  const membership = await prisma.$transaction(async (tx) => {
    const profile = await tx.studentProfile.upsert({
      where: { userId: session.user.id },
      create: { userId: session.user.id },
      update: {},
    });
    const created = existing
      ? await tx.instituteMembership.update({
          where: { id: existing.id },
          data: { status: "PENDING", isActive: true, leftAt: null },
        })
      : await tx.instituteMembership.create({
          data: {
            userId: session.user.id,
            instituteId: data.instituteId,
            role: "STUDENT",
          },
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
        bio: data.bio,
        isVisible: data.isVisible,
        allowMessaging: data.allowMessaging,
      },
      update: {
        courseName: data.courseName,
        batchYear: data.batchYear,
        passoutYear: data.passoutYear,
        bio: data.bio,
        isVisible: data.isVisible,
        allowMessaging: data.allowMessaging,
        isVerified: false,
      },
    });
    return created;
  });

  await notifyManagers(
    data.instituteId,
    institute.name,
    session.user.name ?? session.user.email,
    membership.id,
  );
  revalidatePath(`/institute/${institute.slug}`);
  return { success: true };
}

export async function requestTeacherJoin(
  input: z.input<typeof teacherJoinSchema>,
) {
  const session = await requireAuth();
  const data = teacherJoinSchema.parse(input);
  const institute = await prisma.institute.findUnique({
    where: { id: data.instituteId },
    select: { name: true, slug: true },
  });
  if (!institute) return { error: "Institute not found." };

  const existing = await prisma.instituteMembership.findUnique({
    where: {
      userId_instituteId_role: {
        userId: session.user.id,
        instituteId: data.instituteId,
        role: "TEACHER",
      },
    },
  });
  if (existing && !["REJECTED", "REMOVED"].includes(existing.status)) {
    return { error: "A teacher membership already exists." };
  }

  const membership = await prisma.$transaction(async (tx) => {
    const profile = await tx.teacherProfile.upsert({
      where: { userId: session.user.id },
      create: { userId: session.user.id },
      update: {},
    });
    const created = existing
      ? await tx.instituteMembership.update({
          where: { id: existing.id },
          data: { status: "PENDING", isActive: true, leftAt: null },
        })
      : await tx.instituteMembership.create({
          data: {
            userId: session.user.id,
            instituteId: data.instituteId,
            role: "TEACHER",
          },
        });
    await tx.teacherInstituteRecord.upsert({
      where: { membershipId: created.id },
      create: {
        membershipId: created.id,
        teacherProfileId: profile.id,
        instituteId: data.instituteId,
        designation: data.designation,
        department: data.department,
        teachingSubjects: data.teachingSubjects,
        bio: data.bio,
      },
      update: {
        designation: data.designation,
        department: data.department,
        teachingSubjects: data.teachingSubjects,
        bio: data.bio,
        isVerified: false,
      },
    });
    return created;
  });

  await notifyManagers(
    data.instituteId,
    institute.name,
    session.user.name ?? session.user.email,
    membership.id,
  );
  revalidatePath(`/institute/${institute.slug}`);
  return { success: true };
}

export async function cancelJoinRequest(membershipId: string) {
  const session = await requireAuth();
  const result = await prisma.instituteMembership.updateMany({
    where: { id: membershipId, userId: session.user.id, status: "PENDING" },
    data: { status: "REJECTED", isActive: false },
  });
  if (result.count === 0) return { error: "Request could not be cancelled." };
  revalidatePath("/settings/profile");
  return { success: true };
}

export async function respondToInvite(
  membershipId: string,
  accept: boolean,
) {
  const session = await requireAuth();
  const membership = await prisma.instituteMembership.findFirst({
    where: { id: membershipId, userId: session.user.id, status: "PENDING" },
  });
  if (!membership) return { error: "Invitation not found." };

  if (!accept) {
    await prisma.instituteMembership.update({
      where: { id: membershipId },
      data: { status: "REJECTED", isActive: false },
    });
    return { success: true };
  }

  const manager = await prisma.instituteManager.findFirst({
    where: { instituteId: membership.instituteId },
    select: { userId: true },
  });
  if (!manager) return { error: "Institute manager not found." };
  await handleMembershipApproval(membershipId, manager.userId);
  return { success: true };
}

export async function removeMembershipRecords(
  membershipId: string,
  actorId: string,
) {
  const membership = await prisma.instituteMembership.findUnique({
    where: { id: membershipId },
  });
  if (!membership) throw new Error("Membership not found");

  await prisma.$transaction([
    prisma.instituteMembership.update({
      where: { id: membershipId },
      data: {
        status: "REMOVED",
        isActive: false,
        leftAt: new Date(),
      },
    }),
    prisma.conversationParticipant.updateMany({
      where: {
        userId: membership.userId,
        conversation: { instituteId: membership.instituteId },
      },
      data: { status: "DELETED", leftAt: new Date(), isHidden: true },
    }),
  ]);

  await notifyUser(
    membership.userId,
    "SYSTEM",
    "Institute membership removed",
    "Your institute membership has been removed.",
    membershipId,
  );
  void actorId;
}

export type JoinRole = Extract<InstituteMemberRole, "STUDENT" | "TEACHER">;
