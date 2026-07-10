"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAuth } from "@/lib/auth/requireAuth";
import { getUserInstituteRole } from "@/lib/auth/getInstituteRole";
import { prisma } from "@/lib/prisma";

async function assertManagerAccess(userId: string, instituteId: string) {
  const role = await getUserInstituteRole(userId, instituteId);
  if (role !== "MANAGER" && role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
}

const batchSchema = z.object({
  name: z.string().trim().min(1).max(120),
  courseName: z.string().trim().max(120).optional(),
  description: z.string().trim().max(500).optional(),
  mode: z.enum(["ONLINE", "OFFLINE", "HYBRID"]).default("OFFLINE"),
  duration: z.string().trim().max(60).optional(),
  timing: z.string().trim().max(60).optional(),
  fee: z.coerce.number().int().positive().optional(),
  originalFee: z.coerce.number().int().positive().optional(),
  seatsTotal: z.coerce.number().int().positive().optional(),
  seatsLeft: z.coerce.number().int().min(0).optional(),
  batchType: z.string().trim().max(60).optional(),
  academicYear: z.string().trim().max(20).optional(),
});

export async function createBatch(instituteId: string, formData: FormData): Promise<void> {
  const session = await requireAuth();
  await assertManagerAccess(session.user.id, instituteId);

  const parsed = batchSchema.safeParse({
    name: formData.get("name"),
    courseName: formData.get("courseName") || undefined,
    description: formData.get("description") || undefined,
    mode: formData.get("mode") || "OFFLINE",
    duration: formData.get("duration") || undefined,
    timing: formData.get("timing") || undefined,
    fee: formData.get("fee") || undefined,
    originalFee: formData.get("originalFee") || undefined,
    seatsTotal: formData.get("seatsTotal") || undefined,
    seatsLeft: formData.get("seatsLeft") || undefined,
    batchType: formData.get("batchType") || undefined,
    academicYear: formData.get("academicYear") || undefined,
  });

  if (!parsed.success) return;

  await prisma.instituteBatch.create({
    data: { instituteId, ...parsed.data },
  });

  revalidatePath(`/manager/${instituteId}/batches`);
}

export async function updateBatch(
  batchId: string,
  instituteId: string,
  formData: FormData,
) {
  const session = await requireAuth();
  await assertManagerAccess(session.user.id, instituteId);

  const parsed = batchSchema.partial().safeParse({
    name: formData.get("name") || undefined,
    courseName: formData.get("courseName") || undefined,
    description: formData.get("description") || undefined,
    mode: formData.get("mode") || undefined,
    duration: formData.get("duration") || undefined,
    timing: formData.get("timing") || undefined,
    fee: formData.get("fee") || undefined,
    seatsTotal: formData.get("seatsTotal") || undefined,
    seatsLeft: formData.get("seatsLeft") || undefined,
    isActive: formData.get("isActive") === "true",
  });

  if (!parsed.success) {
    return { success: false, message: "Invalid batch data." };
  }

  await prisma.instituteBatch.update({
    where: { id: batchId },
    data: parsed.data,
  });

  revalidatePath(`/manager/${instituteId}/batches`);
  revalidatePath(`/manager/${instituteId}/batches/${batchId}`);
  
  return { success: true };
}

export async function toggleBatchActive(
  batchId: string,
  instituteId: string,
  isActive: boolean,
) {
  const session = await requireAuth();
  await assertManagerAccess(session.user.id, instituteId);
  await prisma.instituteBatch.update({
    where: { id: batchId },
    data: { isActive },
  });
  revalidatePath(`/manager/${instituteId}/batches`);
}

export async function addBatchStudent(instituteId: string, batchId: string, studentRecordId: string) {
  const session = await requireAuth();
  await assertManagerAccess(session.user.id, instituteId);
  await prisma.batchStudent.create({
    data: { batchId, studentRecordId }
  });

  const batch = await prisma.instituteBatch.findUnique({ where: { id: batchId } });
  const studentRecord = await prisma.studentInstituteRecord.findUnique({ where: { id: studentRecordId }, include: { studentProfile: true } });
  if (batch && studentRecord?.studentProfile?.userId) {
    const { ensureBatchConversation } = await import("@/lib/chat/ensureBatchConversation");
    const conv = await ensureBatchConversation(instituteId, batchId, batch.name);
    await prisma.conversationParticipant.upsert({
      where: { conversationId_userId: { conversationId: conv.id, userId: studentRecord.studentProfile.userId } },
      create: { conversationId: conv.id, userId: studentRecord.studentProfile.userId, role: "MEMBER" },
      update: { status: "ACTIVE", leftAt: null, isHidden: false },
    });
  }

  revalidatePath(`/manager/${instituteId}/batches/${batchId}`);
}

export async function removeBatchStudent(instituteId: string, batchStudentId: string) {
  const session = await requireAuth();
  await assertManagerAccess(session.user.id, instituteId);
  
  const batchStudent = await prisma.batchStudent.findUnique({
    where: { id: batchStudentId },
    include: { studentRecord: { include: { studentProfile: true } } }
  });

  await prisma.batchStudent.delete({
    where: { id: batchStudentId }
  });

  if (batchStudent?.batchId && batchStudent.studentRecord?.studentProfile?.userId) {
    const conv = await prisma.conversation.findFirst({ where: { batchId: batchStudent.batchId, type: "BATCH" } });
    if (conv) {
      await prisma.conversationParticipant.deleteMany({
        where: { conversationId: conv.id, userId: batchStudent.studentRecord.studentProfile.userId }
      });
    }
  }
}

export async function addBatchTeacher(instituteId: string, batchId: string, teacherRecordId: string) {
  const session = await requireAuth();
  await assertManagerAccess(session.user.id, instituteId);
  await prisma.batchTeacher.create({
    data: { batchId, teacherRecordId }
  });

  const batch = await prisma.instituteBatch.findUnique({ where: { id: batchId } });
  const teacherRecord = await prisma.teacherInstituteRecord.findUnique({ where: { id: teacherRecordId }, include: { teacherProfile: true } });
  if (batch && teacherRecord?.teacherProfile?.userId) {
    const { ensureBatchConversation } = await import("@/lib/chat/ensureBatchConversation");
    const conv = await ensureBatchConversation(instituteId, batchId, batch.name);
    await prisma.conversationParticipant.upsert({
      where: { conversationId_userId: { conversationId: conv.id, userId: teacherRecord.teacherProfile.userId } },
      create: { conversationId: conv.id, userId: teacherRecord.teacherProfile.userId, role: "ADMIN" },
      update: { status: "ACTIVE", leftAt: null, isHidden: false },
    });
  }

  revalidatePath(`/manager/${instituteId}/batches/${batchId}`);
}

export async function removeBatchTeacher(instituteId: string, batchTeacherId: string) {
  const session = await requireAuth();
  await assertManagerAccess(session.user.id, instituteId);
  
  const batchTeacher = await prisma.batchTeacher.findUnique({
    where: { id: batchTeacherId },
    include: { teacherRecord: { include: { teacherProfile: true } } }
  });

  await prisma.batchTeacher.delete({
    where: { id: batchTeacherId }
  });

  if (batchTeacher?.batchId && batchTeacher.teacherRecord?.teacherProfile?.userId) {
    const conv = await prisma.conversation.findFirst({ where: { batchId: batchTeacher.batchId, type: "BATCH" } });
    if (conv) {
      await prisma.conversationParticipant.deleteMany({
        where: { conversationId: conv.id, userId: batchTeacher.teacherRecord.teacherProfile.userId }
      });
    }
  }
}
