"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { Loader2, Plus, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  saveBlogBrand,
  toggleBlogBrand,
} from "@/lib/User/admin/admin-blog-brand";

type BrandItem = {
  id: string;
  name: string;
  slug: string;
  bio: string | null;
  avatarUrl: string | null;
  isActive: boolean;
  postCount: number;
};

type BrandDraft = {
  id: string;
  name: string;
  slug: string;
  bio: string;
  avatarUrl: string;
};

const EMPTY_BRAND: BrandDraft = {
  id: "",
  name: "",
  slug: "",
  bio: "",
  avatarUrl: "",
};

export default function AdminBlogBrandManager({
  brands,
}: {
  brands: BrandItem[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [drafts, setDrafts] = useState<Record<string, BrandDraft>>(() =>
    Object.fromEntries(
      brands.map((brand) => [
        brand.id,
        {
          id: brand.id,
          name: brand.name,
          slug: brand.slug,
          bio: brand.bio ?? "",
          avatarUrl: brand.avatarUrl ?? "",
        },
      ]),
    ),
  );
  const [newBrand, setNewBrand] = useState(EMPTY_BRAND);

  const save = (draft: BrandDraft, isNew = false) => {
    startTransition(async () => {
      const result = await saveBlogBrand({
        ...draft,
        id: draft.id || undefined,
      });
      if (!result.success) {
        toast.error(result.error ?? "Unable to save this brand.");
        return;
      }
      toast.success(isNew ? "Brand created." : "Brand updated.");
      if (isNew) setNewBrand(EMPTY_BRAND);
      router.refresh();
    });
  };

  const toggle = (brandId: string, active: boolean) => {
    startTransition(async () => {
      const result = await toggleBlogBrand(brandId, active);
      if (!result.success) {
        toast.error(result.error ?? "Unable to update this brand.");
        return;
      }
      toast.success(active ? "Brand activated." : "Brand deactivated.");
      router.refresh();
    });
  };

  const fields = (
    draft: BrandDraft,
    update: (next: BrandDraft) => void,
  ) => (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label>Brand name</Label>
        <Input
          value={draft.name}
          onChange={(event) => update({ ...draft, name: event.target.value })}
          placeholder="AcademyFind"
        />
      </div>
      <div className="space-y-2">
        <Label>Slug</Label>
        <Input
          value={draft.slug}
          onChange={(event) => update({ ...draft, slug: event.target.value })}
          placeholder="Generated from name"
        />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label>Avatar URL</Label>
        <Input
          type="url"
          value={draft.avatarUrl}
          onChange={(event) =>
            update({ ...draft, avatarUrl: event.target.value })
          }
          placeholder="https://..."
        />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label>Bio</Label>
        <Textarea
          value={draft.bio}
          maxLength={1000}
          onChange={(event) => update({ ...draft, bio: event.target.value })}
          placeholder="Short brand description"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-purple-200 bg-purple-50/50 p-5">
        <h2 className="font-bold text-slate-900">Create a brand</h2>
        <div className="mt-4">
          {fields(newBrand, setNewBrand)}
          <Button
            type="button"
            disabled={isPending}
            onClick={() => save(newBrand, true)}
            className="mt-4 bg-purple-600 text-white hover:bg-purple-700"
          >
            {isPending ? <Loader2 className="animate-spin" /> : <Plus />}
            Add brand
          </Button>
        </div>
      </section>

      {brands.map((brand) => {
        const draft = drafts[brand.id];
        if (!draft) return null;

        return (
          <section
            key={brand.id}
            className="rounded-2xl border border-slate-200 p-5"
          >
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="font-bold text-slate-900">{brand.name}</h2>
                <p className="text-xs text-slate-500">
                  {brand.postCount} linked posts
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor={`brand-active-${brand.id}`}>
                  {brand.isActive ? "Active" : "Inactive"}
                </Label>
                <Switch
                  id={`brand-active-${brand.id}`}
                  checked={brand.isActive}
                  disabled={isPending}
                  onCheckedChange={(checked) => toggle(brand.id, checked)}
                />
              </div>
            </div>
            {fields(draft, (next) =>
              setDrafts((current) => ({ ...current, [brand.id]: next })),
            )}
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => save(draft)}
              className="mt-4"
            >
              {isPending ? <Loader2 className="animate-spin" /> : <Save />}
              Save brand
            </Button>
          </section>
        );
      })}
    </div>
  );
}
