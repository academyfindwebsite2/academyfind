"use client";

import { useEffect, useMemo, useRef } from "react";
import { useEditor } from "@tiptap/react";
import type { Editor as TiptapEditorInstance } from "@tiptap/core";

import { cn } from "@/lib/utils";
import { editorExtensions } from "./utils/editorExtensions";
import EditorToolbar from "./EditorToolbar";
import EditorBubbleMenu from "./EditorBubbleMenu";
import EditorContent from "./EditorContent";
import EditorWordCount from "./EditorWordCount";
import EditorFloatingMenu from "./EditorFloatingMenu";


type Props = {
  value?: string;
  placeholder?: string;
  editable?: boolean;
  autoFocus?: boolean; // FIX 4: Expose native autoFocus layout capabilities
  className?: string;
  onChange?: (html: string) => void;
  onUpdate?: (editor: TiptapEditorInstance) => void;
  // FIX 5: Decouple ready-states allowing outer layouts to control structural contents instantly
  onReady?: (editor: TiptapEditorInstance) => void; 
  saveState?: "saved" | "saving" | "unsaved";
  children?: React.ReactNode; // FIX 7: Extensible slot for AI assistants or collaboration widgets
};

export default function Editor({
  value = "",
  placeholder = "Start writing...",
  editable = true,
  autoFocus = false,
  className,
  onChange,
  onUpdate,
  onReady,
  saveState = "saved",
  children,
}: Props) {
  // FIX 2: Strict string baseline fallback initialization to block type boundary leakage
  const lastEmittedValueRef = useRef<string>("");

  // FIX 1: Reactive extension memoization blocks stall conditions if props shift downstream
  const extensions = useMemo(
    () => editorExtensions(placeholder),
    [placeholder]
  );

  const editor = useEditor({
    immediatelyRender: false,
    extensions,
    content: value,
    editable,
    autofocus: autoFocus,
    
    editorProps: {
      attributes: {
        class: "focus:outline-none",
      },
    },

    onUpdate({ editor: currentEditor }) {
      const currentHtml = currentEditor.getHTML();
      lastEmittedValueRef.current = currentHtml;

      onChange?.(currentHtml);
      onUpdate?.(currentEditor);
    },
  });

  // FIX 5: Fire onReady side-effect mapping the completed instance upward cleanly
  useEffect(() => {
    if (!editor) return;
    onReady?.(editor);
  }, [editor, onReady]);

  /**
   * Sync external content changes safely using reference checking.
   */
  useEffect(() => {
    if (!editor) return;

    if (value === lastEmittedValueRef.current) return;
    if (editor.getHTML() === value) return;

    lastEmittedValueRef.current = value;
    
    editor.commands.setContent(value, {
      emitUpdate: false,
    });
  }, [editor, value]);

  /**
   * Sync editability state changes cleanly dynamically.
   */
  useEffect(() => {
    if (!editor) return;
    editor.setEditable(editable);
  }, [editor, editable]);

  // FIX 3 & 6: Clean, branded loading interface mirroring professional CMS portals
  if (!editor) {
    return (
      <div className="flex min-h-[800px] flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50/50 select-none">
        <div className="relative">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-amber-200 border-t-amber-600" />
          <div className="absolute inset-0 h-10 w-10 animate-ping rounded-full border border-amber-100 opacity-50" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-600">Loading editor...</p>
          <p className="mt-1 text-xs text-slate-400">Preparing your writing workspace</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col focus-within:border-amber-400 focus-within:ring-4 focus-within:ring-amber-100/50",
        className
      )}
    >
      {editable && <EditorToolbar editor={editor} />}

      <div className="relative flex-1 bg-gradient-to-b from-white to-slate-50/30">
        {editable && (
          <>
            <EditorBubbleMenu editor={editor} />
            <EditorFloatingMenu editor={editor} />
          </>
        )}

        <EditorContent editor={editor} />
        
        {/* Render child extensions inside portal bounds layout spaces */}
        {children}
      </div>

      <EditorWordCount editor={editor} saveState={saveState} />
    </div>
  );
}
