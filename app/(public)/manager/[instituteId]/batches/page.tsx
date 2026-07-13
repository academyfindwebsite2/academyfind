import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Clock, IndianRupee, PackageOpen, Users } from "lucide-react";
import { PremiumLock } from "@/components/manager/PremiumLock";

import { createBatch, toggleBatchActive } from "./actions";

type Props = { params: Promise<{ instituteId: string }> };

export default async function ManagerBatchesPage({ params }: Props) {
  const { instituteId } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const institute = await prisma.institute.findUnique({
    where: { id: instituteId },
    select: { id: true, name: true, subscriptionPlan: true },
  });
  if (!institute) notFound();

  const batches = await prisma.instituteBatch.findMany({
    where: { instituteId },
    orderBy: [{ isActive: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      name: true,
      courseName: true,
      mode: true,
      duration: true,
      timing: true,
      fee: true,
      originalFee: true,
      seatsTotal: true,
      seatsLeft: true,
      batchType: true,
      academicYear: true,
      isActive: true,
      createdAt: true,
      _count: {
        select: { studentMembers: true, teacherMembers: true },
      },
    },
  });

  const createBatchFn = createBatch.bind(null, instituteId);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Batches</h1>
          <p className="mt-1 text-sm text-stone-500">
            Manage courses and batches for {institute.name}.
          </p>
        </div>
      </div>

      {/* Add Batch Form */}
      {(institute.subscriptionPlan === "BASIC" || institute.subscriptionPlan === "VERIFIED") ? (
        <PremiumLock
          title="Batch Creation Locked"
          description="Upgrade to Premium or Elite to create and manage batches."
          instituteId={institute.id}
        />
      ) : (
        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-bold text-stone-900">
            Create New Batch
          </h2>
          <form action={createBatchFn} className="grid gap-4 sm:grid-cols-2">
            <FieldGroup>
              <Label>Batch Name *</Label>
              <Input name="name" placeholder="e.g. JEE 2025 – Morning Batch" required />
            </FieldGroup>
            <FieldGroup>
              <Label>Course Name</Label>
              <Input name="courseName" placeholder="e.g. JEE Advanced" />
            </FieldGroup>
            <FieldGroup>
              <Label>Mode</Label>
              <select name="mode" className={INPUT_CLASS}>
                <option value="OFFLINE">Offline</option>
                <option value="ONLINE">Online</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </FieldGroup>
            <FieldGroup>
              <Label>Academic Year</Label>
              <Input name="academicYear" placeholder="e.g. 2024-25" />
            </FieldGroup>
            <FieldGroup>
              <Label>Duration</Label>
              <Input name="duration" placeholder="e.g. 12 months" />
            </FieldGroup>
            <FieldGroup>
              <Label>Timing</Label>
              <Input name="timing" placeholder="e.g. Mon–Fri 7–9 AM" />
            </FieldGroup>
            <FieldGroup>
              <Label>Fee (₹)</Label>
              <Input name="fee" type="number" placeholder="50000" />
            </FieldGroup>
            <FieldGroup>
              <Label>Total Seats</Label>
              <Input name="seatsTotal" type="number" placeholder="40" />
            </FieldGroup>
            <FieldGroup className="sm:col-span-2">
              <Label>Description</Label>
              <textarea
                name="description"
                rows={2}
                placeholder="Brief description of this batch..."
                className={INPUT_CLASS}
              />
            </FieldGroup>
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="rounded-xl bg-amber-600 px-6 py-2.5 font-bold text-white hover:bg-amber-700"
              >
                Create Batch
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Batch list */}
      <section>
        <h2 className="mb-4 text-lg font-bold text-stone-800">
          All Batches ({batches.length})
        </h2>
        {batches.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-300 p-10 text-center text-sm text-stone-400">
            No batches yet. Create your first batch above.
          </div>
        ) : (
          <div className="space-y-4">
            {batches.map((batch: any) => {
              const seatsPercent =
                batch.seatsTotal && batch.seatsLeft !== null
                  ? Math.round(
                    ((batch.seatsTotal - (batch.seatsLeft ?? 0)) /
                      batch.seatsTotal) *
                    100,
                  )
                  : null;

              return (
                <div
                  key={batch.id}
                  className={`rounded-2xl border bg-white p-5 shadow-sm ${batch.isActive
                    ? "border-stone-200"
                    : "border-stone-100 opacity-60"
                    }`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-stone-900">{batch.name}</h3>
                        <span className="rounded-md bg-stone-100 px-1.5 py-0.5 text-[10px] font-bold text-stone-600 uppercase">
                          {batch.mode}
                        </span>
                        {!batch.isActive && (
                          <span className="rounded-md bg-stone-200 px-1.5 py-0.5 text-[10px] font-bold text-stone-400 uppercase">
                            Inactive
                          </span>
                        )}
                      </div>
                      {batch.courseName && (
                        <p className="mt-0.5 text-sm text-amber-700 font-medium">
                          {batch.courseName}
                        </p>
                      )}
                      <div className="mt-2 flex flex-wrap gap-4 text-sm text-stone-500">
                        {batch.duration && (
                          <span className="flex items-center gap-1">
                            <Clock className="size-3.5" /> {batch.duration}
                          </span>
                        )}
                        {batch.fee && (
                          <span className="flex items-center gap-1 font-medium text-stone-700">
                            <IndianRupee className="size-3.5" />
                            {batch.fee.toLocaleString("en-IN")}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Users className="size-3.5" />
                          {batch._count.studentMembers} students
                        </span>
                        <span className="flex items-center gap-1">
                          <PackageOpen className="size-3.5" />
                          {batch._count.teacherMembers} teachers
                        </span>
                      </div>

                      {/* Seat progress */}
                      {batch.seatsTotal && seatsPercent !== null && (
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-stone-400">
                            <span>
                              {batch.seatsTotal - (batch.seatsLeft ?? 0)} /{" "}
                              {batch.seatsTotal} seats filled
                            </span>
                            <span>{seatsPercent}%</span>
                          </div>
                          <div className="mt-1 h-2 overflow-hidden rounded-full bg-stone-100">
                            <div
                              className={`h-full rounded-full ${seatsPercent >= 90
                                ? "bg-rose-500"
                                : seatsPercent >= 70
                                  ? "bg-amber-500"
                                  : "bg-emerald-500"
                                }`}
                              style={{ width: `${seatsPercent}%` }}
                            />
                          </div>
                          {batch.seatsLeft === 0 && (
                            <p className="mt-1 text-xs font-bold text-rose-600">
                              🔴 Batch Full
                            </p>
                          )}
                          {batch.seatsLeft !== null &&
                            batch.seatsLeft > 0 &&
                            batch.seatsLeft <= 5 && (
                              <p className="mt-1 text-xs font-bold text-amber-600">
                                ⚠ Only {batch.seatsLeft} seats left!
                              </p>
                            )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 gap-2">
                      <form
                        action={async () => {
                          "use server";
                          const { toggleBatchActive } = await import("./actions");
                          await toggleBatchActive(batch.id, instituteId, !batch.isActive);
                        }}
                      >
                        <button
                          type="submit"
                          className={`rounded-xl border px-3 py-2 text-xs font-semibold ${batch.isActive
                            ? "border-stone-200 text-stone-600 hover:bg-stone-50"
                            : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            }`}
                        >
                          {batch.isActive ? "Deactivate" : "Activate"}
                        </button>
                      </form>

                      <Link
                        href={`/manager/${instituteId}/batches/${batch.id}`}
                        className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs font-bold text-stone-700 hover:bg-stone-100"
                      >
                        Manage Members
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

const INPUT_CLASS =
  "w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400";

function Input({
  name,
  placeholder,
  type = "text",
  required,
}: {
  name: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      required={required}
      className={INPUT_CLASS}
    />
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1.5 block text-sm font-semibold text-stone-700">
      {children}
    </label>
  );
}

function FieldGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}
