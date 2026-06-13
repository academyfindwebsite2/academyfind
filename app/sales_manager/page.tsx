import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SalesManagerRootPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        redirect('/login');
    }

    if (session.user.role !== "SALES_MANAGER" && session.user.role !== "ADMIN") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🛑</span>
                </div>
                <h1 className="text-2xl font-bold text-slate-800">Access Denied</h1>
                <p className="text-slate-500">You do not have Sales Manager privileges.</p>
                <Link href="/" className="text-blue-600 hover:underline">Return to Homepage</Link>
            </div>
        );
    }

    // Redirect sales manager to their own profile
    redirect(`/sales_manager/${session.user.id}`);
}
