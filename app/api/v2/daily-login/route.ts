import { getSession } from "@/lib/auth/getSession"
import { prisma } from "@/lib/prisma"
import { creditWallet } from "@/lib/wallet/credit"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { lastLoginAt: true }
    })

    const today  = new Date().toDateString()
    const lastLogin = user?.lastLoginAt ? new Date(user.lastLoginAt).toDateString() : null

    if (lastLogin === today) {
      return NextResponse.json({ ok: true, alreadyAwarded: true })
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data:  { lastLoginAt: new Date() }
    })

    await creditWallet(session.user.id, 1, 'DAILY_LOGIN', 'Daily login bonus ☀️')

    return NextResponse.json({ ok: true, coinsAwarded: 1 })
  } catch (error) {
    console.error("[DailyLoginAPI] Error:", error)
    return NextResponse.json({ ok: false, error: "Internal Server Error" }, { status: 500 })
  }
}
