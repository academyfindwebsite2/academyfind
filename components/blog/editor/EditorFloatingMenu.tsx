"use client";

import { useState, useEffect } from "react";
import type { Editor } from "@tiptap/react";
import { FloatingMenu } from "@tiptap/react/menus";
import { Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  editor: Editor;
};

export default function EditorFloatingMenu({ editor }: Props) {
  // Guard state preventing menu overlapping when the slash menu popover opens
  const [isForcedHidden, setIsForcedHidden] = useState(false);

  // Reset our forced hiding state lock whenever the text cursor selection moves
  useEffect(() => {
    if (!editor) return;
    const handleSelection = () => setIsForcedHidden(false);
    
    editor.on("selectionUpdate", handleSelection);
    return () => {
      editor.off("selectionUpdate", handleSelection);
    };
  }, [editor]);

  if (!editor) return null;

  return (
    <FloatingMenu
      editor={editor}
      updateDelay={50}
      shouldShow={({ editor: currentEditor }) => {
        if (isForcedHidden) return false;
        if (!currentEditor.isEditable) return false;
        if (!currentEditor.isActive("paragraph")) return false;

        const { $from } = currentEditor.state.selection;

        return (
          $from.parent.textContent.length === 0 &&
          $from.parentOffset === 0
        );
      }}
    >
      <div className="flex items-center gap-1 rounded-xl border border-slate-300 bg-white/95 backdrop-blur-sm p-1 shadow-xl select-none pointer-events-auto -translate-x-[52px]">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
          aria-label="Open slash commands menu"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            setIsForcedHidden(true);

            editor
              .chain()
              .focus()
              .insertContent("/")
              .run();

            const { view } = editor;
            const event = new KeyboardEvent("keydown", { key: "/" });
            view.someProp("handleKeyDown", (f) => f(view, event));
          }}
        >
          <Plus className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-slate-400 cursor-not-allowed hover:bg-transparent rounded-lg"
          aria-label="AI Assistant Options"
          onMouseDown={(e) => e.preventDefault()}
          disabled
        >
          <Sparkles className="h-4 w-4 text-amber-500/40" />
        </Button>
      </div>
    </FloatingMenu>
  );
}
