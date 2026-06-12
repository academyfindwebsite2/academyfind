"use client"

import { Button } from "@/components/ui/button";
import { updateInstituteProfile } from "@/lib/User/manager/updateProfile";
import { Save, Lock, Check, MapPin, Image as ImageIcon, IndianRupee, Link as LinkIcon, UploadCloud, Map, Video, Users, Trophy, ShieldCheck, UsersRound } from "lucide-react";
import { useState } from "react"
import toast from "react-hot-toast";
import VideoSettings from "./EditVideoLinks";
import Link from "next/link";
import { PLAN_LIMITS, PlanType } from "@/lib/plan_limits";
import EditTeachers from "./EditTeacherProfile";
import EditResultImages from "./EditResultImages";
import LocationAutocomplete from "@/components/admin/AdminLocationAutoComplete";
import { FaFacebook, FaInstagram, FaLinkedin, FaTelegram, FaTwitter, FaWhatsapp, FaYoutube } from "react-icons/fa";
import ClassroomImages from "./EditClassroomImages";

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

    // Location & Coordinate States
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
        setImagePreview(URL.createObjectURL(file)); 
    };
    
    const toggleCategory = (categoryId: string) => {
        setSelectedCategories((prev) => 
            prev.includes(categoryId) 
                ? prev.filter(id => id !== categoryId) 
                : [...prev, categoryId]
        );
    };

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
    const isPremiumOrUltra = institute.subscriptionPlan === "PREMIUM" || institute.subscriptionPlan === "ULTRA";

    // =======================================================
    // 🚨 1. FULL PAGE LOCK FOR "BASIC" (FREE) PLAN
    // =======================================================
    if (institute.subscriptionPlan === "BASIC" || !institute.subscriptionPlan) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8 bg-white rounded-3xl border border-slate-200 shadow-sm max-w-3xl mx-auto">
                <div className="w-20 h-20 bg-slate-50 border border-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-6 shadow-inner">
                    <Lock className="w-10 h-10" />
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-3">Profile Editing is Locked</h2>
                <p className="text-slate-500 max-w-md mb-8 text-sm md:text-base leading-relaxed">
                    You are currently on the <b>Free (Basic)</b> tier. To take control of this listing, update details, and start receiving student leads, please verify your academy.
                </p>
                <Link href={`/manager/${institute.id}/subscription`} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl font-bold transition shadow-lg shadow-blue-600/20 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5" /> Verify Academy Now
                </Link>
            </div>
        );
    }

    // =======================================================
    // ✅ 2. FORM FOR VERIFIED, PREMIUM & ULTRA PLANS
    // =======================================================
    return (
        <div className="space-y-10 max-w-5xl mx-auto pb-16">
            
            {/* 🚀 MAIN FORM: Accessible to VERIFIED, PREMIUM, ULTRA */}
            <form action={handleSubmit} className="space-y-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200">
                
                {/* Image Upload */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
                    <h3 className="font-bold text-slate-800 text-base border-b pb-2 flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-purple-600" /> Main Display Image
                    </h3>
                    
                    <div className="flex flex-col items-center justify-center p-4 bg-white border border-slate-200 rounded-xl space-y-4">
                        <div className="w-full max-w-lg h-44 sm:h-56 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden relative shadow-inner p-4 text-center">
                            {showActualImage ? (
                                <img src={imagePreview} alt="Institute Cover" className="w-full h-full object-cover absolute inset-0" />
                            ) : imagePreview ? (
                                <div className="flex flex-col items-center gap-2 text-slate-500 w-full">
                                    <ImageIcon className="w-6 h-6 text-slate-300" />
                                    <div className="text-xs font-semibold text-slate-700">External Reference Stored</div>
                                    <div className="text-[10px] bg-white border border-slate-200 text-slate-500 px-2 py-1 rounded-md w-full truncate font-mono select-all">
                                        {imagePreview}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-xs text-slate-400 flex flex-col items-center gap-1">
                                    <ImageIcon className="w-6 h-6 text-slate-300"/> 
                                    <span>No Image Available</span>
                                </div>
                            )}
                        </div>

                        <label className="cursor-pointer bg-slate-900 hover:bg-purple-700 text-white text-xs px-5 py-2 rounded-xl font-semibold transition-all flex items-center gap-2">
                            <UploadCloud className="w-3.5 h-3.5" />
                            Change Cover Image
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </label>
                    </div>
                </div>

                {/* Basic Details */}
                <div>
                    <h3 className="text-base font-bold text-slate-800 border-b pb-2 mb-4">Basic Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Institute Name *</label>
                            <input type="text" name="name" defaultValue={institute.name || ""} required className="w-full p-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Public Email</label>
                            <input type="email" name="email" defaultValue={institute.email || ""} className="w-full p-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Phone Number</label>
                            <input type="text" name="phone" defaultValue={institute.phone || ""} className="w-full p-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Website URL</label>
                            <div className="relative">
                                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                                <input type="url" name="website" defaultValue={institute.website || ""} placeholder="https://..." className="w-full pl-9 p-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Media & Pricing */}
                <div>
                    <h3 className="text-base font-bold text-slate-800 border-b pb-2 mb-4">Pricing Info</h3>
                    <div className="space-y-1.5 max-w-md">
                        <label className="text-xs font-semibold text-slate-600">Starting Fee Info</label>
                        <div className="relative">
                            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                            <input type="text" name="feeInfo" defaultValue={institute.feeInfo || ""} placeholder="e.g. Starting from ₹5,000/month" className="w-full pl-9 p-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                        </div>
                    </div>
                </div>

                {/* Location & Coordinates */}
                <div>
                    <h3 className="text-base font-bold text-slate-800 border-b pb-2 mb-4 flex items-center gap-1.5">
                        <Map className="w-4 h-4 text-blue-600" /> Location & Coordinates
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 border border-slate-200 p-5 rounded-2xl mb-4">
                        <div className="space-y-1.5 md:col-span-2">
                            <label className="text-xs font-bold text-slate-600">Search to Auto-fill Address & Coordinates</label>
                            <div className="w-full [&>div]:w-full"> 
                                <LocationAutocomplete onLocationSelect={handleLocationSelect} />
                            </div>
                        </div>

                        <div className="space-y-1.5 md:col-span-2">
                            <label className="text-xs font-semibold text-slate-600">Full Address *</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 w-3.5 h-3.5 text-slate-400" />
                                <textarea 
                                    name="address" 
                                    value={address} 
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                    rows={2}
                                    className="w-full pl-9 p-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Latitude</label>
                            <input type="text" name="latitude" value={latitude} onChange={(e) => setLatitude(e.target.value)} placeholder="e.g. 28.6139" className="w-full p-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none font-mono" />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Longitude</label>
                            <input type="text" name="longitude" value={longitude} onChange={(e) => setLongitude(e.target.value)} placeholder="e.g. 77.2090" className="w-full p-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none font-mono" />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600">Google Maps Share URL (Optional)</label>
                        <input type="url" name="googleMapsUrl" defaultValue={institute.googleMapsUrl || ""} placeholder="https://maps.google.com/..." className="w-full p-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                    </div>
                </div>

                {/* About */}
                <div>
                    <h3 className="text-base font-bold text-slate-800 border-b pb-2 mb-4">About</h3>
                    <div className="space-y-1.5">
                        <textarea name="description" rows={4} defaultValue={institute.description || ""} placeholder="Tell students about your courses, batches, and achievements..." className="w-full p-3 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none" />
                    </div>
                </div>

                {/* Categories */}
                <div>
                    <h3 className="text-base font-bold text-slate-800 border-b pb-2 mb-4">Categories</h3>
                    <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                            {allCategories?.map((cat) => {
                                const isSelected = selectedCategories.includes(cat.id);
                                return (
                                    <button
                                        type="button"
                                        key={cat.id}
                                        onClick={() => toggleCategory(cat.id)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5 ${
                                            isSelected 
                                                ? "bg-blue-50 border-blue-300 text-blue-700 shadow-sm" 
                                                : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                                        }`}
                                    >
                                        {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                                        {cat.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="text-base font-bold text-slate-800 border-b pb-2 mb-4">Social Media Presence</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Whatsapp URL</label>
                            <div className="relative">
                                <FaWhatsapp className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-400" />
                                <input type="url" name="whatsappUrl" defaultValue={institute.whatsappUrl || ""} placeholder="https://wa.me..." className="w-full pl-9 p-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-400 outline-none transition-all" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Instagram Profile URL</label>
                            <div className="relative">
                                <FaInstagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-600" />
                                <input type="url" name="instagramUrl" defaultValue={institute.instagramUrl || ""} placeholder="https://instagram.com/..." className="w-full pl-9 p-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-pink-500 outline-none transition-all" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Facebook Page URL</label>
                            <div className="relative">
                                <FaFacebook className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-600" />
                                <input type="url" name="facebookUrl" defaultValue={institute.facebookUrl || ""} placeholder="https://facebook.com/..." className="w-full pl-9 p-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">YouTube Channel URL</label>
                            <div className="relative">
                                <FaYoutube className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-600" />
                                <input type="url" name="youtubeUrl" defaultValue={institute.youtubeUrl || ""} placeholder="https://youtube.com/@..." className="w-full pl-9 p-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 outline-none transition-all" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">X (Twitter) URL</label>
                            <div className="relative">
                                <FaTwitter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
                                <input type="url" name="twitterUrl" defaultValue={institute.twitterUrl || ""} placeholder="https://twitter.com/..." className="w-full pl-9 p-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-400 outline-none transition-all" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Linkedin URL</label>
                            <div className="relative">
                                <FaLinkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-600" />
                                <input type="url" name="linkedinUrl" defaultValue={institute.linkedinUrl || ""} placeholder="https://linkedin.com/..." className="w-full pl-9 p-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-400 outline-none transition-all" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Telegram URL</label>
                            <div className="relative">
                                <FaTelegram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
                                <input type="url" name="twitterUrl" defaultValue={institute.telegramUrl || ""} placeholder="https://t.me..." className="w-full pl-9 p-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-400 outline-none transition-all" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* SUBMIT BUTTON */}
                <div className="flex justify-end pt-4 border-t border-slate-100">
                    <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl gap-2 px-6 shadow-sm">
                        {isLoading ? "Saving Details..." : <><Save className="w-4 h-4" /> Save Profile Details</>}
                    </Button>
                </div>
            </form>

            {/* ======================================================= */}
            {/* 🚨 3. CONDITIONAL PREMIUM/ULTRA FEATURES SECTIONS        */}
            {/* ======================================================= */}

            {/* YouTube Videos Component */}
            {isPremiumOrUltra ? (
                <VideoSettings instituteId={institute.id} currentVideos={institute.youtubeVideos || []} maxLimit={limits.maxVideos} />
            ) : (
                <div className="bg-slate-50/60 border border-dashed border-slate-200 rounded-3xl p-6 text-center flex flex-col items-center shadow-inner">
                    <div className="w-10 h-10 bg-white border border-slate-100 rounded-full flex items-center justify-center mb-3 shadow-sm text-slate-400">
                        <Lock className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                        <Video className="w-4 h-4 text-red-500" /> YouTube Video Integration Locked
                    </h3>
                    <p className="text-xs text-slate-500 max-w-sm mt-1 mb-3">
                        Showcase your classroom dynamic and video lectures directly on your public profile page.
                    </p>
                    <Link href={`/manager/${institute.id}/subscription`} className="bg-slate-900 hover:bg-blue-600 text-white text-xs px-4 py-2 rounded-xl font-medium transition shadow-sm">
                        Upgrade to Premium
                    </Link>
                </div>
            )}

            {isPremiumOrUltra ? (
                <ClassroomImages instituteId={institute.id} currentImages={institute.classroomImages || []} maxLimit={limits.maxClassroom} />
            ) : (
                <div className="bg-slate-50/60 border border-dashed border-slate-200 rounded-3xl p-6 text-center flex flex-col items-center shadow-inner">
                    <div className="w-10 h-10 bg-white border border-slate-100 rounded-full flex items-center justify-center mb-3 shadow-sm text-slate-400">
                        <Lock className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                        <UsersRound  className="w-4 h-4 text-amber-500" /> Classroom Images Locked
                    </h3>
                    <p className="text-xs text-slate-500 max-w-sm mt-1 mb-3">
                        Showcase your classroom images directly on your public profile page.
                    </p>
                    <Link href={`/manager/${institute.id}/subscription`} className="bg-slate-900 hover:bg-blue-600 text-white text-xs px-4 py-2 rounded-xl font-medium transition shadow-sm">
                        Upgrade to Premium
                    </Link>
                </div>
            )}
            
            {/* Results Gallery Component */}
            {isPremiumOrUltra ? (
                <EditResultImages instituteId={institute.id} currentImages={institute.gallery || []} maxLimit={limits.maxResults} />
            ) : (
                <div className="bg-slate-50/60 border border-dashed border-slate-200 rounded-3xl p-6 text-center flex flex-col items-center shadow-inner">
                    <div className="w-10 h-10 bg-white border border-slate-100 rounded-full flex items-center justify-center mb-3 shadow-sm text-slate-400">
                        <Lock className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-amber-500" /> Toppers & Results Gallery Locked
                    </h3>
                    <p className="text-xs text-slate-500 max-w-sm mt-1 mb-3">
                        Publish images of top-ranking students, batch results, and milestone banners to build trust.
                    </p>
                    <Link href={`/manager/${institute.id}/subscription`} className="bg-slate-900 hover:bg-blue-600 text-white text-xs px-4 py-2 rounded-xl font-medium transition shadow-sm">
                        Upgrade to Premium
                    </Link>
                </div>
            )}

            {/* Teacher Profiles Component */}
            {isPremiumOrUltra ? (
                <EditTeachers instituteId={institute.id} currentTeachers={institute.teachers || []} maxLimit={limits.maxTeachers} />
            ) : (
                <div className="bg-slate-50/60 border border-dashed border-slate-200 rounded-3xl p-6 text-center flex flex-col items-center shadow-inner">
                    <div className="w-10 h-10 bg-white border border-slate-100 rounded-full flex items-center justify-center mb-3 shadow-sm text-slate-400">
                        <Lock className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                        <Users className="w-4 h-4 text-emerald-500" /> Faculty Profiles Locked
                    </h3>
                    <p className="text-xs text-slate-500 max-w-sm mt-1 mb-3">
                        Introduce your experienced faculty members, their qualifications, and subjects taught.
                    </p>
                    <Link href={`/manager/${institute.id}/subscription`} className="bg-slate-900 hover:bg-blue-600 text-white text-xs px-4 py-2 rounded-xl font-medium transition shadow-sm">
                        Upgrade to Premium
                    </Link>
                </div>
            )}
        </div>
    );
}