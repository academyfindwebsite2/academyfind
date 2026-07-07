import BlogEditor from "@/components/blog/editor/BlogEditor";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Write Blog | Manager Dashboard",
  robots: { index: false, follow: false },
};

export default async function ManagerWriteBlogPage(props: { params: Promise<{ instituteId: string }> }) {
  const { instituteId } = await props.params;

  const institute = await prisma.institute.findUnique({
    where: { id: instituteId },
    select: { subscriptionPlan: true },
  });

  if (!institute || (institute.subscriptionPlan !== "PREMIUM" && institute.subscriptionPlan !== "ULTRA")) {
    redirect(`/manager/${instituteId}/blogs`);
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12">
      <BlogEditor mode="create" management="manager" relatedInstituteId={instituteId} />
    </div>
  );
}
