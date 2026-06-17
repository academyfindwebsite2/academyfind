"use server";

import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function applyForJob(formData: FormData) {
    try {
        const file = formData.get("resumeFile") as File;
        if (!file) {
            return { success: false, error: "Resume file is missing." };
        }

        // 1. Convert file to Buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // 2. 🚀 The Perfect Cloudinary Stream for PDFs
        const secureUrl = await new Promise<string>((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: "academyfind/resumes",
                    public_id: `resume-${Date.now()}.pdf`, // 👈 .pdf extension is VERY important
                    resource_type: "raw", // 👈 PDFs aur docs ke liye 'raw' hona 
                },
                (error, result) => {
                    if (error) {
                        console.error("Cloudinary Upload Error:", error);
                        reject(error);
                    } else {
                        resolve(result?.secure_url as string);
                    }
                }
            ).end(buffer);
        });

        const resumeFileName = file.name;

        // 3. Save to Database
        await prisma.jobApplication.create({
            data: {
                jobId: formData.get("jobId") as string,
                name: formData.get("name") as string,
                email: formData.get("email") as string,
                phone: formData.get("phone") as string,
                linkedinUrl: (formData.get("linkedinUrl") as string) || null,
                portfolioUrl: (formData.get("portfolioUrl") as string) || null,
                coverLetter: (formData.get("coverLetter") as string) || null,
                notes: (formData.get("notes") as string) || null,
                resumeUrl: secureUrl, // Cloudinary se aaya hua sahi URL
                resumeFileName: resumeFileName,
                status: "NEW"
            }
        });

        // 4. Notify Admins
        await prisma.adminNotification.create({
            data: {
                type: "NEW_APPLICATION",
                title: "New Job Application",
                message: `${formData.get("name")} applied for a Job.`,
                referenceId: formData.get("jobId") as string,
                actionUrl: "/af-ass-manage/careers/applications"
            }
        });

        revalidatePath("/af-ass-manage/careers/applications");
        return { success: true };

    } catch (error) {
        console.error("Application Submission Error:", error);
        return { success: false, error: "Application submission failed." };
    }
}