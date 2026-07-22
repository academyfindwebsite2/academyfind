import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    // Secure the route: Vercel sends the CRON_SECRET in the Authorization header
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const now = new Date();

    const result = await prisma.institute.updateMany({
      where: {
        planExpiresAt: {
          lt: now,
        },
        subscriptionPlan: {
          not: "BASIC",
        },
      },
      data: {
        subscriptionPlan: "BASIC",
        planWeight: 1,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Checked subscriptions. Downgraded ${result.count} institutes to BASIC.`,
    });
  } catch (error) {
    console.error("Error in check-subscriptions cron:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
