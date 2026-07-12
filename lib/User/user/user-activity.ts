"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { triggerCRMWebhooks } from "@/lib/crm/webhooks";

export const trackVisitHistory = async (userId: string, instituteId: string) => {
  try {
    // Check agar ye institute pehle se history me hai
    const existingLog = await prisma.userHistory.findFirst({
      where: { userId, instituteId },
    });

    if (existingLog) {
      await prisma.userHistory.update({
        where: { id: existingLog.id },
        data: { viewedAt: new Date() },
      });
    } else {
      await prisma.userHistory.create({
        data: { userId, instituteId },
      });
      const totalLogs = await prisma.userHistory.findMany({
        where: { userId },
        orderBy: { viewedAt: "desc" },
      });

      if (totalLogs.length > 20) {
        const logsToDelete = totalLogs.slice(20); 
        const idsToDelete = logsToDelete.map((log: any) => log.id);
        
        await prisma.userHistory.deleteMany({
          where: { id: { in: idsToDelete } },
        });
      }
    }

    // Fire CRM Webhooks
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true, phone: true }
    });
    
    if (user) {
      triggerCRMWebhooks(instituteId, "USER_VISIT", {
        name: user.name,
        email: user.email,
        phone: user.phone,
        source: "AcademyFind Profile Visit (Logged In)",
      });
    }
  } catch (error) {
    console.error("Error tracking visit history:", error);
  }
};

export const toggleShortlist = async (userId: string, instituteId: string) => {
  try {
    const existing = await prisma.userShortlist.findUnique({
      where: { userId_instituteId: { userId, instituteId } },
    });

    if (existing) {
      await prisma.userShortlist.delete({
        where: { userId_instituteId: { userId, instituteId } },
      });
      return { success: true, status: "removed" };
    } else {
      await prisma.userShortlist.create({
        data: { userId, instituteId },
      });

      // Fire CRM Webhooks
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true, phone: true }
      });
      
      if (user) {
        triggerCRMWebhooks(instituteId, "USER_SAVE", {
          name: user.name,
          email: user.email,
          phone: user.phone,
          source: "AcademyFind Profile Saved (Warm Lead)",
        });
      }

      return { success: true, status: "added" };
    }
  } catch (error) {
    return { success: false, error: "Something went wrong" };
  }
};