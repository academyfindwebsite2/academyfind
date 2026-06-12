"use client"

import { Button } from "@/components/ui/button";
import { updateInstituteProfile } from "@/lib/User/manager/updateProfile";
import { Save, Lock, Check, MapPin, Image as ImageIcon, IndianRupee, Link as LinkIcon, UploadCloud, Map } from "lucide-react";
import { useState } from "react"
import toast from "react-hot-toast";
import VideoSettings from "./EditVideoLinks";
import Link from "next/link";
import { PLAN_LIMITS, PlanType } from "@/lib/plan_limits";
import EditTeachers from "./EditTeacherProfile";
import EditResultImages from "./EditResultImages";
import LocationAutocomplete from "@/components/admin/AdminLocationAutoComplete";

// 🚀 Apna component import karein (path check kar lena)


export default function EditProfileForm({
    institute, 
    allCategories 
}: {
    institute: any, 
    allCategories: {id: string, name: string}[] 
}){
    const [isLoading, setIsLoading] = useState(false);

    // Image Upload States
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>(institute.imageUrl || institute.logo || "");

    // Category States
    const initialCategories = institute.categories?.map((c: any) => c.categoryId || c.id) || [];
    const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategories);

    // 🚀 Location & Coordinate States
    const [address, setAddress] = useState(institute.address || "");
    const [latitude, setLatitude] = useState(institute.latitude?.toString() || "");
    const [longitude, setLongitude] = useState(institute.longitude?.toString() || "");
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
    

    // Category Toggle Handler
    const toggleCategory = (categoryId: string) => {
        setSelectedCategories((prev) => 
            prev.includes(categoryId) 
                ? prev.filter(id => id !== categoryId) 
                : [...prev, categoryId]
        );
    };

    // 🚀 Google Maps Se Location Aane Par State Update Handler
    const handleLocationSelect = (lat: number, lng: number, newAddress: string) => {
        setLatitude(lat.toString());
        setLongitude(lng.toString());
        setAddress(newAddress);
        toast.success("Location auto-filled from Google Maps!");
    };

    async function handleSubmit(formData: FormData){
        setIsLoading(true);
        
        formData.append("categories", JSON.stringify(selectedCategories));
        if (imageFile) {
            formData.append("imageFile", imageFile);
        }

        const result = await updateInstituteProfile(institute.id, formData);

        if(result.success){
            toast.success(result.message || "Successfully updated profile");
        } else {
            toast.error(result.error || "Can't update Profile, try again");
        }
        setIsLoading(false);
    }

    const limits = PLAN_LIMITS[institute.subscriptionPlan as PlanType] || PLAN_LIMITS.BASIC;
    if (institute.subscriptionPlan === "BASIC") {
        return (
            <div className="min-h-[500px] flex flex-col items-center justify-center text-center p-8 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                    <Lock className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Student Leads Locked</h2>
                <p className="text-slate-500 max-w-md mb-6">
                    Unlock direct student enquiries and lead generation. Upgrade to the <b>Verified, Premium  Plan</b> or <b>Featured </b>to see who is trying to contact your academy.
                </p>
                <Link href={`/manager/${institute.id}/subscription`} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition">
                    View Upgrade Plans
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* 🚀 MAIN FORM */}
            <form action={handleSubmit} className="space-y-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200">
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
                {/* ... (SECTION 1 & 2 SAME RAHENGE) ... */}
                <div>
                    <h3 className="text-lg font-bold text-slate-800 border-b pb-3 mb-5">Basic Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Institute Name *</label>
                            <input type="text" name="name" defaultValue={institute.name || ""} required className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Public Email</label>
                            <input type="email" name="email" defaultValue={institute.email || ""} className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Phone Number</label>
                            <input type="text" name="phone" defaultValue={institute.phone || ""} className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Website URL</label>
                            <div className="relative">
                                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input type="url" name="website" defaultValue={institute.website || ""} placeholder="https://..." className="w-full pl-9 p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-bold text-slate-800 border-b pb-3 mb-5">Media & Pricing</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Starting Fee Info</label>
                            <div className="relative">
                                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input type="text" name="feeInfo" defaultValue={institute.feeInfo || ""} placeholder="e.g. Starting from ₹5,000/month" className="w-full pl-9 p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                            </div>
                            <p className="text-xs text-slate-500">Give students an idea of your fee structure.</p>
                    </div>
                </div>
                    </div>
                {/* 🚀 SECTION 3: Location Details (UPDATED) */}
                <div>
                    <h3 className="text-lg font-bold text-slate-800 border-b pb-3 mb-5 flex items-center gap-2">
                        <Map className="w-5 h-5 text-blue-600" /> Location & Coordinates
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 border border-slate-200 p-6 rounded-2xl mb-6">
                        {/* 1. Google Places Search */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-bold text-slate-700">Search to Auto-fill Address & Coordinates</label>
                            {/* Aapka Autocomplete Component Yahan Hai */}
                            <div className="w-full [&>div]:w-full"> 
                                <LocationAutocomplete onLocationSelect={handleLocationSelect} />
                            </div>
                        </div>

                        {/* 2. Editable Address Box */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold text-slate-700">Full Address *</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                <textarea 
                                    name="address" 
                                    value={address} 
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                    rows={2}
                                    className="w-full pl-9 p-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                                />
                            </div>
                        </div>

                        {/* 3. Editable Latitude */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Latitude</label>
                            <input 
                                type="text" 
                                name="latitude" 
                                value={latitude}
                                onChange={(e) => setLatitude(e.target.value)}
                                placeholder="e.g. 28.6139"
                                className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                            />
                        </div>

                        {/* 4. Editable Longitude */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Longitude</label>
                            <input 
                                type="text" 
                                name="longitude" 
                                value={longitude}
                                onChange={(e) => setLongitude(e.target.value)}
                                placeholder="e.g. 77.2090"
                                className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold text-slate-700">Google Maps Share URL (Optional)</label>
                            <input 
                                type="url" 
                                name="googleMapsUrl" 
                                defaultValue={institute.googleMapsUrl || ""} 
                                placeholder="https://maps.app.goo.gl/..."
                                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* ... (SECTION 4 & 5 SAME RAHENGE) ... */}
                <div>
                    <h3 className="text-lg font-bold text-slate-800 border-b pb-3 mb-5">About</h3>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">About the Institute</label>
                        <textarea 
                            name="description" 
                            rows={4}
                            defaultValue={institute.description || ""} 
                            placeholder="Tell students about your courses, batches, and achievements..."
                            className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                        />
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-bold text-slate-800 border-b pb-3 mb-5">Categories</h3>
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-slate-700">Select applicable categories</label>
                        <div className="flex flex-wrap gap-2">
                            {allCategories?.map((cat) => {
                                const isSelected = selectedCategories.includes(cat.id);
                                return (
                                    <button
                                        type="button"
                                        key={cat.id}
                                        onClick={() => toggleCategory(cat.id)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-all flex items-center gap-2 ${
                                            isSelected 
                                                ? "bg-blue-50 border-blue-300 text-blue-700 shadow-sm" 
                                                : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                                        }`}
                                    >
                                        {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                                        {cat.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* SUBMIT */}
                <div className="flex justify-end pt-6 border-t border-slate-100">
                    <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl gap-2 px-8 py-6 font-bold text-base w-full sm:w-auto shadow-md"
                    >
                        {isLoading ? "Saving Details..." : <><Save className="w-5 h-5" /> Save Profile Details</>}
                    </Button>
                </div>
            </form>

            {/* EXTERNAL COMPONENTS */}
            {limits.maxVideos > 0 ? (
                <VideoSettings instituteId={institute.id} currentVideos={institute.youtubeVideos || []} maxLimit={limits.maxVideos} />
            ) : (
                <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-8 text-center flex flex-col items-center">
                    <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mb-3">
                        <Lock className="w-6 h-6 text-slate-500" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">YouTube Videos Locked</h3>
                    <p className="text-sm text-slate-500 max-w-md mt-1 mb-4">You are currently on the Free Listing plan. Upgrade your plan to showcase your academy's YouTube videos.</p>
                    <Link href={`/manager/${institute.id}/subscription`} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-semibold transition">
                        View Premium Plans
                    </Link>
                </div>
            )}
            
            <EditResultImages instituteId={institute.id} currentImages={institute.gallery || []} maxLimit={limits.maxResults} />
            <EditTeachers instituteId={institute.id} currentTeachers={institute.teachers || []} maxLimit={limits.maxTeachers} />
        </div>
    );
}