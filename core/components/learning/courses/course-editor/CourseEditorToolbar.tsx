"use client"

import type { Editor } from "@tiptap/react"
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Code,
  ImageIcon,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
  Pilcrow,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Info,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  FileCode,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface EditorToolbarProps {
  editor: Editor | null;
}

export default function CourseEditorToolbar({ editor }: EditorToolbarProps) {
  const addImage = () => {
    const url = window.prompt("Enter the URL of the image:")

    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const setCodeBlock = () => {
    // Ensure there's a blank line before and after the code block
    editor
      .chain()
      .focus()
      .command(({ tr, dispatch }) => {
        if (dispatch) {
          // If we're not at the start of a paragraph, insert a new paragraph before
          if (!editor.isActive("paragraph") || !editor.state.selection.empty) {
            tr.insert(tr.selection.from, editor.schema.nodes.paragraph.create())
          }
        }
        return true
      })
      .toggleCodeBlock()
      .run()
  }

  const setCodeTabs = () => {
    editor.chain().focus().setCodeTabs().run()
  }

  const setLanguage = (language: string) => {
    editor.chain().focus().updateAttributes("codeBlock", { language }).run()
  }

  const addAlert = (variant: string) => {
    editor.chain().focus().setAlert({ variant }).run()
  }

  const isCodeBlock = editor.isActive("codeBlock")

  return (
    <div className="border-b p-2 flex flex-wrap items-center gap-1 bg-gray-50">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      >
        <Undo className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
      >
        <Redo className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Toggle
        size="sm"
        pressed={editor.isActive("heading", { level: 1 })}
        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading1 className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive("heading", { level: 2 })}
        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive("heading", { level: 3 })}
        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 className="h-4 w-4" />
      </Toggle>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Toggle
        size="sm"
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Toggle>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Text alignment buttons */}
      <Toggle
        size="sm"
        pressed={editor.isActive({ textAlign: "left" })}
        onPressedChange={() => editor.chain().focus().setTextAlign("left").run()}
      >
        <AlignLeft className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive({ textAlign: "center" })}
        onPressedChange={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <AlignCenter className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive({ textAlign: "right" })}
        onPressedChange={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <AlignRight className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive({ textAlign: "justify" })}
        onPressedChange={() => editor.chain().focus().setTextAlign("justify").run()}
      >
        <AlignJustify className="h-4 w-4" />
      </Toggle>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Toggle
        size="sm"
        pressed={editor.isActive("bulletList")}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive("orderedList")}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </Toggle>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Toggle size="sm" pressed={isCodeBlock} onPressedChange={setCodeBlock} className="bg-opacity-100">
        <Code className="h-4 w-4" />
      </Toggle>

      <Button variant="ghost" size="sm" onClick={setCodeTabs} className="flex items-center gap-1">
        <FileCode className="h-4 w-4" />
        <span>Code Tabs</span>
      </Button>

      {isCodeBlock && (
        <Select value={editor.getAttributes("codeBlock").language || "javascript"} onValueChange={setLanguage}>
          <SelectTrigger className="h-8 w-24">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="jsx">JSX</SelectItem>
            <SelectItem value="typescript">TypeScript</SelectItem>
            <SelectItem value="tsx">TSX</SelectItem>
            <SelectItem value="css">CSS</SelectItem>
            <SelectItem value="html">HTML</SelectItem>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="java">Java</SelectItem>
          </SelectContent>
        </Select>
      )}

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Alert dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <Info className="h-4 w-4" />
            <span>Alert</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => addAlert("info")} className="flex items-center gap-2">
            <Info className="h-4 w-4 text-blue-500" />
            <span>Info</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => addAlert("warning")} className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <span>Warning</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => addAlert("error")} className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <span>Error</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => addAlert("success")} className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Success</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Button variant="ghost" size="sm" onClick={addImage}>
        <ImageIcon className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Toggle
        size="sm"
        pressed={editor.isActive("paragraph")}
        onPressedChange={() => editor.chain().focus().setParagraph().run()}
      >
        <Pilcrow className="h-4 w-4" />
      </Toggle>
    </div>
  )
}