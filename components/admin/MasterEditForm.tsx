"use client";

import { useState } from "react";
import { updateInstituteByAdmin } from "@/lib/User/admin/adminMasterInstitute";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Save, AlertTriangle, ArrowLeft, Image as ImageIcon, UploadCloud } from "lucide-react";
import Link from "next/link";

// 🚀 IMPORT PORTFOLIO COMPONENTS
// (Note: In imports ka path apne folder structure ke hisaab se adjust kar lena)
import EditTeachers from "@/app/manager/[instituteId]/profile/edit/EditTeacherProfile";
import EditResultImages from "@/app/manager/[instituteId]/profile/edit/EditResultImages";
import EditVideoLinks from "@/app/manager/[instituteId]/profile/edit/EditVideoLinks";

export default function MasterEditForm({ 
    institute, 
    allCities, 
    allCategories,
    currentCategoryIds 
}: { 
    institute: any; 
    allCities: any[]; 
    allCategories: any[];
    currentCategoryIds: string[];
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState<string[]>(currentCategoryIds);

    // 📸 Image Preview & URL State
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>(institute.imageUrl || "");

    const showActualImage = imagePreview.includes("cloudinary.com") || imagePreview.startsWith("blob:");
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image too large. Max allowed limit is 5MB.");
            return;
        }

        setImageFile(file);
        setImagePreview(URL.createObjectURL(file)); // Generate instant fast preview
    };

    const handleCategoryToggle = (categoryId: string) => {
        if (selectedCategories.includes(categoryId)) {
            setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
        } else {
            setSelectedCategories([...selectedCategories, categoryId]);
        }
    };

    async function handleFormSubmit(formData: FormData) {
        setIsLoading(true);
        if (imageFile) {
            formData.append("imageFile", imageFile);
        }

        const result = await updateInstituteByAdmin(institute.id, formData, selectedCategories);
        if (result.success) toast.success(result.message || "sucessfully update institute data");
        else toast.error(result.error || "can't edit institute");
        setIsLoading(false);
    }

    return (
        // 🚀 WRAPPER DIV ADD KIYA HAI TAALI FORM ALAG RAHE AUR PORTFOLIO COMPONENTS ALAG
        <div className="space-y-12"> 
            
            {/* ---------------- MAIN ADMIN FORM ---------------- */}
            <form action={handleFormSubmit} className="space-y-8">
                <div className="p-4 bg-purple-50 border border-purple-100 rounded-2xl flex gap-3 text-sm text-purple-900">
                    <AlertTriangle className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                    <p><strong>Admin Controls Warning:</strong> Modifying details here bypasses manager confirmations. Altering slugs may break older student bookmark links.</p>
                </div>

                {/* 📸 SMART IMAGE MANAGEMENT PANEL SECTION */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                    <h3 className="font-bold text-slate-800 text-lg border-b pb-2 flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-purple-600" /> Main Display Image
                    </h3>
                    
                    <div className="flex flex-col items-center justify-center p-6 bg-white border border-slate-200 rounded-xl space-y-4">
                        <div className="w-full max-w-lg h-48 sm:h-64 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden relative shadow-inner p-4 text-center">
                            
                            {showActualImage ? (
                                <img src={imagePreview} alt="Institute Cover" className="w-full h-full object-cover absolute inset-0" />
                            ) : imagePreview ? (
                                <div className="flex flex-col items-center gap-3 text-slate-500 w-full">
                                    <ImageIcon className="w-8 h-8 text-slate-300" />
                                    <div className="text-sm font-semibold text-slate-700">Google Places / External Reference Stored</div>
                                    <div className="text-xs bg-white border border-slate-200 text-slate-500 px-3 py-2 rounded-lg w-full truncate font-mono select-all">
                                        {imagePreview}
                                    </div>
                                    <div className="text-[10px] text-slate-400">Preview disabled to prevent API billing. Upload a new image to replace.</div>
                                </div>
                            ) : (
                                <div className="text-sm text-slate-400 flex flex-col items-center gap-2">
                                    <ImageIcon className="w-8 h-8 text-slate-300"/> 
                                    <span>No Image Available</span>
                                </div>
                            )}

                        </div>

                        <label className="cursor-pointer bg-slate-900 hover:bg-purple-700 text-white text-sm px-6 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2">
                            <UploadCloud className="w-4 h-4" />
                            Change Cover Image
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </label>
                    </div>
                </div>

                {/* Core details mapping block */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                    <h3 className="font-bold text-slate-800 text-lg border-b pb-2">1. Core Metrics & Configurations</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Academy Name</label>
                            <input type="text" name="name" defaultValue={institute.name} required className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">URL Slug</label>
                            <input type="text" name="slug" defaultValue={institute.slug} required className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-sm font-mono text-slate-600" />
                        </div>
                    </div>
                </div>

                {/* City & Subscriptions */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-6">
                    <h3 className="font-bold text-slate-800 text-lg border-b pb-2">2. City & Subscription Levels</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Operational City</label>
                            <select name="cityId" defaultValue={institute.cityId} className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium outline-none">
                                {allCities.map(city => (
                                    <option key={city.id} value={city.id}>{city.name} ({city.state})</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Subscription Tier</label>
                            <select name="subscriptionPlan" defaultValue={institute.subscriptionPlan} className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-purple-700 outline-none">
                                <option value="BASIC">BASIC PLAN</option>
                                <option value="VERIFIED">VERIFIED PLAN</option>
                                <option value="PREMIUM">PREMIUM PLAN</option>
                                <option value="ULTRA">FEATURED (ULTRA) PLAN</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Categories */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                    <h3 className="font-bold text-slate-800 text-lg border-b pb-2">3. Tagged Categories (Add / Remove)</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2 max-h-[250px] overflow-y-auto p-2 border rounded-xl bg-white">
                        {allCategories.map(category => {
                            const isChecked = selectedCategories.includes(category.id);
                            return (
                                <label key={category.id} className={`flex items-center gap-2 p-2 rounded-xl border text-xs cursor-pointer select-none transition-all ${
                                    isChecked ? "border-purple-300 bg-purple-50/60 font-bold text-purple-900" : "border-slate-100 bg-slate-50 hover:bg-slate-100 text-slate-600"
                                }`}>
                                    <input type="checkbox" checked={isChecked} onChange={() => handleCategoryToggle(category.id)} className="accent-purple-600 size-3.5 shrink-0" />
                                    <span className="truncate">{category.name}</span>
                                </label>
                            )
                        })}
                    </div>
                </div>

                {/* Meta flags segment */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                    <h3 className="font-bold text-slate-800 text-lg border-b pb-2">4. Meta Flags & Map Geo-coordinates</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 mb-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 block">Verification Status</label>
                            <select name="isVerified" defaultValue={String(institute.isVerified)} className="p-2 border rounded-lg text-xs bg-white">
                                <option value="true">Verified Badge (True)</option>
                                <option value="false">Unverified (False)</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 block">Featured Listing</label>
                            <select name="isFeatured" defaultValue={String(institute.isFeatured)} className="p-2 border rounded-lg text-xs bg-white">
                                <option value="true">Featured (True)</option>
                                <option value="false">Standard (False)</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 block">Platform Visibility</label>
                            <select name="isActive" defaultValue={String(institute.isActive)} className="p-2 border rounded-lg text-xs bg-white">
                                <option value="true">Active/Live (True)</option>
                                <option value="false">Hidden (False)</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500">Latitude</label>
                            <input type="number" step="any" name="latitude" defaultValue={institute.latitude || ""} className="w-full p-2 border rounded-lg text-xs" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500">Longitude</label>
                            <input type="number" step="any" name="longitude" defaultValue={institute.longitude || ""} className="w-full p-2 border rounded-lg text-xs" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500">Google Rating Override</label>
                            <input type="number" step="any" name="googleRating" defaultValue={institute.googleRating || ""} className="w-full p-2 border rounded-lg text-xs" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500">Google Reviews Count</label>
                            <input type="number" name="googleReviewCount" defaultValue={institute.googleReviewCount || ""} className="w-full p-2 border rounded-lg text-xs" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 pt-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Google Maps URL</label>
                            <input type="text" name="googleMapsUrl" defaultValue={institute.googleMapsUrl || ""} className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-mono" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Public Address Location</label>
                            <input type="text" name="address" defaultValue={institute.address} required className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-sm" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Long Description Summary</label>
                            <textarea name="description" rows={4} defaultValue={institute.description || ""} className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-sm resize-none" />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between border-t pt-6">
                    <Link href="/admin/institutes" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Return to List
                    </Link>
                    <Button type="submit" disabled={isLoading} className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl gap-2 px-8 font-bold shadow-md">
                        {isLoading ? "Saving Configurations..." : <><Save className="w-4 h-4" /> Save Master Overrides</>}
                    </Button>
                </div>
            </form>

            {/* ---------------- PORTFOLIO SECTIONS (OUTSIDE MAIN FORM) ---------------- */}
            <div className="pt-8 border-t-2 border-dashed border-slate-200 space-y-8">
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
                    <h3 className="font-bold text-emerald-900 text-lg mb-1">Portfolio & Media Management</h3>
                    <p className="text-sm text-emerald-700">Since you are an admin, plan limits are bypassed here. Edits save instantly.</p>
                </div>

                {/* 1. TEACHERS */}
                <EditTeachers 
                    instituteId={institute.id} 
                    currentTeachers={institute.teachers || []} 
                    maxLimit={999} // 🚀 Admin has no limits
                />

                {/* 2. RESULT IMAGES */}
                <EditResultImages 
                    instituteId={institute.id} 
                    currentImages={institute.gallery || []} 
                    maxLimit={999} // 🚀 Admin has no limits
                />

                {/* 3. YOUTUBE VIDEOS */}
                <EditVideoLinks 
                    instituteId={institute.id} 
                    currentVideos={institute.youtubeVideos || []} 
                    maxLimit={999} // 🚀 Admin has no limits
                />
            </div>
        </div>
    );
}