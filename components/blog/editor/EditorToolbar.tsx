"use client";

import { memo } from "react";
import type { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Highlighter,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Undo2,
  Redo2,
  Pilcrow,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Baseline,
  CheckSquare,
  Eraser,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Import your custom toolbars and sub-menu containers
import ImageUploader from "./ImageUploader";
import LinkPopover from "./LinkPopover";
import TableToolbar from "./TableToolbar";
import CodeBlockToolbar from "./CodeBlockToolBar";
type Props = {
  editor: Editor;
};

// Preset colors for text and highlights
const TEXT_COLORS = [
  { name: "Default", value: "inherit", preview: "#ffffff" },
  { name: "Red", value: "#ef4444", preview: "#ef4444" },
  { name: "Blue", value: "#3b82f6", preview: "#3b82f6" },
  { name: "Green", value: "#22c55e", preview: "#22c55e" },
  { name: "Amber", value: "#f59e0b", preview: "#f59e0b" },
  { name: "Purple", value: "#a855f7", preview: "#a855f7" },
];

const HIGHLIGHT_COLORS = [
  { name: "Yellow", value: "#fef08a", preview: "#fef08a" },
  { name: "Green", value: "#bbf7d0", preview: "#bbf7d0" },
  { name: "Blue", value: "#bfdbfe", preview: "#bfdbfe" },
  { name: "Pink", value: "#fbcfe8", preview: "#fbcfe8" },
  { name: "Purple", value: "#e9d5ff", preview: "#e9d5ff" },
];

const FONT_FAMILIES = [
  { name: "Default Font", value: "default" },
  { name: "Arial", value: "Arial, Helvetica, sans-serif" },
  { name: "Times New Roman", value: "'Times New Roman', Times, serif" },
  { name: "Courier New", value: "'Courier New', Courier, monospace" },
  { name: "Georgia", value: "Georgia, serif" },
  { name: "Verdana", value: "Verdana, Geneva, sans-serif" },
  { name: "Trebuchet MS", value: "'Trebuchet MS', Helvetica, sans-serif" },
  { name: "Comic Sans", value: "'Comic Sans MS', 'Comic Sans', cursive" },
  { name: "Inter", value: "Inter, sans-serif" },
  { name: "Monospace", value: "monospace" },
];

const FONT_SIZES = [
  { name: "Size", value: "default" },
  { name: "8", value: "8px" },
  { name: "10", value: "10px" },
  { name: "11", value: "11px" },
  { name: "12", value: "12px" },
  { name: "14", value: "14px" },
  { name: "16", value: "16px" },
  { name: "18", value: "18px" },
  { name: "24", value: "24px" },
  { name: "30", value: "30px" },
  { name: "36", value: "36px" },
  { name: "48", value: "48px" },
  { name: "72", value: "72px" },
];

interface ToolbarItemProps {
  label: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

// FIX 1: Wrap in React.memo to isolate selection updates and prevent redundant rendering loops
const ToolbarItem = memo(function ToolbarItem({
  onClick,
  active,
  disabled,
  children,
  label
}: ToolbarItemProps) {
  return (
    <Button
      type="button"
      // FIX 2: Swapped out heavy 'default' solid block fills for elegant 'secondary' active highlights
      variant={active ? "secondary" : "ghost"}
      aria-label={label}
      title={label}
      onMouseDown={(e) => e.preventDefault()} // Prevents losing focus on editor        
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "h-9 w-9 transition-all",
        active && "border border-amber-200 text-amber-900 bg-amber-50/60"
      )}
    >
      {children}
    </Button>
  );
});

