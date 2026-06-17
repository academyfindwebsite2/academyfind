"use server";

import { JobApplicationStatus } from "@/app/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Slug generator helper
function generateSlug(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

export async function createJobPosting(formData: FormData) {
    try {
        const title = formData.get("title") as string;
        let slug = generateSlug(title);
        
        // Ensure unique slug
        let existing = await prisma.jobPosting.findUnique({ where: { slug } });
        let counter = 1;
        while (existing) {
            slug = `${generateSlug(title)}-${counter}`;
            existing = await prisma.jobPosting.findUnique({ where: { slug } });
            counter++;
        }

        await prisma.jobPosting.create({
            data: {
                title,
                slug,
                department: formData.get("department") as string,
                location: formData.get("location") as string,
                type: formData.get("type") as string,
                experience: (formData.get("experience") as string) || null,
                Salary: (formData.get("Salary") as string) || null,
                description: formData.get("description") as string,
                responsibilities: formData.get("responsibilities") as string,
                requirements: formData.get("requirements") as string,
                benefits: (formData.get("benefits") as string) || null,
                isActive: formData.get("isActive") === "true",
            }
        });

        revalidatePath("/af-ass-manage/careers");
        revalidatePath("/careers");
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to create job posting." };
    }
}
// af-ass-manage: Edit an existing job opening
export async function updateJobPosting(jobId: string, formData: FormData) {
    try {
        const applicationDeadlineStr = formData.get("applicationDeadline") as string;
        
        await prisma.jobPosting.update({
            where: { id: jobId },
            data: {
                title: formData.get("title") as string,
                department: formData.get("department") as string,
                location: formData.get("location") as string,
                type: formData.get("type") as string,
                experience: (formData.get("experience") as string) || null,
                description: formData.get("description") as string,
                responsibilities: formData.get("responsibilities") as string,
                requirements: formData.get("requirements") as string,
                benefits: (formData.get("benefits") as string) || null,
                applicationDeadline: applicationDeadlineStr ? new Date(applicationDeadlineStr) : null,
                isActive: formData.get("isActive") === "true",
            }
        });

        revalidatePath("/af-ass-manage/careers");
        revalidatePath("/careers");
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to update job vacancy parameters." };
    }
}

// af-ass-manage: Update Candidate Application Status (ATS System Desk)
export async function updateApplicationStatus(applicationId: string, status: JobApplicationStatus, notes?: string) {
    try {
        await prisma.jobApplication.update({
            where: { id: applicationId },
            data: { 
                status,
                ...(notes !== undefined && { notes })
            }
        });

        revalidatePath("/af-ass-manage/careers");
        revalidatePath(`/af-ass-manage/careers/[jobid]`);
        revalidatePath(`/af-ass-manage/careers/[jobid]/[applicationid]`);
        return { success: true, message: `Status synchronized to ${status} successfully.` };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to transition application workflow pipeline status." };
    }
}