"use client";

import { useState } from "react";
import type { Editor } from "@tiptap/react";
import {
  Code2,
  Copy,
  Check,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area"; // Safe layout for 22 languages

const LANGUAGES = [
  "plaintext", "typescript", "javascript", "tsx", "jsx",
  "python", "java", "c", "cpp", "csharp", "go", "rust",
  "php", "ruby", "swift", "kotlin", "sql", "bash", "json",
  "yaml", "html", "css",
];

type Props = {
  editor: Editor;
};

export default function CodeBlockToolbar({ editor }: Props) {
  const [copied, setCopied] = useState(false);

  const isCodeBlockActive = editor.isActive("codeBlockLowlight");
  const attrs = editor.getAttributes("codeBlockLowlight");

  async function copyCode() {
    const { state } = editor;
    const { selection } = state;
    
    let codeText = "";

    state.doc.nodesBetween(selection.from, selection.to, (node: any) => {
      if (node.type.name === "codeBlockLowlight") {
        codeText = node.textContent;
      }
    });

    if (!codeText) return;

    await navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
            onMouseDown={(e) => e.preventDefault()} // Prevents losing focus on editor
          type="button"
          variant={isCodeBlockActive ? "default" : "ghost"}
          size="icon"
          title="Code Block Settings"
        >
          <Code2 className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-64">
        {!isCodeBlockActive ? (
          <DropdownMenuItem
            onClick={() =>
              editor.chain().focus().toggleCodeBlock().run()
            }
            onMouseDown={(e) => e.preventDefault()}
          >
            <Code2 className="mr-2 h-4 w-4" />
            Insert Code Block
          </DropdownMenuItem>
        ) : (
          <>
            {/* FIX 3: Use ScrollArea to avoid extreme vertical viewport overflow */}
            <ScrollArea className="h-60">
              {LANGUAGES.map((language: string) => {
                const isSelected = attrs.language === language;
                return (
                  <DropdownMenuItem
                    key={language}
                    onClick={() =>
                      editor
                        .chain()
                        .focus()
                        .updateAttributes("codeBlockLowlight", { language })
                        .run()
                    }
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {isSelected ? (
                      <Check className="mr-2 h-4 w-4 text-amber-600" />
                    ) : (
                      <div className="mr-2 h-4 w-4" /> // Spacing fallback
                    )}
                    <span className={isSelected ? "font-semibold text-amber-600" : ""}>
                      {language}
                    </span>
                  </DropdownMenuItem>
                );
              })}
            </ScrollArea>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={copyCode} onMouseDown={(e) => e.preventDefault()}>
              {copied ? (
                <Check className="mr-2 h-4 w-4 text-green-600" />
              ) : (
                <Copy className="mr-2 h-4 w-4" />
              )}
              {copied ? "Copied" : "Copy Code"}
            </DropdownMenuItem>

            <DropdownMenuItem
              className="text-red-600"
              onClick={() =>
                editor.chain().focus().deleteNode("codeBlockLowlight").run()
              }
              onMouseDown={(e) => e.preventDefault()}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Code Block
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
