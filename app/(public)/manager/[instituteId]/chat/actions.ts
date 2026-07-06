"use server";

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function createCustomChannel(
    instituteId: string,
    title: string,
    isReadOnly: boolean
) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session) return { error: "Unauthorized" };

        const manager = await prisma.instituteManager.findUnique({
            where: {
                userId_instituteId: {
                    userId: session.user.id,
                    instituteId: instituteId
                }
            }
        });

        if (!manager && session.user.role !== "ADMIN") {
            return { error: "Unauthorized" };
        }

        const channel = await prisma.conversation.create({
            data: {
                type: "INSTITUTE",
                instituteId: instituteId,
                channelType: "CUSTOM",
                title: title,
                isReadOnly: isReadOnly,
                createdById: session.user.id,
                participants: {
                    create: {
                        userId: session.user.id,
                        role: "MANAGER"
                    }
                }
            }
        });

        revalidatePath(`/manager/${instituteId}/chat`);
        return { success: true, channel };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function deleteCustomChannel(channelId: string) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session) return { error: "Unauthorized" };

        const channel = await prisma.conversation.findUnique({
            where: { id: channelId }
        });

        if (!channel || channel.channelType !== "CUSTOM") {
            return { error: "Can only delete custom channels." };
        }

        const manager = await prisma.instituteManager.findUnique({
            where: {
                userId_instituteId: {
                    userId: session.user.id,
                    instituteId: channel.instituteId!
                }
            }
        });

        if (!manager && session.user.role !== "ADMIN") {
            return { error: "Unauthorized" };
        }

        await prisma.conversation.delete({
            where: { id: channelId }
        });

        revalidatePath(`/manager/${channel.instituteId}/chat`);
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}
