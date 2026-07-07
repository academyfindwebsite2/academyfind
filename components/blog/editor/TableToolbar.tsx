"use client";

import type { Editor } from "@tiptap/react";
import {
  Table2,
  Rows3,
  Columns3,
  Trash2,
  Plus,
  Minus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
  editor: Editor;
};

export default function TableToolbar({
  editor,
}: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          onMouseDown={(e) => e.preventDefault()} // Prevents losing focus on editor
          variant="ghost"
          size="icon"
          title="Table Settings"
        >
          <Table2 className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-64"
      >
        <DropdownMenuItem
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({
                rows: 3,
                cols: 3,
                withHeaderRow: true,
              })
              .run()
          }
        >
          <Table2 className="mr-2 h-4 w-4" />
          Insert Table
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onMouseDown={(e) => e.preventDefault()}
          onClick={() =>
            editor.chain().focus().addRowBefore().run()
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Row Above
        </DropdownMenuItem>

        <DropdownMenuItem
          onMouseDown={(e) => e.preventDefault()}
          onClick={() =>
            editor.chain().focus().addRowAfter().run()
          }
        >
          <Rows3 className="mr-2 h-4 w-4" />
          Add Row Below
        </DropdownMenuItem>

        <DropdownMenuItem
          onMouseDown={(e) => e.preventDefault()}
          onClick={() =>
            editor.chain().focus().deleteRow().run()
          }
        >
          <Minus className="mr-2 h-4 w-4" />
          Delete Row
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onMouseDown={(e) => e.preventDefault()}
          onClick={() =>
            editor.chain().focus().addColumnBefore().run()
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Column Left
        </DropdownMenuItem>

        <DropdownMenuItem
          onMouseDown={(e) => e.preventDefault()}
          onClick={() =>
            editor.chain().focus().addColumnAfter().run()
          }
        >
          <Columns3 className="mr-2 h-4 w-4" />
          Add Column Right
        </DropdownMenuItem>

        <DropdownMenuItem
          onMouseDown={(e) => e.preventDefault()}
          onClick={() =>
            editor.chain().focus().deleteColumn().run()
          }
        >
          <Minus className="mr-2 h-4 w-4" />
          Delete Column
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onMouseDown={(e) => e.preventDefault()}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeaderRow()
              .run()
          }
        >
          Toggle Header Row
        </DropdownMenuItem>

        <DropdownMenuItem
          onMouseDown={(e) => e.preventDefault()}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeaderColumn()
              .run()
          }
        >
          Toggle Header Column
        </DropdownMenuItem>

        <DropdownMenuItem
            onMouseDown={(e) => e.preventDefault()}
          onClick={() =>
            editor.chain().mergeCells()
              ? editor.chain().focus().mergeCells().run()
              : editor.chain().focus().splitCell().run()
          }
        >
          Merge / Split Cells
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
            onMouseDown={(e) => e.preventDefault()}
          disabled={!editor.can().deleteTable()}
          className="text-red-600"
          onClick={() =>
            editor.chain().focus().deleteTable().run()
          }
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Table
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}