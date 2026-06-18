// app/actions/team.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addTeamMember(instituteId: string, email: string) {
    try {
        // ... (Step 1, 2, 3 wahi purane wale rahenge) ...
        const institute = await prisma.institute.findUnique({
            where: { id: instituteId },
            include: { managers: true }
        });
        if (!institute) return { error: "Institute not found!" };

        const plan = institute.subscriptionPlan || "BASIC"; 
        let maxAllowed = 1;
        if (plan === "PREMIUM") maxAllowed = 3;
        if (plan === "ULTRA") maxAllowed = 5;

        if (institute.managers.length >= maxAllowed) {
            return { error: `Your ${plan} plan only allows up to ${maxAllowed} team members.` };
        }

        const userToAdd = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        });
        if (!userToAdd) return { error: "No user found with this email on AcademyFind." };

        const alreadyManager = institute.managers.find(m => m.userId === userToAdd.id);
        if (alreadyManager) return { error: "This user is already a team member!" };

        // 👇 STEP 4: YAHAN MAGIC HOGA (Transaction)
        // Hum dono database updates ek sath karenge
        await prisma.$transaction([
            // Pehla kaam: InstituteManager table me entry banana
            prisma.instituteManager.create({
                data: {
                    instituteId: instituteId,
                    userId: userToAdd.id,
                }
            }),
            // Dusra kaam: User ka role upgrade karna
            prisma.user.update({
                where: { id: userToAdd.id },
                // Note: Aapke schema me jo role ka exact naam ho wahi likhna (e.g., 'MANAGER' ya 'INSTITUTE_MANAGER')
                data: { role: "INSTITUTE_MANAGER" } 
            })
        ]);

        // UI ko refresh karne ke liye
        revalidatePath(`/institute/${instituteId}/team`); 
        return { success: true };

    } catch (error) {
        console.error(error);
        return { error: "Something went wrong!" };
    }
}