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

        // 3. SEO 
        const metaTitle = formData.get("metaTitle") as string;
        const metaDescription = formData.get("metaDescription") as string;

        // 4. Image
        const imageFile = formData.get("imageFile") as File | null;
        const coverFile = formData.get("coverFile") as File | null;

        // 5. NEW SCHEMA FIELDS (Numbers & Strings)
        const mode = formData.get("mode") as "OFFLINE" | "ONLINE" | "HYBRID"; 
        
        const establishedYear = formData.get("establishedYear") ? parseInt(formData.get("establishedYear") as string) : null;
        const totalStudents = formData.get("totalStudents") ? parseInt(formData.get("totalStudents") as string) : null;
        const totalBranches = formData.get("totalBranches") ? parseInt(formData.get("totalBranches") as string) : null;
        const refundPolicy = formData.get("refundPolicy") as string;
        const brochureUrl = formData.get("brochureUrl") as string;

        // 6. Toggles (Booleans)
        const isPublished = formData.get("isPublished") === "true";
        const hasOnlineClasses = formData.get("hasOnlineClasses") === "true";
        const hasHostelFacility = formData.get("hasHostelFacility") === "true";
        const hasDemoClasses = formData.get("hasDemoClasses") === "true";
        const hasScholarship = formData.get("hasScholarship") === "true";
        const hasCertification = formData.get("hasCertification") === "true";

        // 7. JSON Arrays (Parsed)
        const pros = JSON.parse((formData.get("pros") as string) || "[]");
        const cons = JSON.parse((formData.get("cons") as string) || "[]");
        const affiliations = JSON.parse((formData.get("affiliations") as string) || "[]");
        const awards = JSON.parse((formData.get("awards") as string) || "[]");
        const mediumOfInstruction = JSON.parse((formData.get("mediumOfInstruction") as string) || "[]");

        // Facilities & Highlight Stats JSON
        const facilitiesRaw = formData.get("facilities") as string;
        const facilities = facilitiesRaw ? JSON.parse(facilitiesRaw) : [];

        const statsRaw = formData.get("highlightStats") as string;
        const highlightStats = statsRaw ? JSON.parse(statsRaw) : [];

        // 8. Categories Update Logic
        const categoriesString = formData.get("categories") as string;
        const categoryIds = categoriesString ? JSON.parse(categoriesString) : [];

        // 9. Image Upload Logic
        let secureUrl: string | undefined = undefined;
        if (imageFile && imageFile.size > 0 && imageFile.name !== "undefined") {
            secureUrl = await uploadImageToCloudinary(imageFile, "institutes", `inst-${instituteId}-${Date.now()}`);
        }

        let newCoverUrl: string | undefined = undefined;
        if (coverFile && coverFile.size > 0 && coverFile.name !== "undefined") {
            newCoverUrl = await uploadImageToCloudinary(coverFile, "institutes-covers", `cover-${instituteId}-${Date.now()}`);
        }

        // 10. DATABASE UPDATE CALL (IN TRANSACTION)
        await prisma.$transaction(async (tx) => {
            // A. Update Main Institute Table
            await tx.institute.update({
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
                    mode, 
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
                    metaTitle,
                    metaDescription,
                    ...(secureUrl && { imageUrl: secureUrl }),
                    ...(newCoverUrl && { coverImage: newCoverUrl }),
                }
            });

            // B. Manage Categories
            await tx.instituteCategory.deleteMany({ where: { instituteId } });
            if (categoryIds.length > 0) {
                await tx.instituteCategory.createMany({
                    data: categoryIds.map((id: string) => ({
                        instituteId,
                        categoryId: id
                    })) 
                });
            }

            // C. Manage Facilities
            if (facilitiesRaw) {
                await tx.instituteFacility.deleteMany({ where: { instituteId } });
                if (facilities.length > 0) {
                    await tx.instituteFacility.createMany({
                        data: facilities.map((f: any, i: number) => ({
                            instituteId,
                            name: f.name,
                            available: f.available,
                            order: i
                        }))
                    });
                }
            }

            // D. Manage Highlight Stats
            if (statsRaw) {
                await tx.instituteHighlightStat.deleteMany({ where: { instituteId } });
                if (highlightStats.length > 0) {
                    await tx.instituteHighlightStat.createMany({
                        data: highlightStats.map((s: any, i: number) => ({
                            instituteId,
                            label: s.label,
                            value: s.value,
                            icon: s.icon || null,
                            order: i
                        }))
                    });
                }
            }
        });

        // Revalidate Paths
        revalidatePath(`/manager/${instituteId}/profile`);
        revalidatePath(`/institute/[idslug]`, 'page');
        revalidatePath(`/compare/[slug]`, 'page');

        return { success: true, message: "Profile updated successfully!" }
    } catch (error: any) {
        console.error("Update Error:", error);
        return { success: false, error: error.message || "Failed to update profile." }
    }
}