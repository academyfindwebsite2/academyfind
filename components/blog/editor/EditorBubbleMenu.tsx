"use client";

import { useCallback } from "react";
import type { Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import type { BubbleMenuProps } from "@tiptap/react/menus";

import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Highlighter,
  Code2,
  Eraser,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Baseline,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import LinkPopover from "./LinkPopover";

type Props = {
  editor: Editor;
};

// Preset colors for text and highlights
const TEXT_COLORS = [
  { name: "Default", value: "inherit" },
  { name: "Red", value: "#ef4444" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Green", value: "#22c55e" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Purple", value: "#a855f7" },
];

const HIGHLIGHT_COLORS = [
  { name: "Yellow", value: "#fef08a" },
  { name: "Green", value: "#bbf7d0" },
  { name: "Blue", value: "#bfdbfe" },
  { name: "Pink", value: "#fbcfe8" },
  { name: "Purple", value: "#e9d5ff" },
];

export default function EditorBubbleMenu({ editor }: Props) {
  if (!editor) return null;

  // Performance Optimization: Explicitly type the incoming parameters object context
  const shouldShowMenu: BubbleMenuProps["shouldShow"] = useCallback(
    ({ editor: currentEditor, state }: { editor: Editor; state: any }) => {
      const { selection } = state;
      const { empty, from, to } = selection;

      if (empty) return false;

      if (
        currentEditor.isActive("codeBlockLowlight") ||
        currentEditor.isActive("image") ||
        currentEditor.isActive("youtube") ||
        currentEditor.isActive("link")
      ) {
        return false;
      }

      return from !== to;
    },
    []
  );

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={shouldShowMenu}
      updateDelay={150}
      appendTo={() => document.body}
      options={{
        placement: "top",
      }}
    >
      <div className="flex items-center gap-1 rounded-xl border border-slate-300 bg-white/95 backdrop-blur-sm p-1.5 shadow-xl select-none pointer-events-auto flex-wrap max-w-md md:max-w-none">
        {/* Core Formatting */}
        <Button
          type="button"
          variant={editor.isActive("bold") ? "default" : "ghost"}
          size="icon"
          className="h-8 w-8 rounded-lg"
          title="Bold"
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-3.5 w-3.5" />
        </Button>

        <Button
          type="button"
          variant={editor.isActive("italic") ? "default" : "ghost"}
          size="icon"
          className="h-8 w-8 rounded-lg"
          title="Italic"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-3.5 w-3.5" />
        </Button>

        <Button
          type="button"
          variant={editor.isActive("underline") ? "default" : "ghost"}
          size="icon"
          className="h-8 w-8 rounded-lg"
          title="Underline"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <Underline className="h-3.5 w-3.5" />
        </Button>

        <Button
          type="button"
          variant={editor.isActive("strike") ? "default" : "ghost"}
          size="icon"
          className="h-8 w-8 rounded-lg"
          title="Strikethrough"
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="h-3.5 w-3.5" />
        </Button>

        {/* Script Variants */}
        <Button
          type="button"
          variant={editor.isActive("subscript") ? "default" : "ghost"}
          size="icon"
          className="h-8 w-8 rounded-lg"
          title="Subscript"
          onClick={() => editor.chain().focus().toggleSubscript().run()}
        >
          <SubscriptIcon className="h-3.5 w-3.5" />
        </Button>

        <Button
          type="button"
          variant={editor.isActive("superscript") ? "default" : "ghost"}
          size="icon"
          className="h-8 w-8 rounded-lg"
          title="Superscript"
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
        >
          <SuperscriptIcon className="h-3.5 w-3.5" />
        </Button>

        <Button
          type="button"
          variant={editor.isActive("code") ? "default" : "ghost"}
          size="icon"
          className="h-8 w-8 rounded-lg"
          title="Code"
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          <Code2 className="h-3.5 w-3.5" />
        </Button>

        <LinkPopover editor={editor} />

        {/* Text Color Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-lg" title="Text Color">
              <Baseline className="h-3.5 w-3.5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-44 p-2 flex flex-col gap-1 z-30 rounded-xl shadow-lg border-slate-200">
            {TEXT_COLORS.map((color: { value: string; name: string; preview?: string }) => (
              <button
                type="button"
                key={color.value}
                className="text-left text-sm p-2 hover:bg-slate-100 rounded-lg transition-all flex items-center"
                onClick={() => {
                  if (color.value === "inherit") {
                    editor.chain().focus().unsetColor().run();
                  } else {
                    editor.chain().focus().setColor(color.value).run();
                  }
                }}
              >
                <span
                  className="inline-block w-4 h-4 rounded-full border border-slate-300 mr-2.5 align-middle shrink-0 shadow-sm"
                  style={{ backgroundColor: color.preview || color.value }}
                />
                {color.name}
              </button>
            ))}
          </PopoverContent>
        </Popover>

        {/* Highlight Color Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant={editor.isActive("highlight") ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8 rounded-lg"
              title="Highlight Color"
            >
              <Highlighter className="h-3.5 w-3.5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-44 p-2 flex flex-col gap-1 z-30 rounded-xl shadow-lg border-slate-200">
            <button
              type="button"
              className="text-left text-sm p-2 hover:bg-slate-100 rounded-lg transition-all flex items-center"
              onClick={() => editor.chain().focus().unsetHighlight().run()}
            >
              <span className="inline-block w-4 h-4 rounded-full border border-dashed border-slate-400 mr-2.5 align-middle bg-transparent shrink-0" />
              None
            </button>
            {HIGHLIGHT_COLORS.map((color: { value: string; name: string; preview?: string }) => (
              <button
                type="button"
                key={color.value}
                className="text-left text-sm p-2 hover:bg-slate-100 rounded-lg transition-all flex items-center"
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleHighlight({ color: color.value })
                    .run()
                }
              >
                <span
                  className="inline-block w-4 h-4 rounded border border-slate-300 mr-2.5 align-middle shrink-0 shadow-sm"
                  style={{ backgroundColor: color.preview || color.value }}
                />
                {color.name}
              </button>
            ))}
          </PopoverContent>
        </Popover>

        {/* Visual Separation Segment */}
        <Separator orientation="vertical" className="h-6 mx-1 bg-slate-200" />

        {/* Destructive Clearing Action */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50"
          title="Clear Formatting"
          onClick={() =>
            editor
              .chain()
              .focus()
              .unsetAllMarks()
              .clearNodes()
              .setParagraph()
              .run()
          }
        >
          <Eraser className="h-3.5 w-3.5" />
        </Button>
      </div>
    </BubbleMenu>
  );
}