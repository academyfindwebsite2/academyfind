"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getInstitutePlan(instituteId: string) {
  try {
    const institute = await prisma.institute.findUnique({
      where: { id: instituteId },
      select: { subscriptionPlan: true },
    });
    return institute?.subscriptionPlan || "BASIC";
  } catch (error) {
    console.error("Error fetching institute plan:", error);
    return "BASIC";
  }
}

export async function getIntegrations(instituteId: string) {
  try {
    const integrations = await prisma.cRMIntegration.findMany({
      where: {
        instituteId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return integrations;
  } catch (error) {
    console.error("Error fetching integrations:", error);
    return [];
  }
}

export async function createIntegration(data: {
  instituteId: string;
  provider: any;
  webhookUrl: string;
  sendEnquiries: boolean;
  sendUserSaves: boolean;
  sendUserVisits: boolean;
}) {
  try {
    await prisma.cRMIntegration.create({
      data: {
        instituteId: data.instituteId,
        provider: data.provider,
        webhookUrl: data.webhookUrl,
        sendEnquiries: data.sendEnquiries,
        sendUserSaves: data.sendUserSaves,
        sendUserVisits: data.sendUserVisits,
        isActive: true,
      },
    });

    revalidatePath(`/manager/${data.instituteId}/integrations`);
    return { success: true };
  } catch (error: any) {
    console.error("Error creating integration:", error);
    return { success: false, error: error.message };
  }
}

export async function updateIntegration(integrationId: string, instituteId: string, data: any) {
  try {
    await prisma.cRMIntegration.update({
      where: { id: integrationId },
      data: {
        provider: data.provider,
        webhookUrl: data.webhookUrl,
        sendEnquiries: data.sendEnquiries,
        sendUserSaves: data.sendUserSaves,
        sendUserVisits: data.sendUserVisits,
      },
    });
    revalidatePath(`/manager/${instituteId}/integrations`);
    return { success: true };
  } catch (error: any) {
    console.error("Error updating integration:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteIntegration(integrationId: string, instituteId: string) {
  try {
    await prisma.cRMIntegration.delete({
      where: { id: integrationId },
    });
    revalidatePath(`/manager/${instituteId}/integrations`);
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting integration:", error);
    return { success: false, error: error.message };
  }
}

export async function toggleIntegration(integrationId: string, isActive: boolean, instituteId: string) {
  try {
    await prisma.cRMIntegration.update({
      where: { id: integrationId },
      data: { isActive },
    });
    revalidatePath(`/manager/${instituteId}/integrations`);
    return { success: true };
  } catch (error: any) {
    console.error("Error toggling integration:", error);
    return { success: false, error: error.message };
  }
}
