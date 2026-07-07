"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAuth } from "@/lib/auth/requireAuth";
import { handleMembershipApproval } from "@/lib/membership/handleApproval";
import { notifyUser } from "@/lib/notifications/notify";
import { prisma } from "@/lib/prisma";
import { creditWallet } from "@/lib/wallet/credit";
import { removeMembershipRecords } from "@/app/actions/membership";

async function requireAdmin() {
  const session = await requireAuth();
  if (session.user.role !== "ADMIN") throw new Error("Admin access required");
  return session;
}

export async function adminApproveMembership(membershipId: string) {
  const session = await requireAdmin();
  await handleMembershipApproval(membershipId, session.user.id);
  revalidatePath("/af-ass-manage/memberships");
  return { success: true };
}

export async function adminRejectMembership(
  membershipId: string,
  reason?: string,
) {
  await requireAdmin();
  const membership = await prisma.instituteMembership.update({
    where: { id: membershipId },
    data: { status: "REJECTED", isActive: false },
  });
  await notifyUser(
    membership.userId,
    "SYSTEM",
    "Membership request declined",
    reason,
    membershipId,
  );
  revalidatePath("/af-ass-manage/memberships");
  return { success: true };
}

export async function adminRemoveMembership(membershipId: string) {
  const session = await requireAdmin();
  await removeMembershipRecords(membershipId, session.user.id);
  revalidatePath("/af-ass-manage/memberships");
  return { success: true };
}

export async function resolveMessageReport(
  reportId: string,
  action: "DISMISS" | "DELETE" | "WARN",
) {
  const session = await requireAdmin();
  const report = await prisma.messageReport.findUnique({
    where: { id: reportId },
    include: { message: true },
  });
  if (!report) return { error: "Report not found." };

  if (action === "DELETE") {
    await creditWallet(report.reporterId, 3, "CONTENT_REPORT", "Report approved");

    await prisma.$transaction([
      prisma.message.update({
        where: { id: report.messageId },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
          deletedById: session.user.id,
          content: null,
        },
      }),
      prisma.messageReport.update({
        where: { id: reportId },
        data: {
          status: "ACTION_TAKEN",
          resolvedById: session.user.id,
          resolvedAt: new Date(),
        },
      }),
    ]);
  } else {
    await prisma.messageReport.update({
      where: { id: reportId },
      data: {
        status: action === "WARN" ? "ACTION_TAKEN" : "DISMISSED",
        resolvedById: session.user.id,
        resolvedAt: new Date(),
      },
    });
    if (action === "WARN") {
      await creditWallet(report.reporterId, 3, "CONTENT_REPORT", "Report approved");
      await notifyUser(
        report.message.senderId,
        "SYSTEM",
        "Community guidelines warning",
        "A message you sent was reported. Please review our community rules.",
        report.messageId,
      );
    }
  }
  revalidatePath("/af-ass-manage/chat");
  return { success: true };
}

export async function adjustWallet(formData: FormData) {
  await requireAdmin();
  const parsed = z
    .object({
      userId: z.string().cuid(),
      amount: z.coerce.number().int().refine((value) => value !== 0),
      reason: z.string().trim().min(3).max(300),
    })
    .safeParse({
      userId: formData.get("userId"),
      amount: formData.get("amount"),
      reason: formData.get("reason"),
    });
  if (!parsed.success) return { error: "Invalid adjustment." };
  const transaction = await creditWallet(
    parsed.data.userId,
    parsed.data.amount,
    "ADMIN",
    parsed.data.reason,
  );
  if (!transaction) return { error: "Adjustment failed." };
  revalidatePath("/af-ass-manage/wallets");
  return { success: true };
}
