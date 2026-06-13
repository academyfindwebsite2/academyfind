"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; 
import toast from "react-hot-toast";
import { Save, Image as ImageIcon, UploadCloud, MapPin, Landmark, LayoutGrid, CheckCircle, Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import LocationAutocomplete from "../search/LocationAutoComplete";
import { addInstitute } from "@/lib/User/user/create-institute"; 

export default function CreateInstituteForm({ 
    userId,
    allCities, 
    allCategories 
}: { 
    userId: string;
    allCities: any[]; 
    allCategories: any[];
}) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    
    // Image State
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    
    // Location State
    const [location, setLocation] = useState({ lat: 0, lng: 0, address: "" });

    const handleLocationSelect = (lat: number, lng: number, address: string) => {
        setLocation({ lat, lng, address });
        toast.success("Location locked!");
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image too large. Max 5MB.");
            return;
        }

        setImageFile(file);
        setImagePreview(URL.createObjectURL(file)); 
    };

    const handleCategoryToggle = (categoryId: string) => {
        setSelectedCategories(prev => 
            prev.includes(categoryId) ? prev.filter(id => id !== categoryId) : [...prev, categoryId]
        );
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (selectedCategories.length === 0) {
            toast.error("Select at least one category.");
            return;
        }

        setIsLoading(true);
        const formData = new FormData(e.currentTarget);
        
        if (imageFile) {
            formData.append("imageFile", imageFile);
        }

        try {
            const result = await addInstitute(userId, formData, selectedCategories);
            
            if (result.success) {
                toast.success("Listing sent for admin approval!");
                router.push(`/user/create-institute/${result.id}/claim`);
                router.refresh();
            } else {
                toast.error(result.error || "Submission failed.");
            }
        } catch (error) {
            toast.error("Something went wrong with the server.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleFormSubmit} className="space-y-8 max-w-4xl mx-auto pb-16">
            
            {/* INSTRUCTION BANNER */}
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex gap-3 text-sm text-emerald-900 shadow-xs animate-in fade-in duration-300">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <p><strong>Setup Blueprint:</strong> Creating your workspace initializes an immediate verified profile shell inside database directories. Listing locks automatically on submit until active overrides are reviewed by moderation logs.</p>
            </div>

            {/* Banner Section */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-emerald-500" /> Primary Presentation Banner
                </h3>
                <div className="flex flex-col items-center justify-center p-6 bg-slate-50 border border-dashed border-slate-300 rounded-2xl space-y-4">
                    <div className="w-full max-w-lg h-48 rounded-2xl bg-white flex items-center justify-center overflow-hidden relative border">
                        {imagePreview ? (
                            <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                        ) : (
                            <p className="text-xs text-slate-400">No image uploaded</p>
                        )}
                    </div>
                    <label className="cursor-pointer bg-slate-900 text-white text-xs px-5 py-2.5 rounded-xl font-bold flex items-center gap-2">
                        <UploadCloud className="w-4 h-4" />
                        Change / Upload Cover Image
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                </div>
            </div>

            {/* 1. Core Details */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                    <Landmark className="w-5 h-5 text-emerald-500" /> 1. Academy Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Institute Name *</label>
                        <Input name="name" required placeholder="Institute Name" />
                    </div>
                </div>
                
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Academy Description *</label>
                    <Textarea 
                        name="description" 
                        required 
                        placeholder="Tell students about your teaching methodology, facilities, and why they should choose your institute..." 
                        className="min-h-[150px] resize-none" 
                    />
                </div>
            </div>

            {/* 🚀 2. NAYO SECTION: Contact & Online Presence */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                    <Globe className="w-5 h-5 text-emerald-500" /> 2. Contact & Online Presence
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Phone Number *</label>
                        <Input name="phone" type="tel" required placeholder="e.g., +91 9876543210" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Official Email ID *</label>
                        <Input name="email" type="email" required placeholder="e.g., info@academy.com" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Website URL</label>
                        <Input name="website" type="url" placeholder="https://www.academy.com (Optional)" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Google Maps URL</label>
                        <Input name="googleMapsUrl" type="url" placeholder="Paste Google Maps Share Link (Optional)" />
                    </div>
                </div>
            </div>

            {/* 3. Location & Fee */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-emerald-500" /> 3. Location & Pricing
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">City *</label>
                        <select name="cityId" required className="w-full p-3 rounded-xl border border-slate-200 text-sm">
                            <option value="">Select City</option>
                            {allCities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Course Fees *</label>
                        <Input name="feeInfo" required placeholder="Course Fees (e.g., ₹5000/mo)" />
                    </div>
                </div>

                <div className="space-y-4 border-t pt-6">
                    <label className="text-sm font-bold text-slate-700">Academy Address *</label>
                    <LocationAutocomplete onLocationSelect={handleLocationSelect} />
                    <Input name="address" value={location.address} onChange={(e) => setLocation({...location, address: e.target.value})} required placeholder="Edit address manually..." />
                    
                    <div className="grid grid-cols-2 gap-4">
                        <Input name="latitude" type="number" step="any" value={location.lat} onChange={(e) => setLocation({...location, lat: parseFloat(e.target.value)})} placeholder="Latitude" />
                        <Input name="longitude" type="number" step="any" value={location.lng} onChange={(e) => setLocation({...location, lng: parseFloat(e.target.value)})} placeholder="Longitude" />
                    </div>
                </div>
            </div>

            {/* 4. Categories */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="font-bold text-slate-800 text-lg">4. Domain Categories</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50 border rounded-xl">
                    {allCategories.map(cat => (
                        <label key={cat.id} className="flex items-center gap-2 text-xs">
                            <input type="checkbox" checked={selectedCategories.includes(cat.id)} onChange={() => handleCategoryToggle(cat.id)} />
                            {cat.name}
                        </label>
                    ))}
                </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full py-6 font-bold rounded-xl bg-slate-900 hover:bg-emerald-600">
                {isLoading ? "Compiling & Uploading..." : "Submit Profile for Approval"}
            </Button>
        </form>
    );
}