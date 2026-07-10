import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Users, PackageOpen, Plus, UserMinus } from "lucide-react";
import { EditBatchModal } from "./EditBatchModal";

type Props = { params: Promise<{ instituteId: string; batchId: string }> };

export default async function ManagerBatchDetailsPage({ params }: Props) {
  const { instituteId, batchId } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const batch = await prisma.instituteBatch.findUnique({
    where: { id: batchId, instituteId },
    include: {
      studentMembers: {
        include: {
          studentRecord: {
            include: { studentProfile: { include: { user: true } } },
          },
        },
      },
      teacherMembers: {
        include: {
          teacherRecord: {
            include: { teacherProfile: { include: { user: true } } },
          },
        },
      },
    },
  });

  if (!batch) notFound();

  // Get active students and teachers from the institute to invite
  const [activeStudents, activeTeachers] = await Promise.all([
    prisma.studentInstituteRecord.findMany({
      where: { instituteId, isVerified: true, membership: { status: "ACTIVE" } },
      include: { studentProfile: { include: { user: true } } },
    }),
    prisma.teacherInstituteRecord.findMany({
      where: { instituteId, isVerified: true, membership: { status: "ACTIVE" } },
      include: { teacherProfile: { include: { user: true } } },
    }),
  ]);

  const enrolledStudentIds = new Set(batch.studentMembers.map((s: { studentRecordId: string }) => s.studentRecordId));
  const enrolledTeacherIds = new Set(batch.teacherMembers.map((t: { teacherRecordId: string }) => t.teacherRecordId));

  const availableStudents = activeStudents.filter((s: { id: string }) => !enrolledStudentIds.has(s.id));
  const availableTeachers = activeTeachers.filter((t: { id: string }) => !enrolledTeacherIds.has(t.id));

  return (
    <div className="space-y-8">
      <div>
        <Link
          href={`/manager/${instituteId}/batches`}
          className="mb-4 inline-flex items-center text-sm text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="mr-1 size-4" /> Back to Batches
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">{batch.name} - Members</h1>
          <EditBatchModal instituteId={instituteId} batch={batch} />
        </div>
        <p className="mt-1 text-sm text-slate-500">
          Add or remove students and teachers for this batch.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Teachers */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
            <PackageOpen className="size-5 text-amber-500" /> Teachers ({batch.teacherMembers.length})
          </h2>
          
          <div className="mb-6 space-y-3">
            {batch.teacherMembers.length === 0 ? (
              <p className="text-sm text-slate-500 italic">No teachers assigned.</p>
            ) : (
              batch.teacherMembers.map((tm: any) => (
                <div key={tm.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <div>
                    <p className="font-semibold text-slate-900">{tm.teacherRecord.teacherProfile?.user?.name || "Unknown Teacher"}</p>
                    <p className="text-xs text-slate-500">{tm.teacherRecord.designation}</p>
                  </div>
                  <form action={async () => {
                    "use server";
                    const { removeBatchTeacher } = await import("../actions");
                    await removeBatchTeacher(instituteId, tm.id);
                  }}>
                    <button type="submit" className="rounded-lg border border-rose-200 bg-rose-50 p-1.5 text-rose-600 hover:bg-rose-100">
                      <UserMinus className="size-4" />
                    </button>
                  </form>
                </div>
              ))
            )}
          </div>

          <h3 className="mb-3 text-sm font-bold text-slate-700">Available Teachers</h3>
          <div className="max-h-60 space-y-2 overflow-y-auto">
            {availableTeachers.length === 0 ? (
              <p className="text-xs text-slate-400">All available teachers are in this batch.</p>
            ) : (
              availableTeachers.map((t: any) => (
                <div key={t.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-2 text-sm">
                  <span className="truncate">{t.teacherProfile?.user?.name || "Unknown Teacher"}</span>
                  <form action={async () => {
                    "use server";
                    const { addBatchTeacher } = await import("../actions");
                    await addBatchTeacher(instituteId, batchId, t.id);
                  }}>
                    <button type="submit" className="flex items-center gap-1 rounded bg-slate-900 px-2 py-1 text-xs font-semibold text-white hover:bg-slate-800">
                      <Plus className="size-3" /> Add
                    </button>
                  </form>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Students */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
            <Users className="size-5 text-blue-500" /> Students ({batch.studentMembers.length})
          </h2>
          
          <div className="mb-6 space-y-3">
            {batch.studentMembers.length === 0 ? (
              <p className="text-sm text-slate-500 italic">No students assigned.</p>
            ) : (
              batch.studentMembers.map((sm: any) => (
                <div key={sm.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <div>
                    <p className="font-semibold text-slate-900">{sm.studentRecord.studentProfile?.user?.name || "Unknown Student"}</p>
                    <p className="text-xs text-slate-500">{sm.studentRecord.courseName}</p>
                  </div>
                  <form action={async () => {
                    "use server";
                    const { removeBatchStudent } = await import("../actions");
                    await removeBatchStudent(instituteId, sm.id);
                  }}>
                    <button type="submit" className="rounded-lg border border-rose-200 bg-rose-50 p-1.5 text-rose-600 hover:bg-rose-100">
                      <UserMinus className="size-4" />
                    </button>
                  </form>
                </div>
              ))
            )}
          </div>

          <h3 className="mb-3 text-sm font-bold text-slate-700">Available Students</h3>
          <div className="max-h-60 space-y-2 overflow-y-auto">
            {availableStudents.length === 0 ? (
              <p className="text-xs text-slate-400">All available students are in this batch.</p>
            ) : (
              availableStudents.map((s: any) => (
                <div key={s.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-2 text-sm">
                  <span className="truncate">{s.studentProfile?.user?.name || "Unknown Student"}</span>
                  <form action={async () => {
                    "use server";
                    const { addBatchStudent } = await import("../actions");
                    await addBatchStudent(instituteId, batchId, s.id);
                  }}>
                    <button type="submit" className="flex items-center gap-1 rounded bg-slate-900 px-2 py-1 text-xs font-semibold text-white hover:bg-slate-800">
                      <Plus className="size-3" /> Add
                    </button>
                  </form>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
