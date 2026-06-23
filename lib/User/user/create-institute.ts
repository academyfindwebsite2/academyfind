"use server"
import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary"
import { revalidatePath } from "next/cache";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
function generateSlug(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

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

export async function addInstitute(userId: string, formData: FormData,selectedCategoryIds: string[]){
    try{
        const name = formData.get("name") as string;
        const description = formData.get("description") as string;
        const phone = formData.get("phone") as string;
        const email = formData.get("email") as string;
        const website = formData.get("website") as string;
        const feeInfo = formData.get("feeInfo") as string;
        const address = formData.get("address") as string;
        const googleMapsUrl = formData.get("googleMapsUrl") as string;
        const cityId = formData.get("cityId") as string;
        const imageFile = formData.get("imageFile") as File;

        const latitude = formData.get("latitude") ? parseFloat(formData.get("latitude") as string) : null;
        const longitude = formData.get("longitude") ? parseFloat(formData.get("longitude") as string) : null;

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
        if (imageFile && imageFile.size > 0) {
            // Humne ID pehle nahi banayi, isliye slug+timestamp ka use kar rahe image ke naam ke liye
            secureUrl = await uploadImageToCloudinary(imageFile, "institutes", `inst-${slug}-${Date.now()}`);
        }

        // Transaction to create Institute AND link categories
        const newInstitute = await prisma.$transaction(async (tx) => {
            const institute = await tx.institute.create({
                data: {
                    name, slug, description, phone, email, website, address, feeInfo,
                    googleMapsUrl, cityId, latitude, longitude,
                    isActive: false,
                    subscriptionPlan: "BASIC",
                    imageUrl: secureUrl
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

            await tx.adminNotification.create({
                data: {
                    type: "NEW_INSTITUTE_REQUEST",
                    title: "New Institute Request",
                    message: `${name} has been requested to be added as a new institute.`,
                }
            });

            // await tx.instituteManager.create({
            //     data: { userId, instituteId: institute.id }
            // });

            await tx.instituteRequest.create({
                data: {
                    userId: userId,
                    instituteId: institute.id,
                    status: "PENDING"
                }
            });

            await tx.user.update({
                where: { id: userId },
                data: { canAddInstitute: false }
            });

            return institute;
        });

        revalidatePath("/user/create-institute");
        return { success: true, message: "Institute created successfully!", id: newInstitute.id, slug: slug };
    } catch (error) {
        console.error("Create Institute Error:", error);
        return { success: false, error: "Failed to create institute." };
    }
}


export async function addImage(instituteId: string, imageFile: File) {
    try {
        if (!imageFile || imageFile.size === 0) return { success: false, error: "No image found." };

        const secureUrl = await uploadImageToCloudinary(imageFile, "results", `inst-${instituteId}-res`);

        await prisma.institute.update({
            where: { id: instituteId },
            data: { imageUrl: secureUrl  }
        });

        revalidatePath(`/user/create-institute`,'layout');
        return { success: true, message: "Result image uploaded!" };
    } catch (error) {
        return { success: false, error: "Failed to upload image." };
    }
}