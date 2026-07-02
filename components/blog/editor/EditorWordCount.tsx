"use client";

import { useEffect, useState } from "react";
import type { Editor } from "@tiptap/react";
import {
  BookOpenText,
  Clock3,
  FileText,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { estimateReadingTime } from "./utils/readingTime";

type Props = {
  editor: Editor;
  className?: string;
  /**
   * Ready for future autosave integration.
   * "saved" | "saving" | "unsaved"
   */
  saveState?: "saved" | "saving" | "unsaved";
};

export default function EditorWordCount({
  editor,
  className,
  saveState = "saved",
}: Props) {
  // FIX 1: Use a clean transactional state slice instead of breaking useMemo memoization boundaries
  const [stats, setStats] = useState({
    words: 0,
    characters: 0,
    readingTime: 0,
  });

  useEffect(() => {
    if (!editor) return;

    const updateMetrics = () => {
      // FIX 2: Leverage the built-in, highly optimized extension cache to prevent thread lag
      const wordCount = editor.storage.characterCount.words();
      const charCount = editor.storage.characterCount.characters();
      
      // Extract the raw text *only* once for the reading time engine calculations
      const rawText = editor.getText();
      const calculatedReadingTime = estimateReadingTime(rawText);

      setStats({
        words: wordCount,
        characters: charCount,
        readingTime: calculatedReadingTime,
      });
    };

    // Initialize counts instantly on element mount
    updateMetrics();

    // Hook listeners strictly to input changes to protect selection cursor navigation speed
    editor.on("update", updateMetrics);

    return () => {
      editor.off("update", updateMetrics);
    };
  }, [editor]);

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-4 rounded-b-xl border-t border-slate-200 bg-gradient-to-r from-slate-50 to-white px-6 py-3.5 text-sm select-none",
        className
      )}
    >
      {/* Metrics Section */}
      <div className="flex flex-wrap items-center gap-5 text-slate-600">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-slate-400" />
          <span>{stats.words.toLocaleString()} words</span>
        </div>

        <div className="flex items-center gap-2">
          <BookOpenText className="h-4 w-4 text-slate-400" />
          <span>{stats.characters.toLocaleString()} characters</span>
        </div>

        <div className="flex items-center gap-2">
          <Clock3 className="h-4 w-4 text-slate-400" />
          <span>{stats.readingTime} min read</span>
        </div>
      </div>

      {/* Cloud Autosave State Visualizer */}
      <div
        className={cn(
          "flex items-center gap-2 font-medium transition-colors duration-200",
          saveState === "saved" && "text-emerald-600",
          saveState === "saving" && "text-amber-600",
          saveState === "unsaved" && "text-slate-500"
        )}
      >
        {saveState === "saved" && (
          <>
            <CheckCircle2 className="h-4 w-4" />
            <span>Saved</span>
          </>
        )}

        {saveState === "saving" && (
          <>
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Saving...</span>
          </>
        )}

        {saveState === "unsaved" && (
          <>
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <span>Unsaved changes</span>
          </>
        )}
      </div>
    </div>
  );
}
