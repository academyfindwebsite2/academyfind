import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function ProfileRedirectPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) redirect('/login');
    const { user: sessionUser } = session;

    const dbUser = await prisma.user.findUnique({
        where: { id: sessionUser.id },
        select: { username: true }
    });

    if (!dbUser?.username) redirect('/login');

    redirect(`/u/${dbUser.username}`);
}