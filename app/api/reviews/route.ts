import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request
) {
  try {
    const session =
      await auth.api.getSession({
        headers: request.headers,
      });

    if (!session?.user) {
      return NextResponse.json(
        {
          error:
            "Please login first",
        },
        {
          status: 401,
        }
      );
    }

    const body =
      await request.json();

    const {
      instituteId,
      rating,
      comment,
    } = body;

    await prisma.review.upsert({
      where: {
        userId_instituteId: {
          userId:
            session.user.id,
          instituteId,
        },
      },

      update: {
        rating,
        comment,
      },

      create: {
        rating,
        comment,
        instituteId,
        userId:
          session.user.id,
      },
    });

    const stats =
      await prisma.review.aggregate({
        where: {
          instituteId,
        },

        _avg: {
          rating: true,
        },

        _count: {
          rating: true,
        },
      });

    await prisma.institute.update({
      where: {
        id: instituteId,
      },

      data: {
        averageRating:
          stats._avg.rating ?? 0,

        reviewCount:
          stats._count.rating,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to submit review",
      },
      {
        status: 500,
      }
    );
  }
}