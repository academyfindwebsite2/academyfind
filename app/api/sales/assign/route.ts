import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Admin access required" }, { status: 403 });
        }

        const body = await req.json();
        const { salesManagerId, instituteId, deadline } = body;

        if (!salesManagerId || !instituteId) {
            return NextResponse.json(
                { error: "salesManagerId and instituteId are required" },
                { status: 400 }
            );
        }

        // Verify the user is a sales manager
        const manager = await prisma.user.findUnique({
            where: { id: salesManagerId },
            select: { role: true }
        });

        if (!manager || manager.role !== "SALES_MANAGER") {
            return NextResponse.json({ error: "User is not a Sales Manager" }, { status: 400 });
        }

        const cleanInstituteId = instituteId.startsWith("inst-") 
        ? instituteId.replace("inst-", "") 
        : instituteId;

        // Verify institute exists
        const institute = await prisma.institute.findUnique({
            where: { id: cleanInstituteId },
            select: { id: true }
        });

        if (!institute) {
            return NextResponse.json({ error: "Institute not found" }, { status: 404 });
        }

        // 🚀 SMART FIX: Upsert (Update if exists, Create if not)
        const assignment = await prisma.salesAssignment.upsert({
            where: { 
                instituteId: cleanInstituteId // Find by strictly instituteId
            },
            update: {
                salesManagerId: salesManagerId, // Transfer to new manager
                deadline: deadline ? new Date(deadline) : null,
            },
            create: {
                salesManagerId,
                instituteId : cleanInstituteId,
                deadline: deadline ? new Date(deadline) : null,
            },
            include: {
                institute: { select: { name: true } }
            }
        });

        return NextResponse.json({ success: true, assignment });

    } catch (error) {
        console.error("Error assigning institute:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}   