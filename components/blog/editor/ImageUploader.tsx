"use client";

import { useRef, useState } from "react";
import type { Editor } from "@tiptap/react";
import { ImagePlus, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { uploadImage } from "./utils/uploadImage";

type ImageUploaderProps = {
  editor: Editor;
};

export default function ImageUploader({
  editor,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File) {
    if (!file) return;

    setUploading(true);

    const result = await uploadImage(file);

    setUploading(false);

    if (!result.success || !result.url) {
      alert(result.error ?? "Image upload failed.");
      return;
    }

    editor
      .chain()
      .focus()
      .setImage({
        src: result.url,
        alt: file.name,
        title: file.name,
      })
      .run();
  }

  return (
    <>
      <input
        ref={inputRef}
        hidden
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];

          if (file) {
            handleFile(file);
          }

          e.target.value = "";
        }}
      />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        title="Insert Image"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ImagePlus className="h-4 w-4" />
        )}
      </Button>
    </>
  );
}