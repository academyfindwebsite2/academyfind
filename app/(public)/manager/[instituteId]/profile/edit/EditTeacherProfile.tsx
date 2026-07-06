"use client"

import { useState } from "react";
import { addTeacherByEmail, removeTeacherMembership } from "@/lib/User/manager/update-teacher-profile";
import { Lock, Users, Trash2, Plus, Loader2, Mail } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";

interface TeacherEntry {
  membershipId: string;
  designation?: string | null;
  department?: string | null;
  teachingSubjects: string[];
  user: {
    name: string | null;
    image: string | null;
    email: string;
  };
}

export default function EditTeachers({
  instituteId,
  currentTeachers,
  maxLimit,
}: {
  instituteId: string;
  currentTeachers: TeacherEntry[];
  maxLimit: number;
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isLimitReached = currentTeachers.length >= maxLimit;

  const handleAddTeacher = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await addTeacherByEmail(instituteId, formData);
    if (result.success) {
      toast.success(result.message || "Teacher added!");
      setIsAdding(false);
      (e.target as HTMLFormElement).reset();
    } else {
      toast.error(result.error || "Failed to add teacher.");
    }
    setIsLoading(false);
  };

  const handleDelete = async (membershipId: string) => {
    if (!confirm("Remove this teacher from the institute?")) return;
    const result = await removeTeacherMembership(membershipId, instituteId);
    if (result.success) toast.success("Teacher removed.");
    else toast.error(result.error || "Failed to remove.");
  };

  if (maxLimit === 0) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-200">
          <Lock className="h-6 w-6 text-slate-500" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">Faculty Profiles Locked</h3>
        <p className="mb-4 mt-1 max-w-md text-sm text-slate-500">
          Upgrade your plan to showcase your experienced teachers.
        </p>
        <Link
          href={`/manager/${instituteId}/subscription`}
          className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          View Plans
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800">
            <Users className="h-5 w-5 text-emerald-500" /> Faculty / Teachers
          </h3>
          <p className="text-sm text-slate-500">
            Added: {currentTeachers.length} / {maxLimit}
          </p>
        </div>
        {isLimitReached ? (
          <Link
            href={`/manager/${instituteId}/subscription`}
            className="flex items-center gap-1.5 rounded-lg bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-700 hover:bg-amber-200"
          >
            <Lock className="h-3.5 w-3.5" /> Upgrade for more
          </Link>
        ) : (
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            {isAdding ? "Cancel" : <><Plus className="h-4 w-4" /> Add Teacher</>}
          </button>
        )}
      </div>

      {/* ADD TEACHER FORM */}
      {isAdding && !isLimitReached && (
        <form
          onSubmit={handleAddTeacher}
          className="mb-6 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-5"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Invite by registered email
          </p>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 shrink-0 text-slate-400" />
            <input
              type="email"
              name="email"
              required
              placeholder="teacher@example.com"
              className="flex-1 rounded-lg border p-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              type="text"
              name="designation"
              placeholder="Designation (e.g. Senior Faculty)"
              className="rounded-lg border p-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="text"
              name="department"
              placeholder="Department (e.g. Mathematics)"
              className="rounded-lg border p-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="text"
              name="subjects"
              placeholder="Subjects (comma separated)"
              className="rounded-lg border p-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500 sm:col-span-2"
            />
          </div>
          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add Teacher"}
            </button>
          </div>
        </form>
      )}

      {/* TEACHERS LIST */}
      {currentTeachers.length === 0 ? (
        <div className="rounded-xl border border-dashed p-6 text-center text-sm text-slate-400">
          No teachers added yet. Invite them by email above.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {currentTeachers.map((teacher) => (
            <div
              key={teacher.membershipId}
              className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3"
            >
              <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full bg-slate-200">
                {teacher.user.image ? (
                  <Image
                    src={teacher.user.image}
                    alt={teacher.user.name ?? ""}
                    width={44}
                    height={44}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-lg font-bold text-slate-500">
                    {teacher.user.name?.charAt(0)?.toUpperCase() ?? "T"}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-slate-800">
                  {teacher.user.name ?? teacher.user.email}
                </p>
                <p className="truncate text-xs text-slate-500">
                  {[teacher.designation, teacher.department].filter(Boolean).join(" · ") ||
                    teacher.teachingSubjects.slice(0, 2).join(", ") ||
                    teacher.user.email}
                </p>
              </div>
              <button
                onClick={() => handleDelete(teacher.membershipId)}
                className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}