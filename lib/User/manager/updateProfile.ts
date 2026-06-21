"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImageToCloudinary(file: File, folderName: string, idPrefix: string) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const dataUri = `data:${file.type};base64,${buffer.toString('base64')}`;

    const uploadResult = await cloudinary.uploader.upload(dataUri, {
        folder: `academyfind/${folderName}`,
        public_id: `${idPrefix}-${Date.now()}`, 
        overwrite: true,
        format: "webp", 
    });

    return uploadResult.secure_url;
}

export async function updateInstituteProfile(instituteId: string, formData: FormData){
    try{
        // 1. Basic Strings
        const name = formData.get("name") as string;
        const description = formData.get("description") as string;
        const email = formData.get("email") as string;
        const phone = formData.get("phone") as string;
        const website = formData.get("website") as string;
        const address = formData.get("address") as string;
        const feeInfo = formData.get("feeInfo") as string;
        const googleMapsUrl = formData.get("googleMapsUrl") as string;
        const rawLat = formData.get("latitude") as string;
        const rawLng = formData.get("longitude") as string;
        const latitude = (rawLat && !isNaN(parseFloat(rawLat))) ? parseFloat(rawLat) : null;
        const longitude = (rawLng && !isNaN(parseFloat(rawLng))) ? parseFloat(rawLng) : null;
        
        // 2. Social Links
        const facebookUrl = formData.get("facebookUrl") as string;
        const instagramUrl = formData.get("instagramUrl") as string;
        const twitterUrl = formData.get("twitterUrl") as string;
        const youtubeUrl = formData.get("youtubeUrl") as string;
        const telegramUrl = formData.get("telegramUrl") as string;
        const whatsappUrl = formData.get("whatsappUrl") as string;
        const linkedinUrl = formData.get("linkedinUrl") as string;

        // 3. Image
        const imageFile = formData.get("imageFile") as File | null;

        // 4. NEW SCHEMA FIELDS (Numbers & Strings)
        // 🔥 FIX: Casted explicitly to the Prisma Enum Type
        const mode = formData.get("mode") as "OFFLINE" | "ONLINE" | "HYBRID"; 
        
        const establishedYear = formData.get("establishedYear") ? parseInt(formData.get("establishedYear") as string) : null;
        const totalStudents = formData.get("totalStudents") ? parseInt(formData.get("totalStudents") as string) : null;
        const totalBranches = formData.get("totalBranches") ? parseInt(formData.get("totalBranches") as string) : null;
        const refundPolicy = formData.get("refundPolicy") as string;
        const brochureUrl = formData.get("brochureUrl") as string;

        // 5. Toggles (Booleans)
        const isPublished = formData.get("isPublished") === "true";
        const hasOnlineClasses = formData.get("hasOnlineClasses") === "true";
        const hasHostelFacility = formData.get("hasHostelFacility") === "true";
        const hasDemoClasses = formData.get("hasDemoClasses") === "true";
        const hasScholarship = formData.get("hasScholarship") === "true";
        const hasCertification = formData.get("hasCertification") === "true";

        // 6. JSON Arrays (Parsed)
        const pros = JSON.parse((formData.get("pros") as string) || "[]");
        const cons = JSON.parse((formData.get("cons") as string) || "[]");
        const affiliations = JSON.parse((formData.get("affiliations") as string) || "[]");
        const awards = JSON.parse((formData.get("awards") as string) || "[]");
        const mediumOfInstruction = JSON.parse((formData.get("mediumOfInstruction") as string) || "[]");

        // 7. Categories Update Logic
        const categoriesString = formData.get("categories") as string;
        let categoryUpdates = {};

        if (categoriesString) {
            const categoryIds = JSON.parse(categoriesString);
            categoryUpdates = {
                categories: {
                    deleteMany: {},
                    create: categoryIds.map((id: string) => ({
                        category: { connect: { id } }
                    })) 
                }
            };
        }

        // 8. Image Upload Logic
        let secureUrl: string | undefined = undefined;
        if (imageFile && imageFile.size > 0 && imageFile.name !== "undefined") {
            secureUrl = await uploadImageToCloudinary(imageFile, "institutes", `inst-${instituteId}-${Date.now()}`);
        }

        // 9. DATABASE UPDATE CALL (Added all the missing variables here)
        await prisma.institute.update({
            where:{ id: instituteId },
            data:{
                name,
                description,
                email,
                phone,
                website,
                address,
                feeInfo,
                googleMapsUrl,
                latitude,
                longitude,
                facebookUrl,
                instagramUrl,
                twitterUrl,
                youtubeUrl,
                telegramUrl,
                whatsappUrl,
                linkedinUrl,
                mode, // Typo fixed!
                establishedYear,
                totalStudents,
                totalBranches,
                refundPolicy,
                brochureUrl,
                isPublished,
                hasOnlineClasses,
                hasHostelFacility,
                hasDemoClasses,
                hasScholarship,
                hasCertification,
                pros,
                cons,
                affiliations,
                awards,
                mediumOfInstruction,
                ...(secureUrl ? { imageUrl: secureUrl } : {}), // Update image only if newly uploaded
                ...categoryUpdates
            }
        });

        // Revalidate Paths
        revalidatePath(`/manager/${instituteId}/profile`);
        revalidatePath(`/institute/[idslug]`, 'page');
        revalidatePath(`/compare/[slug]`, 'page'); // Good idea to clear compare page cache too!

        return { success: true, message: "Profile updated successfully!" }
    } catch (error) {
        console.error("Update Error:", error);
        return { success: false, error: "Failed to update profile." }
    }
}