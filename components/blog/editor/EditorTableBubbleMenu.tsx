"use client";

import { useCallback, useState } from "react";
import type { Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import type { BubbleMenuProps } from "@tiptap/react/menus";
import { cn } from "@/lib/utils";

import {
  Table2,
  Rows3,
  Columns3,
  Trash2,
  Plus,
  Minus,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  editor: Editor;
};

export default function EditorTableBubbleMenu({ editor }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  
  if (!editor) return null;

  const shouldShowMenu: BubbleMenuProps["shouldShow"] = useCallback(
    ({ editor: currentEditor, state }: { editor: Editor; state: any }) => {
      // If table becomes inactive, we should also close the dropdown
      if (!currentEditor.isActive("table")) {
        setIsOpen(false);
        return false;
      }
      return true;
    },
    []
  );

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={shouldShowMenu}
      updateDelay={150}
      options={{ placement: "top" }}
    >
      <div className="relative flex flex-col items-center">
        <Button
          type="button"
          variant="default"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="h-8 w-8 rounded-full shadow-lg border border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100"
          title="Table Options"
        >
          <Table2 className="h-4 w-4" />
        </Button>
        
        {isOpen && (
          <div className="absolute top-10 left-0 flex flex-col w-56 rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden z-50">
            <MenuItem 
              icon={<Plus className="h-4 w-4" />} 
              label="Add Row Above" 
              onClick={() => { editor.chain().focus().addRowBefore().run(); setIsOpen(false); }} 
            />
            <MenuItem 
              icon={<Rows3 className="h-4 w-4" />} 
              label="Add Row Below" 
              onClick={() => { editor.chain().focus().addRowAfter().run(); setIsOpen(false); }} 
            />
            <MenuItem 
              icon={<Minus className="h-4 w-4" />} 
              label="Delete Row" 
              onClick={() => { editor.chain().focus().deleteRow().run(); setIsOpen(false); }} 
            />
            
            <div className="h-px bg-slate-100 my-1" />
            
            <MenuItem 
              icon={<Plus className="h-4 w-4" />} 
              label="Add Column Left" 
              onClick={() => { editor.chain().focus().addColumnBefore().run(); setIsOpen(false); }} 
            />
            <MenuItem 
              icon={<Columns3 className="h-4 w-4" />} 
              label="Add Column Right" 
              onClick={() => { editor.chain().focus().addColumnAfter().run(); setIsOpen(false); }} 
            />
            <MenuItem 
              icon={<Minus className="h-4 w-4" />} 
              label="Delete Column" 
              onClick={() => { editor.chain().focus().deleteColumn().run(); setIsOpen(false); }} 
            />

            <div className="h-px bg-slate-100 my-1" />

            <MenuItem 
              label="Toggle Header Row" 
              onClick={() => { editor.chain().focus().toggleHeaderRow().run(); setIsOpen(false); }} 
            />
            <MenuItem 
              label="Toggle Header Column" 
              onClick={() => { editor.chain().focus().toggleHeaderColumn().run(); setIsOpen(false); }} 
            />
            <MenuItem 
              label="Merge / Split Cells" 
              onClick={() => {
                editor.chain().mergeCells()
                  ? editor.chain().focus().mergeCells().run()
                  : editor.chain().focus().splitCell().run();
                setIsOpen(false);
              }} 
            />

            <div className="h-px bg-slate-100 my-1" />

            <MenuItem 
              icon={<Trash2 className="h-4 w-4" />} 
              label="Delete Table" 
              className="text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={() => { editor.chain().focus().deleteTable().run(); setIsOpen(false); }} 
            />
          </div>
        )}
      </div>
    </BubbleMenu>
  );
}

function MenuItem({ icon, label, onClick, className }: { icon?: React.ReactNode; label: string; onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={cn("flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors w-full text-left", className)}
    >
      {icon && <span className="opacity-70">{icon}</span>}
      {label}
    </button>
  );
}
