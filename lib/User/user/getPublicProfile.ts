import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export async function getPublicProfile(username: string) {
  const user = await prisma.user.findUnique({
    where: {
      username,
      isVisible: true,
    },
    include: {
      studentProfile: true,
      teacherProfile: true,

      memberships: {
        where: {
          isActive: true,
          status: "ACTIVE",
        },
        include: {
          institute: {
            select: {
              id: true,
              name: true,
              slug: true,
              logo: true,
              city: {
                select: {
                  name: true,
                },
              },
            },
          },

          studentRecord: true,
          teacherRecord: true,
        },
      },

      reputation: true,
    },
  });

  if (!user) {
    notFound();
  }

  return user;
}