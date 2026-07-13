import { getSession } from "@/lib/auth/getSession";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        const session = await getSession();
        if (!session?.user?.id) {
            return NextResponse.json({ success: false });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { lastLoginAt: true }
        });

        const now = new Date();
        // Only update if lastLoginAt is null OR if it's been more than 5 minutes since the last update
        // This prevents spamming the database on every single page navigation
        if (!user?.lastLoginAt || (now.getTime() - new Date(user.lastLoginAt).getTime()) > 5 * 60 * 1000) {
            await prisma.user.update({
                where: { id: session.user.id },
                data: { lastLoginAt: now }
            });
            return NextResponse.json({ success: true, updated: true });
        }

        return NextResponse.json({ success: true, updated: false });
    } catch (error) {
        console.error("[UserActivityAPI] Error:", error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
