"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitStudentEnquiry(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const message = formData.get("message") as string;
    const instituteId = formData.get("instituteId") as string;
    const email = formData.get("email") as string | null;

    await prisma.instituteEnquiry.create({
      data: {
        name,
        phone,
        message,
        instituteId,
        email: email || null,
        status: "NEW",
      },
    });

    const institute = await prisma.institute.findUnique({
      where: { id: instituteId },
      select: { name: true },
    });

    await prisma.adminNotification.create({
      data: {
        type: "NEW_INSTITUTE_ENQUIRY",
        title: "New Institute Enquiry",
        message: `${name} (${phone}) sent an enquiry for institute ID: ${instituteId}. and name ${institute?.name}`,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Enquiry Error:", error);
    return { success: false, error: "Something went wrong" };
  }
}