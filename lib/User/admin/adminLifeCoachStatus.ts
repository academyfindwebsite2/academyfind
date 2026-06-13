// app/actions/life-coach.ts ke andar add karein
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateLifeCoachStatus(id: string, newStatus: "PENDING" | "CONTACTED" | "RESOLVED") {
    try {
        await prisma.lifeCoachRequest.update({
            where: { id },
            data: { status: newStatus }
        });
        
        revalidatePath("/admin/life-coach");
        revalidatePath(`/admin/life-coach/${id}`);
        return { success: true, message: "Status updated successfully!" };
    } catch (error) {
        console.error("Status Update Error:", error);
        return { success: false, error: "Failed to update status." };
    }
}