"use client"

import { useState } from "react";
import { addTeacher, removeTeacher } from "@/lib/User/manager/update-teacher-profile";
import { Lock, Users, Trash2, Plus, UploadCloud, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function EditTeachers({ 
    instituteId, 
    currentTeachers, 
    maxLimit 
}: { 
    instituteId: string; 
    currentTeachers: any[]; 
    maxLimit: number;
}) {
    const [isUploading, setIsUploading] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [teacherImg, setTeacherImg] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const isLimitReached = currentTeachers.length >= maxLimit;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file)); // Local preview
        }
    };
    // ☁️ Cloudinary Upload for Teacher Photo
    const handleAddTeacher = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Browser ka default behavior roko
        setIsUploading(true);

        const formData = new FormData(e.currentTarget); // Form ka fresh data nikaalo
        if (selectedFile) {
            formData.append("imageFile", selectedFile);
        }
        
        const result = await addTeacher(instituteId, formData);
        
        if (result.success) {
            toast.success(result.message || "");
            setIsAdding(false);
            setSelectedFile(null);
            setPreviewUrl(null);
        } else {
            toast.error(result.error || "");
        }
        setIsUploading(false);
    };


    const handleDelete = async (id: string) => {
        if (!confirm("Remove this teacher?")) return;
        const result = await removeTeacher(id, instituteId);
        if (result.success) toast.success("Teacher removed.");
        else toast.error("Failed to remove.");
    };

    // 🔒 LOCKED STATE (For Free Plan)
    if (maxLimit === 0) {
        return (
            <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-8 text-center flex flex-col items-center">
                <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mb-3">
                    <Lock className="w-6 h-6 text-slate-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Faculty Profiles Locked</h3>
                <p className="text-sm text-slate-500 max-w-md mt-1 mb-4">Upgrade your plan to showcase your experienced teachers to students.</p>
                <Link href={`/manager/${instituteId}/upgrade`} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-semibold transition">View Plans</Link>
            </div>
        );
    }

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Users className="w-5 h-5 text-emerald-500" /> Faculty / Teachers
                    </h3>
                    <p className="text-sm text-slate-500">Added: {currentTeachers.length} / {maxLimit}</p>
                </div>
                
                {isLimitReached ? (
                    <Link href={`/manager/${instituteId}/upgrade`} className="bg-amber-100 text-amber-700 hover:bg-amber-200 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5" /> Upgrade for more
                    </Link>
                ) : (
                    <button onClick={() => setIsAdding(!isAdding)} className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition">
                        {isAdding ? "Cancel" : <><Plus className="w-4 h-4" /> Add Teacher</>}
                    </button>
                )}
            </div>

            {/* ADD TEACHER FORM (Conditionally Rendered) */}
            {isAdding && !isLimitReached && (
                <form onSubmit={handleAddTeacher} className="bg-slate-50 p-5 rounded-xl border border-slate-200 mb-6 space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                        {/* Photo Upload Area */}
                       <div className="shrink-0 w-24 h-24 rounded-full border-2 border-dashed border-slate-300 bg-white flex items-center justify-center overflow-hidden relative group">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <UploadCloud className="w-6 h-6 text-slate-400 group-hover:text-emerald-500 transition" />
                            )}
                            <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" disabled={isUploading} />
                        </div>
                        
                        {/* Details Area */}
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                            <input type="text" name="name" required placeholder="Teacher Name *" className="p-2.5 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
                            <input type="text" name="subject" placeholder="Subject (e.g. Mathematics)" className="p-2.5 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
                            <input type="text" name="experience" placeholder="Experience (e.g. 10 Years)" className="p-2.5 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-emerald-500 sm:col-span-2" />
                        </div>
                    </div>
                    <div className="flex justify-end pt-2">
                        <button type="submit" disabled={isUploading} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 disabled:opacity-50">
                            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Teacher"}
                        </button>
                    </div>
                </form>
            )}

            {/* TEACHERS LIST */}
            {currentTeachers.length === 0 ? (
                <div className="text-center p-6 border border-dashed rounded-xl text-slate-400 text-sm">No teachers added yet.</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {currentTeachers.map((teacher: any) => (
                        <div key={teacher.id} className="flex items-center gap-4 p-3 border border-slate-100 bg-slate-50 rounded-xl">
                            <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden shrink-0">
                                {teacher.imageUrl ? <img src={teacher.imageUrl} className="w-full h-full object-cover" /> : <Users className="w-6 h-6 m-3 text-slate-400" />}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <h4 className="font-bold text-slate-800 text-sm truncate">{teacher.name}</h4>
                                <p className="text-xs text-slate-500 truncate">{teacher.subject} • {teacher.experience}</p>
                            </div>
                            <button onClick={() => handleDelete(teacher.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}