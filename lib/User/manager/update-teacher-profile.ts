"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { requireAuth } from "@/lib/auth/requireAuth"
import { getUserInstituteRole } from "@/lib/auth/getInstituteRole"

/**
 * Invite / register a teacher to an institute by email.
 * This creates:
 *  1. InstituteMembership (role=TEACHER, status=ACTIVE)
 *  2. TeacherInstituteRecord (with designation, department, subjects)
 *
 * Note: The old per-institute TeacherProfile.create with (name, subject, imageUrl, instituteId)
 * no longer matches the schema. Teachers are now identified via their global User account.
 */
export async function addTeacherByEmail(
  instituteId: string,
  formData: FormData
) {
  try {
    const session = await requireAuth()
    const role = await getUserInstituteRole(session.user.id, instituteId)
    if (role !== "MANAGER" && role !== "ADMIN") {
      return { success: false, error: "Unauthorized" }
    }

    const email = (formData.get("email") as string)?.trim()
    const designation = (formData.get("designation") as string) || undefined
    const department = (formData.get("department") as string) || undefined
    const subjectsRaw = formData.get("subjects") as string | null
    const teachingSubjects = subjectsRaw
      ? subjectsRaw.split(",").map((s) => s.trim()).filter(Boolean)
      : []

    if (!email) return { success: false, error: "Email is required." }

    // Find the user by email
    const targetUser = await prisma.user.findUnique({ where: { email } })
    if (!targetUser)
      return { success: false, error: "No user found with that email." }

    // Check if already a member
    const existing = await prisma.instituteMembership.findFirst({
      where: { userId: targetUser.id, instituteId },
    })
    if (existing) {
      return { success: false, error: "This user is already a member of this institute." }
    }

    // Ensure the user has a TeacherProfile (create if missing)
    await prisma.teacherProfile.upsert({
      where: { userId: targetUser.id },
      create: { userId: targetUser.id },
      update: {},
    })

    const teacherProfile = await prisma.teacherProfile.findUnique({
      where: { userId: targetUser.id },
      select: { id: true },
    })
    if (!teacherProfile) {
      return { success: false, error: "Failed to create teacher profile." }
    }

    // Create the membership + teacher record in a transaction
    await prisma.$transaction(async (tx) => {
      const membership = await tx.instituteMembership.create({
        data: {
          userId: targetUser.id,
          instituteId,
          role: "TEACHER",
          status: "ACTIVE",
        },
      })

      await tx.teacherInstituteRecord.create({
        data: {
          membershipId: membership.id,
          teacherProfileId: teacherProfile.id,
          instituteId,
          designation,
          department,
          teachingSubjects,
        },
      })
    })

    revalidatePath(`/manager/${instituteId}/members`, "layout")
    return { success: true, message: "Teacher added successfully!" }
  } catch (error) {
    console.error("addTeacherByEmail error:", error)
    return { success: false, error: "Failed to add teacher." }
  }
}

/**
 * Remove a teacher from an institute by deleting their membership.
 * Cascade rules handle TeacherInstituteRecord deletion.
 */
export async function removeTeacherMembership(
  membershipId: string,
  instituteId: string
) {
  try {
    const session = await requireAuth()
    const role = await getUserInstituteRole(session.user.id, instituteId)
    if (role !== "MANAGER" && role !== "ADMIN") {
      return { success: false, error: "Unauthorized" }
    }

    await prisma.instituteMembership.delete({ where: { id: membershipId } })

    revalidatePath(`/manager/${instituteId}/members`, "layout")
    return { success: true, message: "Teacher removed." }
  } catch (error) {
    return { success: false, error: "Failed to remove teacher." }
  }
}
