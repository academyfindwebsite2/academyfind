"use server";

import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function submitGeneralResume(formData: FormData) {
    try {
        const file = formData.get("resumeFile") as File;
        if (!file || file.size === 0) {
            return { success: false, error: "Please upload your resume." };
        }

        // 1. Convert file to Buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // 2. 🚀 Cloudinary Stream for PDFs (100% safe)
        const secureUrl = await new Promise<string>((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: "academyfind/talent-pool",
                    public_id: `talent-${Date.now()}.pdf`, // 👈 .pdf extension is VERY important
                    resource_type: "raw", // 👈 PDFs ke liye 'raw'
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

        // 3. Save to Database
        await prisma.generalResume.create({
            data: {
                name: formData.get("name") as string,
                email: formData.get("email") as string,
                phone: formData.get("phone") as string,
                linkedinUrl: (formData.get("linkedinUrl") as string) || null,
                portfolioUrl: (formData.get("portfolioUrl") as string) || null,
                message: (formData.get("message") as string) || null,
                resumeUrl: secureUrl,
                resumeFileName: file.name,
            }
        });

        // 4. Notify Admins
        await prisma.adminNotification.create({
            data: {
                type: "NEW_GENERAL_RESUME",
                title: "New Talent Pool Resume",
                message: `${formData.get("name")} dropped their resume for future roles.`,
                actionUrl: "/admin/careers/resumes"
            }
        });

        revalidatePath("/admin/careers/resumes");
        return { success: true };

    } catch (error) {
        console.error("General Resume Submission Error:", error);
        return { success: false, error: "Something went wrong. Please try again." };
    }
}