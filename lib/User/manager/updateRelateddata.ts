"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";

// --- Cloudinary Config ---
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

// ==========================================
// 1. UPDATE BATCHES
// ==========================================
export async function updateInstituteBatches(instituteId: string, batches: any[]) {
    try {
        await prisma.instituteBatch.deleteMany({ where: { instituteId } });

        if (batches.length > 0) {
            await prisma.instituteBatch.createMany({
                data: batches.map(b => ({
                    instituteId,
                    name: b.name,
                    duration: b.duration || null,
                    fee: b.fee ? parseInt(b.fee) : null,
                    originalFee: b.originalFee ? parseInt(b.originalFee) : null,
                    batchType: b.batchType || null,
                    mode: b.mode || "OFFLINE",
                    timing: b.timing || null,
                    seatsTotal: b.seatsTotal ? parseInt(b.seatsTotal) : null,
                    seatsLeft: b.seatsLeft ? parseInt(b.seatsLeft) : null,
                    ageGroupMin: b.ageGroupMin ? parseInt(b.ageGroupMin) : null,
                    ageGroupMax: b.ageGroupMax ? parseInt(b.ageGroupMax) : null,
                }))
            });
        }
        revalidatePath(`/manager/${instituteId}/profile`);
        return { success: true };
    } catch (error) {
        console.error("Batch Update Error:", error);
        return { success: false, error: "Failed to update batches" };
    }
}

// ==========================================
// 2. UPDATE FAQs
// ==========================================
export async function updateInstituteFAQs(instituteId: string, faqs: any[]) {
    try {
        await prisma.instituteFAQ.deleteMany({ where: { instituteId } });

        if (faqs.length > 0) {
            await prisma.instituteFAQ.createMany({
                data: faqs.map((f, idx) => ({
                    instituteId,
                    question: f.question,
                    answer: f.answer,
                    order: idx
                }))
            });
        }
        revalidatePath(`/manager/${instituteId}/profile`);
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to update FAQs" };
    }
}

// ==========================================
// 3. UPDATE OPERATING HOURS
// ==========================================
export async function updateOperatingHours(instituteId: string, hours: any[]) {
    try {
        await prisma.instituteOperatingHour.deleteMany({ where: { instituteId } });

        await prisma.instituteOperatingHour.createMany({
            data: hours.map(h => ({
                instituteId,
                dayOfWeek: h.dayOfWeek,
                openTime: h.openTime || null,
                closeTime: h.closeTime || null,
                isClosed: h.isClosed
            }))
        });
        revalidatePath(`/manager/${instituteId}/profile`);
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to update operating hours" };
    }
}

// ==========================================
// 4. UPDATE ACHIEVEMENTS (With Images)
// ==========================================
export async function updateAchievements(instituteId: string, formData: FormData) {
    try {
        const rawData = formData.get("data") as string;
        const achievements = JSON.parse(rawData || "[]");

        // Delete Old
        await prisma.instituteAchievement.deleteMany({ where: { instituteId } });

        for (let i = 0; i < achievements.length; i++) {
            const ach = achievements[i];
            const file = formData.get(`image_${i}`) as File | null;
            let secureUrl = ach.imageUrl;

            if (file && file.size > 0) {
                secureUrl = await uploadImageToCloudinary(file, "achievements", `ach-${instituteId}`);
            }

            await prisma.instituteAchievement.create({
                data: {
                    instituteId,
                    year: parseInt(ach.year) || new Date().getFullYear(),
                    title: ach.title,
                    studentName: ach.studentName || null,
                    achievementType: ach.achievementType || null,
                    imageUrl: secureUrl || null
                }
            });
        }

        revalidatePath(`/manager/${instituteId}/profile`);
        return { success: true };
    } catch (error) {
        console.error("Achievement Error:", error);
        return { success: false, error: "Failed to update achievements" };
    }
}

// ==========================================
// 5. UPDATE NOTABLE ALUMNI (With Images)
// ==========================================
export async function updateNotablePersons(instituteId: string, formData: FormData) {
    try {
        const rawData = formData.get("data") as string;
        const persons = JSON.parse(rawData || "[]");

        await prisma.notablePersons.deleteMany({ where: { instituteId } });

        for (let i = 0; i < persons.length; i++) {
            const p = persons[i];
            const file = formData.get(`image_${i}`) as File | null;
            let secureUrl = p.imageUrl;

            if (file && file.size > 0) {
                secureUrl = await uploadImageToCloudinary(file, "alumni", `alum-${instituteId}`);
            }

            await prisma.notablePersons.create({
                data: {
                    instituteId,
                    name: p.name,
                    batchYear: p.batchYear ? parseInt(p.batchYear) : null,
                    placedAt: p.placedAt || null,
                    package: p.package || null,
                    imageUrl: secureUrl || null
                }
            });
        }

        revalidatePath(`/manager/${instituteId}/profile`);
        return { success: true };
    } catch (error) {
        console.error("Notable Alumni Error:", error);
        return { success: false, error: "Failed to update alumni" };
    }
}