export default function EditorToolbar({ editor }: Props) {
  if (!editor) return null;
  const currentTextColor =
    editor.getAttributes("textStyle").color;

  const currentHighlightColor =
    editor.getAttributes("highlight").color;
  return (
    // FIX 3: Structured into logical group segments for cleaner semantic readability
    <div className="sticky top-0 z-20 overflow-x-auto border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90">
      <div className="flex min-w-max items-center gap-1 p-2.5">

        {/* GROUP 1: HISTORY PIPELINE */}
        <div className="flex items-center gap-1 rounded-lg bg-slate-50/50 p-1">
          <ToolbarItem
            label="Undo"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            <Undo2 className="h-4 w-4" />
          </ToolbarItem>
          <ToolbarItem
            label="Redo"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            <Redo2 className="h-4 w-4" />
          </ToolbarItem>
        </div>

        <Separator orientation="vertical" className="h-6 mx-1.5 bg-slate-200" />

        {/* GROUP 1.5: FONT STYLING */}
        <div className="flex items-center gap-2">
          <Select
            value={editor.getAttributes('textStyle').fontFamily || "default"}
            onValueChange={(val) => {
              if (val && val !== "default") {
                editor.chain().focus().setFontFamily(val).run();
              } else {
                editor.chain().focus().unsetFontFamily().run();
              }
            }}
          >
            <SelectTrigger className="h-8 w-[130px] border-slate-200 bg-transparent text-sm focus:ring-1 focus:ring-amber-400">
              <SelectValue placeholder="Font Style" />
            </SelectTrigger>
            <SelectContent position="popper" sideOffset={4}>
              {FONT_FAMILIES.map(font => (
                <SelectItem key={font.name} value={font.value} style={font.value !== 'default' ? { fontFamily: font.value } : {}}>
                  {font.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={editor.getAttributes('textStyle').fontSize || "default"}
            onValueChange={(val) => {
              if (val && val !== "default") {
                editor.chain().focus().setFontSize(val).run();
              } else {
                editor.chain().focus().unsetFontSize().run();
              }
            }}
          >
            <SelectTrigger className="h-8 w-[70px] border-slate-200 bg-transparent text-sm focus:ring-1 focus:ring-amber-400">
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent position="popper" sideOffset={4}>
              {FONT_SIZES.map(size => (
                <SelectItem key={size.name} value={size.value}>
                  {size.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator orientation="vertical" className="h-6 mx-1.5 bg-slate-200" />

        {/* GROUP 2: DOCUMENT FORMAT TEXT BLOCK BLOCKS */}
        <div className="flex items-center gap-1">
          {/* FIX 4: Added explicit Pilcrow body track exit route from headings */}
          <ToolbarItem
            label="Paragraph"
            active={editor.isActive("paragraph")}
            onClick={() => editor.chain().focus().setParagraph().run()}
          >
            <Pilcrow className="h-4 w-4" />
          </ToolbarItem>
          <ToolbarItem
            label="Heading 1"
            active={editor.isActive("heading", { level: 1 })}
            onClick={() => editor.chain().focus().setHeading({ level: 1 }).run()}
          >
            <Heading1 className="h-4 w-4" />
          </ToolbarItem>
          <ToolbarItem
            label="Heading 2"
            active={editor.isActive("heading", { level: 2 })}
            onClick={() => editor.chain().focus().setHeading({ level: 2 }).run()}
          >
            <Heading2 className="h-4 w-4" />
          </ToolbarItem>
          <ToolbarItem
            label="Heading 3"
            active={editor.isActive("heading", { level: 3 })}
            onClick={() => editor.chain().focus().setHeading({ level: 3 }).run()}
          >
            <Heading3 className="h-4 w-4" />
          </ToolbarItem>
        </div>

        <Separator orientation="vertical" className="h-6 mx-1.5 bg-slate-200" />

        {/* GROUP 3: INLINE INLINE FORMATTING */}
        <div className="flex items-center gap-1">
          <ToolbarItem
            label="Bold"
            active={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold className="h-4 w-4" />
          </ToolbarItem>
          <ToolbarItem
            label="Italic"
            active={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic className="h-4 w-4" />
          </ToolbarItem>
          <ToolbarItem
            label="Underline"
            active={editor.isActive("underline")}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <Underline className="h-4 w-4" />
          </ToolbarItem>
          <ToolbarItem
            label="Strikethrough"
            active={editor.isActive("strike")}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <Strikethrough className="h-4 w-4" />
          </ToolbarItem>
          {/* FIX 5: Restored strictly to code marks layout only. Blocks are offloaded */}
          <ToolbarItem
            label="Code"
            active={editor.isActive("code")}
            onClick={() => editor.chain().focus().toggleCode().run()}
          >
            <Code2 className="h-4 w-4" />
          </ToolbarItem>
        </div>

        <Separator orientation="vertical" className="h-6 mx-1.5 bg-slate-200" />

        {/* GROUP 4: TEXT ALIGNMENT SETTINGS */}
        <div className="flex items-center gap-1">
          <ToolbarItem
            label="Align Left"
            active={editor.isActive({ textAlign: "left" })}
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
          >
            <AlignLeft className="h-4 w-4" />
          </ToolbarItem>
          <ToolbarItem
            label="Align Center"
            active={editor.isActive({ textAlign: "center" })}
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
          >
            <AlignCenter className="h-4 w-4" />
          </ToolbarItem>
          <ToolbarItem
            label="Align Right"
            active={editor.isActive({ textAlign: "right" })}
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
          >
            <AlignRight className="h-4 w-4" />
          </ToolbarItem>
          <ToolbarItem
            label="Align Justify"
            active={editor.isActive({ textAlign: "justify" })}
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          >
            <AlignJustify className="h-4 w-4" />
          </ToolbarItem>
        </div>

        <Separator orientation="vertical" className="h-6 mx-1.5 bg-slate-200" />

        {/* GROUP 5: PALETTE COLORS AND PICKERS */}
        <div className="flex items-center gap-1">
          {/* Text Color Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button type="button" variant="ghost" className="h-9 w-9 rounded-lg hover:bg-slate-100" onMouseDown={(e) => e.preventDefault()} title="Text Color">
                <Baseline className="h-4 w-4" style={{ color: currentTextColor || "inherit" }} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-44 p-2 flex flex-col gap-1 z-30 rounded-xl shadow-lg border-slate-200">
              {TEXT_COLORS.map((color: { name: string; value: string; preview: string }) => (
                <Button
                  type="button"
                  variant="ghost"
                  key={color.value}
                  onMouseDown={(e) => e.preventDefault()}
                  className="text-left text-sm p-2 hover:bg-slate-100 rounded-lg transition-all justify-start"
                  onClick={() => {
                    if (color.value === "inherit") {
                      editor.chain().focus().unsetColor().run();
                    } else {
                      editor.chain().focus().setColor(color.value).run();
                    }
                  }}
                >
                  <span
                    className="inline-block w-4 h-4 rounded-full border border-slate-300 mr-2.5 align-middle shadow-sm"
                    style={{ backgroundColor: color.preview }}
                  />
                  {color.name}
                </Button>
              ))}
            </PopoverContent>
          </Popover>

          {/* Highlight Color Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant={editor.isActive("highlight") ? "secondary" : "ghost"}
                onMouseDown={(e) => e.preventDefault()}
                className="h-9 w-9 rounded-lg"
                title="Highlight Color"
              >
                <Highlighter className="h-4 w-4" style={{ color: currentHighlightColor || "inherit" }} />
              </Button>

            </PopoverTrigger>
            <PopoverContent className="w-44 p-2 flex flex-col gap-1 z-30 rounded-xl shadow-lg border-slate-200">
              <Button
                type="button"
                variant="ghost"
                className="text-left text-sm p-2 hover:bg-slate-100 rounded-lg transition-all justify-start"
                onClick={() => editor.chain().focus().unsetHighlight().run()}
                onMouseDown={(e) => e.preventDefault()}
              >
                <span className="inline-block w-4 h-4 rounded-full border border-dashed border-slate-400 mr-2.5 align-middle bg-transparent" />
                None
              </Button>
              {HIGHLIGHT_COLORS.map((color: { name: string; value: string; preview: string }) => (
                <Button
                  type="button"
                  variant="ghost"
                  onMouseDown={(e) => e.preventDefault()}
                  key={color.value}
                  className="text-left text-sm p-2 hover:bg-slate-100 rounded-lg transition-all justify-start"
                  onClick={() => editor.chain().focus().setHighlight({ color: color.value }).run()}
                >
                  <span
                    className="inline-block w-4 h-4 rounded border border-slate-300 mr-2.5 align-middle shadow-sm"
                    style={{ backgroundColor: color.preview }}
                  />
                  {color.name}
                </Button>
              ))}
            </PopoverContent>
          </Popover>
          <ToolbarItem
            label="Clear Formatting"
            onClick={() =>
              editor
                .chain()
                .focus()
                .unsetAllMarks()
                .clearNodes()
                .run()
            }
          >
            <Eraser className="h-4 w-4" />
          </ToolbarItem>
        </div>

        <Separator orientation="vertical" className="h-6 mx-1.5 bg-slate-200" />

        {/* GROUP 6: ACCORDIONS AND LISTS */}
        <div className="flex items-center gap-1">
          <ToolbarItem
            active={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            label="Bullet List"
          >
            <List className="h-4 w-4" />
          </ToolbarItem>
          <ToolbarItem
            active={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            label="Ordered List"
          >
            <ListOrdered className="h-4 w-4" />
          </ToolbarItem>
          <ToolbarItem
            active={editor.isActive("blockquote")}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            label="Blockquote"
          >
            <Quote className="h-4 w-4" />
          </ToolbarItem>
          <ToolbarItem
            onClick={() => editor.chain().focus().setHorizontalRule().createParagraphNear().focus().run()}
            label="Horizontal Rule"
          >
            <Minus className="h-4 w-4" />
          </ToolbarItem>
          <ToolbarItem
            label="Task List"
            active={editor.isActive("taskList")}
            onClick={() =>
              editor.chain().focus().toggleTaskList().run()
            }
          >
            <CheckSquare className="h-4 w-4" />
          </ToolbarItem>
        </div>

        <div className="flex items-center gap-1.5">
          <Separator
            orientation="vertical"
            className="mx-1.5 h-6 bg-slate-200"
          />
          <ImageUploader editor={editor} />
          <LinkPopover editor={editor} />
          <TableToolbar editor={editor} />
          <CodeBlockToolbar editor={editor} />
        </div>
      </div>
    </div>
  );
}