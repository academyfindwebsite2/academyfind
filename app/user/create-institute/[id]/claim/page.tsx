import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import ClaimForm from "@/components/institute/ClaimForm";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import extractId from "@/lib/extractId"; // 👈 ID extract karne ka function
import { Metadata } from "next";

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ idSlug: string }> 
}): Promise<Metadata> {
  const { idSlug } = await params;
  const id = extractId(idSlug);
  
  // Tab title ke liye institute ka naam nikal rahe hain
  const institute = await prisma.institute.findUnique({
    where: { id: id },
    select: { name: true },
  });

  return {
    title: `Claim ${institute?.name || "Institute"} Profile | AcademyFind`,
    description: "Claim your institute profile to manage listings, respond to reviews, and get direct leads.",
    // 🛑 Strictly blocking search engines from indexing this form
    robots: {
      index: false,
      follow: false, 
    },
  };
}


export default async function ClaimInstitutePage({
  params,
}: {
  params: Promise<{ id: string }>; // 👈 idSlug use kiya
}) {
  // 1. Get param and extract ID
  const { id } = await params;

  // 2. Get logged-in user
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect(`/login?callbackUrl=/user/create-institute/${id}/claim`);
  }

  const userId = session.user.id;

  // 3. Fetch exact Institute details using ID (Bulletproof method)
  const institute = await prisma.institute.findUnique({
    where: { id: id },
    select: { id: true, name: true },
    
  });

  if (!institute) {
    notFound();
  }

  // if (institute.isVerified) {
  //   redirect(`/institute/${idSlug}?error=already_claimed`);
  // }

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-sans">
      <div className="w-full max-w-5xl">
        <ClaimForm 
          instituteId={institute.id} 
          instituteName={institute.name}
          userId={userId} 
        />
      </div>
    </div>
  );
}