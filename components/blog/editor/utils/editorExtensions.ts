import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import ImageResize from "tiptap-extension-resize-image";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import CharacterCount from "@tiptap/extension-character-count";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Youtube from "@tiptap/extension-youtube";
import Color from '@tiptap/extension-color';
import { TextStyle, FontSize } from '@tiptap/extension-text-style';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import { common, createLowlight } from "lowlight";
import GlobalDragHandle from 'tiptap-extension-global-drag-handle';
import FontFamily from '@tiptap/extension-font-family';

// Correct modern lowlight instance creation syntax 
const lowlight = createLowlight(common);

export const editorExtensions = (placeholder: string) => [
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3, 4],
    },
    // Prevent rendering collisions between standard pre tags and syntax blocks
    codeBlock: false, 
  }),

  Placeholder.configure({
    placeholder,
  }),

  Underline,

  Highlight.configure({
    multicolor: true,
  }),

  Link.configure({
    autolink: true,
    openOnClick: false,
    linkOnPaste: true,
    HTMLAttributes: {
      class: "text-amber-600 no-underline hover:underline cursor-pointer",
    },
  }),

  ImageResize.configure({
    inline: false,
    allowBase64: false,
  }),

  Typography,

  CharacterCount,

  HorizontalRule,

  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),

  CodeBlockLowlight.configure({
    lowlight,
  }),

  Table.configure({
    resizable: true,
  }),

  TableRow,

  TableHeader,

  TableCell,

  TaskList,

  TaskItem.configure({
    nested: true,
  }),

  Youtube.configure({
    controls: true,
    nocookie: true,
    modestBranding: true,
  }),

  Color, // Automatically provisions underlying TextStyles internally in v3
  TextStyle,
  Subscript,
  Superscript,
  FontFamily,
  FontSize,
  GlobalDragHandle.configure({
    dragHandleWidth: 20,
    scrollTreshold: 100,
  }),
];
