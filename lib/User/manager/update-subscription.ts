"use server"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function updateInstitutePlan(instituteId: string, selectedPlan: "BASIC" | "PREMIUM" | "ULTRA") {
  try {
    // 1. Pehle check karo ki jo user change kar raha hai, kya wo sach mein iska manager hai?
    // (Ye validation auth session se user ID nikal kar hogi, abhi ke liye simple check:)
    
    const planWeights = { "ULTRA": 4, "PREMIUM": 3, "VERIFIED": 2, "BASIC": 1 };
    
    const updatedInstitute = await prisma.institute.update({
      where: { id: instituteId },
      data: { 
        subscriptionPlan: selectedPlan,
        planWeight: planWeights[selectedPlan] || 1
      }
    })

    const { syncSingleInstituteToMeili } = await import("@/scripts/SyncInstitute");
    await syncSingleInstituteToMeili(instituteId);

    

    revalidatePath(`/manager/${instituteId}`)
    return { 
      success: true, 
      message: `Aapka institute successfully ${selectedPlan} plan par upgrade ho gaya hai!` 
    }

  } catch (error) {
    console.error(error)
    return { success: false, error: "Plan update karne mein error aaya." }
  }
}