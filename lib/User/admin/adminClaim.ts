"use server"

import { prisma } from "../../prisma"
import { revalidatePath } from "next/cache"

export async function getInstituteClaims () {
    try{
        const claims = await prisma.instituteClaim.findMany({
            include:{
                user:{select:{name:true,email:true,phone:true}},
                institute:{select:{name:true,address:true,phone:true}}
            },
            orderBy:{createdAt:"desc"}
        })
        return {success: true, data: claims}
    }catch(err){
        console.error("Error fetching claims:", err)
        return {success:false,error: "Failed to fetch claims"}
    }
}

export async function updateClaimStatus(claimId: string, status: "APPROVED" | "REJECTED"){
    try {
        const claim = await prisma.instituteClaim.findUnique({
            where:{id: claimId}
        })

        if(!claim){
            return { success: false, error: "Claim not found" }
        }

        if(status === "REJECTED"){
            await prisma.instituteClaim.update({
                where:{id:claimId},
                data:{status: "REJECTED"}
            })
        }

        if(status === "APPROVED"){
            await prisma.$transaction([
                prisma.instituteClaim.update({
                    where: {id: claimId},
                    data:{status: "APPROVED"}
                }),

                prisma.user.update({
                    where:{id:claim.userId},
                    data: {role: "INSTITUTE_MANAGER"}
                }),

                prisma.instituteManager.upsert({
                    where:{
                        userId_instituteId:{
                            userId:claim.userId,
                            instituteId:claim.instituteId
                        }
                    },
                    update:{},
                    create:{
                        userId:claim.userId,
                        instituteId:claim.instituteId
                    }
                })
            ])
        }
        revalidatePath("/af-ass-manage/claims")
        return { success: true, message: `Claim ${status.toLowerCase()} successfully!` }
    }catch(err){
        console.error("Error fetching claims:", err)
        return { success: false, error: "Something went wrong" }    }
}