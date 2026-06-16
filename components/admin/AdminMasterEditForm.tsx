"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { updateInstituteByAdmin } from "@/lib/User/admin/adminMasterInstitute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, AlertTriangle, ArrowLeft, Image as ImageIcon, UploadCloud } from "lucide-react";
import Link from "next/link";

// 🚀 IMPORT PORTFOLIO COMPONENTS
import EditTeachers from "@/app/manager/[instituteId]/profile/edit/EditTeacherProfile";
import EditResultImages from "@/app/manager/[instituteId]/profile/edit/EditResultImages";
import EditVideoLinks from "@/app/manager/[instituteId]/profile/edit/EditVideoLinks";

type Props = {
    institute: any;
    allCities: any[];
    allCategories: any[];
    currentCategoryIds: string[];
};

export default function MasterEditForm({ institute, allCities, allCategories, currentCategoryIds }: Props) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // Categories State
    const [selectedCategories, setSelectedCategories] = useState<string[]>(currentCategoryIds);

    // 📸 Image Preview & URL State
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>(institute.imageUrl || "");
    const showActualImage = imagePreview.includes("cloudinary.com") || imagePreview.startsWith("blob:");

    // Admin Toggles States
    const [isActive, setIsActive] = useState(institute.isActive);
    const [isPublished, setIsPublished] = useState(institute.isPublished ?? true);
    const [isVerified, setIsVerified] = useState(institute.isVerified);
    const [isFeatured, setIsFeatured] = useState(institute.isFeatured);
    const [plan, setPlan] = useState(institute.subscriptionPlan || "BASIC");

    // Handlers
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

    const handleCategoryToggle = (categoryId: string) => {
        setSelectedCategories((prev) => 
            prev.includes(categoryId) 
                ? prev.filter(id => id !== categoryId) 
                : [...prev, categoryId]
        );
    };

    // Form Submission
    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        
        // Append custom states to FormData
        if (imageFile) formData.append("imageFile", imageFile);
        formData.append("isActive", String(isActive));
        formData.append("isPublished", String(isPublished));
        formData.append("isVerified", String(isVerified));
        formData.append("isFeatured", String(isFeatured));
        formData.append("subscriptionPlan", plan);

        try {
            const result = await updateInstituteByAdmin(institute.id, formData, selectedCategories);
            if (result.success) {
                toast.success(result.message || "Institute updated successfully!");
                router.refresh();
            } else {
                toast.error(result.error || "Failed to update institute.");
            }
        } catch (error) {
            toast.error("Something went wrong!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-12">
            
            {/* ---------------- MAIN ADMIN FORM ---------------- */}
            <form onSubmit={handleFormSubmit} className="space-y-8">
                
                {/* Warning Banner */}
                <div className="p-4 bg-purple-50 border border-purple-100 rounded-2xl flex gap-3 text-sm text-purple-900 shadow-sm">
                    <AlertTriangle className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                    <p><strong>Admin Controls Warning:</strong> Modifying details here bypasses manager confirmations. Altering slugs may break older student bookmark links.</p>
                </div>

                {/* 📸 IMAGE UPLOAD SECTION */}
                <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden">
                    <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                        <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
                            <ImageIcon className="w-5 h-5 text-purple-600" /> Main Display Image
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 flex flex-col items-center justify-center space-y-5">
                        <div className="w-full max-w-lg h-48 sm:h-64 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden relative shadow-inner p-4 text-center">
                            {showActualImage ? (
                                <img src={imagePreview} alt="Institute Cover" className="w-full h-full object-cover absolute inset-0" />
                            ) : imagePreview ? (
                                <div className="flex flex-col items-center gap-3 text-slate-500 w-full z-10">
                                    <ImageIcon className="w-8 h-8 text-slate-300" />
                                    <div className="text-sm font-semibold text-slate-700">Google Places / External Stored</div>
                                    <div className="text-xs bg-white border border-slate-200 text-slate-500 px-3 py-2 rounded-lg w-full truncate font-mono select-all">
                                        {imagePreview}
                                    </div>
                                    <div className="text-[10px] text-slate-400">Preview disabled to prevent API billing. Upload a new image to replace.</div>
                                </div>
                            ) : (
                                <div className="text-sm text-slate-400 flex flex-col items-center gap-2 z-10">
                                    <ImageIcon className="w-8 h-8 text-slate-300"/> 
                                    <span>No Image Available</span>
                                </div>
                            )}
                        </div>

                        <label className="cursor-pointer bg-slate-900 hover:bg-purple-700 text-white text-sm px-6 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-sm">
                            <UploadCloud className="w-4 h-4" /> Change Cover Image
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </label>
                    </CardContent>
                </Card>

                {/* 📋 SHADCN TABS FOR DETAILS */}
                <Tabs defaultValue="general" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 bg-slate-100 p-1 rounded-xl mb-6">
                        <TabsTrigger value="general" className="rounded-lg">General Info</TabsTrigger>
                        <TabsTrigger value="contact" className="rounded-lg">Contact & Geo</TabsTrigger>
                        <TabsTrigger value="social" className="rounded-lg">Social Links</TabsTrigger>
                        <TabsTrigger value="config" className="rounded-lg">Admin Controls</TabsTrigger>
                    </TabsList>

                    {/* ================= 1. GENERAL INFO ================= */}
                    <TabsContent value="general">
                        <Card className="rounded-2xl border-slate-200 shadow-sm">
                            <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Institute Name</Label>
                                        <Input name="name" defaultValue={institute.name} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Slug (URL)</Label>
                                        <Input name="slug" defaultValue={institute.slug} required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea name="description" rows={4} defaultValue={institute.description || ""} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Estimated Fee Info</Label>
                                        <Input name="feeInfo" defaultValue={institute.feeInfo || ""} placeholder="e.g. ₹50,000 - ₹1,20,000" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>City</Label>
                                        <Select name="cityId" defaultValue={institute.cityId}>
                                            <SelectTrigger><SelectValue placeholder="Select City" /></SelectTrigger>
                                            <SelectContent>
                                                {allCities.map(city => (
                                                    <SelectItem key={city.id} value={city.id}>{city.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* CATEGORY SELECTION */}
                                <div className="space-y-2 pt-2">
                                    <Label>Tagged Categories</Label>
                                    <div className="h-40 overflow-y-auto border border-slate-200 rounded-xl p-3 bg-slate-50 grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {allCategories.map(cat => (
                                            <label key={cat.id} className="flex items-center space-x-2 hover:bg-white border border-transparent hover:border-slate-200 p-1.5 rounded-lg transition-colors cursor-pointer select-none">
                                                <input 
                                                    type="checkbox" 
                                                    checked={selectedCategories.includes(cat.id)}
                                                    onChange={() => handleCategoryToggle(cat.id)}
                                                    className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-600"
                                                />
                                                <span className="text-sm text-slate-700 truncate">{cat.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* ================= 2. CONTACT & LOCATION ================= */}
                    <TabsContent value="contact">
                        <Card className="rounded-2xl border-slate-200 shadow-sm">
                            <CardHeader><CardTitle>Contact & Geography</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Phone Number</Label>
                                        <Input name="phone" type="tel" defaultValue={institute.phone || ""} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Email Address</Label>
                                        <Input name="email" type="email" defaultValue={institute.email || ""} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Physical Address</Label>
                                    <Input name="address" defaultValue={institute.address} required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Website URL</Label>
                                    <Input name="website" type="url" defaultValue={institute.website || ""} />
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2"><Label>Latitude</Label><Input name="latitude" type="number" step="any" defaultValue={institute.latitude || ""} /></div>
                                    <div className="space-y-2"><Label>Longitude</Label><Input name="longitude" type="number" step="any" defaultValue={institute.longitude || ""} /></div>
                                    <div className="space-y-2"><Label>Google Rating (Override)</Label><Input name="googleRating" type="number" step="any" defaultValue={institute.googleRating || ""} /></div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2"><Label>Google Review Count</Label><Input name="googleReviewCount" type="number" defaultValue={institute.googleReviewCount || ""} /></div>
                                    <div className="space-y-2"><Label>Google Maps Link</Label><Input name="googleMapsUrl" type="url" defaultValue={institute.googleMapsUrl || ""} /></div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* ================= 3. SOCIAL LINKS ================= */}
                    <TabsContent value="social">
                        <Card className="rounded-2xl border-slate-200 shadow-sm">
                            <CardHeader><CardTitle>Social Media Links</CardTitle></CardHeader>
                            <CardContent className="grid grid-cols-2 gap-4">
                                <div className="space-y-2"><Label>WhatsApp URL</Label><Input name="whatsappUrl" type="url" defaultValue={institute.whatsappUrl || ""} /></div>
                                <div className="space-y-2"><Label>Instagram URL</Label><Input name="instagramUrl" type="url" defaultValue={institute.instagramUrl || ""} /></div>
                                <div className="space-y-2"><Label>Facebook URL</Label><Input name="facebookUrl" type="url" defaultValue={institute.facebookUrl || ""} /></div>
                                <div className="space-y-2"><Label>YouTube URL</Label><Input name="youtubeUrl" type="url" defaultValue={institute.youtubeUrl || ""} /></div>
                                <div className="space-y-2"><Label>LinkedIn URL</Label><Input name="linkedinUrl" type="url" defaultValue={institute.linkedinUrl || ""} /></div>
                                <div className="space-y-2"><Label>Twitter URL</Label><Input name="twitterUrl" type="url" defaultValue={institute.twitterUrl || ""} /></div>
                                <div className="space-y-2"><Label>Telegram URL</Label><Input name="telegramUrl" type="url" defaultValue={institute.telegramUrl || ""} /></div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* ================= 4. ADMIN CONTROLS ================= */}
                    <TabsContent value="config">
                        <Card className="rounded-2xl border-amber-200 bg-amber-50/30 shadow-sm">
                            <CardHeader><CardTitle className="text-amber-900">Master Configuration</CardTitle></CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-6 p-4 bg-white rounded-xl border border-slate-100">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>Master Active Lock</Label>
                                            <p className="text-[11px] text-slate-500">If OFF, institute is banned globally.</p>
                                        </div>
                                        <Switch checked={isActive} onCheckedChange={setIsActive} />
                                    </div>
                                    <div className="flex items-center justify-between border-l pl-6">
                                        <div className="space-y-0.5">
                                            <Label>Manager Publish Toggle</Label>
                                            <p className="text-[11px] text-slate-500">Visibility set by the manager.</p>
                                        </div>
                                        <Switch checked={isPublished} onCheckedChange={setIsPublished} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6 p-4 bg-white rounded-xl border border-slate-100">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>Verified Badge</Label>
                                            <p className="text-[11px] text-slate-500">Show blue tick on profile.</p>
                                        </div>
                                        <Switch checked={isVerified} onCheckedChange={setIsVerified} />
                                    </div>
                                    <div className="flex items-center justify-between border-l pl-6">
                                        <div className="space-y-0.5">
                                            <Label>Featured Status</Label>
                                            <p className="text-[11px] text-slate-500">Show in priority lists.</p>
                                        </div>
                                        <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
                                    </div>
                                </div>

                                <div className="p-4 bg-white rounded-xl border border-slate-100 space-y-3">
                                    <Label>Subscription Plan (Override)</Label>
                                    <Select value={plan} onValueChange={setPlan}>
                                        <SelectTrigger className="w-full"><SelectValue placeholder="Select Plan" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="BASIC">Basic (Free)</SelectItem>
                                            <SelectItem value="VERIFIED">Verified</SelectItem>
                                            <SelectItem value="PREMIUM">Premium</SelectItem>
                                            <SelectItem value="ULTRA">Ultra / Elite</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Submit & Cancel Actions */}
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
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl shadow-sm">
                    <h3 className="font-bold text-emerald-900 text-lg mb-1">Portfolio & Media Management</h3>
                    <p className="text-sm text-emerald-700">Since you are an admin, plan limits are bypassed here. Actions below save instantly.</p>
                </div>

                <EditTeachers instituteId={institute.id} currentTeachers={institute.teachers || []} maxLimit={999} />
                <EditResultImages instituteId={institute.id} currentImages={institute.gallery || []} maxLimit={999} />
                <EditVideoLinks instituteId={institute.id} currentVideos={institute.youtubeVideos || []} maxLimit={999} />
            </div>
            
        </div>
    );
}