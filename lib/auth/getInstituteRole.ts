import { prisma } from "@/lib/prisma";

export type InstituteAccessRole =
  | "ADMIN"
  | "MANAGER"
  | "TEACHER"
  | "ACTIVE_STUDENT"
  | "PENDING"
  | "NONE";

export async function getUserInstituteRole(
  userId: string,
  instituteId: string,
): Promise<InstituteAccessRole> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      role: true,
      memberships: {
        where: { instituteId, isActive: true },
        select: { role: true, status: true },
      },
    },
  });

  if (!user) return "NONE";
  if (user.role === "ADMIN") return "ADMIN";

  const active = user.memberships.filter(
    (membership) => membership.status === "ACTIVE",
  );

  if (active.some((membership) => membership.role === "MANAGER")) {
    return "MANAGER";
  }
  if (active.some((membership) => membership.role === "TEACHER")) {
    return "TEACHER";
  }
  if (active.some((membership) => membership.role === "STUDENT")) {
    return "ACTIVE_STUDENT";
  }
  if (user.memberships.some((membership) => membership.status === "PENDING")) {
    return "PENDING";
  }

  return "NONE";
}
