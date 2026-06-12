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
        const name = formData.get("name") as string;
        const description = formData.get("description") as string;
        const email = formData.get("email") as string;
        const phone = formData.get("phone") as string;
        const website = formData.get("website") as string;
        const address = formData.get("address") as string;
        const categoriesString = formData.get("categories") as string;
        const feeInfo = formData.get("feeInfo") as string; // 🚀 New
        const googleMapsUrl = formData.get("googleMapsUrl") as string;
        const imageFile = formData.get("imageFile") as File | null;
        const rawLat = formData.get("latitude") as string;
        const rawLng = formData.get("longitude") as string;

        const latitude = (rawLat && !isNaN(parseFloat(rawLat))) ? parseFloat(rawLat) : null;
        const longitude = (rawLng && !isNaN(parseFloat(rawLng))) ? parseFloat(rawLng) : null;

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
        let secureUrl: string | undefined = undefined;
        if (imageFile && imageFile.size > 0 && imageFile.name !== "undefined") {
            // Humne ID pehle nahi banayi, isliye slug+timestamp ka use kar rahe image ke naam ke liye
            secureUrl = await uploadImageToCloudinary(imageFile, "institutes", `inst-${instituteId}-${Date.now()}`);
        }
        await prisma.institute.update({
            where:{
                id: instituteId
            },
            data:{
                name: name,
                description: description,
                email: email,
                phone: phone,
                website: website,
                address: address,
                feeInfo:feeInfo,
                googleMapsUrl:googleMapsUrl,
                latitude:latitude,
                longitude:longitude,
                imageUrl:secureUrl,
                ...categoryUpdates
            }
        })

        revalidatePath(`/manager/${instituteId}/profile`);
        revalidatePath(`/institute/[idslug]`, 'page');

        return { success: true, message: "Profile updated successfully!" }
    } catch (error) {
        console.error("Update Error:", error);
        return { success: false, error: "Failed to update profile." }
    }
}