import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return NextResponse.json({ authenticated: false }, { status: 401 });
        }

        // Database se bilkul fresh rules aur permissions nikaalo
        const freshUser = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                role: true,
                canAddInstitute: true
            }
        });

        return NextResponse.json({ authenticated: true, ...freshUser });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}