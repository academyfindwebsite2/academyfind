import EditJobForm from "@/components/admin/adminEditJobForm";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditJobPage({ params }: { params: Promise<{ jobid: string }> }) {
    const { jobid } = await params;
    console.log(jobid);
    const job = await prisma.jobPosting.findUnique({
        where: { id: jobid }
    });

    if (!job) {
        return notFound();
    }

    return <EditJobForm job={job} />;
}