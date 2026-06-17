"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImageToCloudinary(file: File, folderName: string, idPrefix: string) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    // Cloudinary SDK requires a Data URI for buffers
    const dataUri = `data:${file.type};base64,${buffer.toString('base64')}`;

    const uploadResult = await cloudinary.uploader.upload(dataUri, {
        folder: `academyfind/${folderName}`,
        public_id: `${idPrefix}-${Date.now()}`, 
        overwrite: true,
        format: "webp", 
    });

    return uploadResult.secure_url;
}

function generateSlug(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

export async function createInstitute(formData: FormData, selectedCategoryIds: string[]) {
    try {
        const name = formData.get("name") as string;
        const description = formData.get("description") as string;
        const phone = formData.get("phone") as string;
        const email = formData.get("email") as string;
        const website = formData.get("website") as string;
        const address = formData.get("address") as string;
        const googleMapsUrl = formData.get("googleMapsUrl") as string;
        const cityId = formData.get("cityId") as string;
        const subscriptionPlan = formData.get("subscriptionPlan") as any || "BASIC";
        const image = formData.get("imageFile") as File || null;

        const isVerified = formData.get("isVerified") === "true";
        const isFeatured = formData.get("isFeatured") === "true";
        const isActive = formData.get("isActive") === "true";

        const latitude = formData.get("latitude") ? parseFloat(formData.get("latitude") as string) : null;
        const longitude = formData.get("longitude") ? parseFloat(formData.get("longitude") as string) : null;
        const googleRating = formData.get("googleRating") ? parseFloat(formData.get("googleRating") as string) : null;
        const googleReviewCount = formData.get("googleReviewCount") ? parseInt(formData.get("googleReviewCount") as string) : null;

        if (!name || !cityId || !address) {
            return { success: false, error: "Name, City, and Address are required." };
        }

        let slug = generateSlug(name);
        let existing = await prisma.institute.findFirst({ where: { slug } });
        let counter = 1;
        while (existing) {
            slug = `${generateSlug(name)}-${counter}`;
            existing = await prisma.institute.findFirst({ where: { slug } });
            counter++;
        }

        let secureUrl = null;
        if (image && image.size > 0) {
            // Humne ID pehle nahi banayi, isliye slug+timestamp ka use kar rahe image ke naam ke liye
            secureUrl = await uploadImageToCloudinary(image, "institutes", `inst-${slug}-${Date.now()}`);
        }

        // Transaction to create Institute AND link categories
        const newInstitute = await prisma.$transaction(async (tx) => {
            const institute = await tx.institute.create({
                data: {
                    name, slug, description, phone, email, website, address,
                    googleMapsUrl, cityId, subscriptionPlan, 
                    imageUrl: secureUrl,
                    isVerified, isFeatured, isActive, latitude, longitude,
                    googleRating, googleReviewCount
                }
            });

            if (selectedCategoryIds.length > 0) {
                await tx.instituteCategory.createMany({
                    data: selectedCategoryIds.map(catId => ({
                        instituteId: institute.id,
                        categoryId: catId
                    }))
                });
            }
            return institute;
        });

        revalidatePath("/af-ass-manage/institutes");
        return { success: true, message: "Institute created successfully!", id: newInstitute.id };
    } catch (error) {
        console.error("Create Institute Error:", error);
        return { success: false, error: "Failed to create institute." };
    }
}

export async function updateInstituteByAdmin(
    instituteId: string, 
    formData: FormData, 
    selectedCategoryIds: string[] 
) {
    try {
        const name = formData.get("name") as string;
        const slug = formData.get("slug") as string;
        const description = formData.get("description") as string;
        const feeInfo = formData.get("feeInfo") as string; // 🚀 Added Fee Info
        const phone = formData.get("phone") as string;
        const email = formData.get("email") as string;
        const website = formData.get("website") as string;
        const address = formData.get("address") as string;
        const googleMapsUrl = formData.get("googleMapsUrl") as string;
        const cityId = formData.get("cityId") as string;
        const subscriptionPlan = formData.get("subscriptionPlan") as any;
        
        // 🚀 Added All Social Media Links
        const whatsappUrl = formData.get("whatsappUrl") as string;
        const instagramUrl = formData.get("instagramUrl") as string;
        const facebookUrl = formData.get("facebookUrl") as string;
        const youtubeUrl = formData.get("youtubeUrl") as string;
        const linkedinUrl = formData.get("linkedinUrl") as string;
        const twitterUrl = formData.get("twitterUrl") as string;
        const telegramUrl = formData.get("telegramUrl") as string;

        // Checkboxes / Toggles values
        const isVerified = formData.get("isVerified") === "true";
        const isFeatured = formData.get("isFeatured") === "true";
        const isPublished = formData.get("isPublished") === "true"; // 🚀 FIX: Removed typo "true;"
        const isActive = formData.get("isActive") === "true";

        const imageFile = formData.get("imageFile") as File || null;

        // Floats handles
        const latitude = formData.get("latitude") ? parseFloat(formData.get("latitude") as string) : null;
        const longitude = formData.get("longitude") ? parseFloat(formData.get("longitude") as string) : null;
        const googleRating = formData.get("googleRating") ? parseFloat(formData.get("googleRating") as string) : null;
        const googleReviewCount = formData.get("googleReviewCount") ? parseInt(formData.get("googleReviewCount") as string) : null;

        let newImageUrl: string | undefined = undefined; // Undefined rakhenge taaki Prisma purani image delete na kare

        if (imageFile && imageFile.size > 0) {
            newImageUrl = await uploadImageToCloudinary(imageFile, "institutes", `inst-${slug}-${Date.now()}`);
        }

        await prisma.$transaction([
            // 1. Direct Model Values Update Karo
            prisma.institute.update({
                where: { id: instituteId },
                data: {
                    name,
                    slug,
                    description,
                    feeInfo, // 🚀 Added
                    phone,
                    email,
                    website,
                    address,
                    googleMapsUrl,
                    cityId,
                    subscriptionPlan,
                    
                    // 🚀 Added Social Links to DB
                    whatsappUrl,
                    instagramUrl,
                    facebookUrl,
                    youtubeUrl,
                    linkedinUrl,
                    twitterUrl,
                    telegramUrl,

                    isVerified,
                    isFeatured,
                    isPublished,
                    isActive,    
                    latitude,
                    longitude,
                    googleRating,
                    googleReviewCount,
                    
                    ...(newImageUrl && { imageUrl: newImageUrl }) 
                }
            }),

            // 2. Categories Add/Remove Logic (Delete old mappings)
            prisma.instituteCategory.deleteMany({
                where: { instituteId: instituteId }
            }),

            // 3. Insert newly selected categories array link setup
            prisma.instituteCategory.createMany({
                data: selectedCategoryIds.map((catId) => ({
                    instituteId: instituteId,
                    categoryId: catId
                }))
            })
        ]);

        // Revalidate clean cascades paths
        revalidatePath("/af-ass-manage/institutes");
        revalidatePath(`/af-ass-manage/institutes/${instituteId}`);
        revalidatePath(`/institute/${instituteId}-${slug}`); // Public view card update sync

        return { success: true, message: "Master properties sync completed!" }
    } catch (error) {
        console.error("Admin Master Update Error:", error);
        return { success: false, error: "Something went wrong in transaction database update." }
    }
}