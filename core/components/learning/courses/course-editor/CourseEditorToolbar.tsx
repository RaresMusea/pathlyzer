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
    ListChecks,
    Underline,
    Code2Icon,
    Group,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface EditorToolbarProps {
    editor: Editor | null;
    language: string;
    setLanguage: (newLang: string) => void;
}


export default function CourseEditorToolbar({ editor, language, setLanguage }: EditorToolbarProps) {
    if (!editor) {
        return <p>Invalid editor</p>
    }

    const addImage = () => {
        const url = window.prompt("Enter the URL of the image:")

        if (url) {
            editor.chain().focus().setImage({ src: url }).run()
        }
    }

    const setCodeBlock = () => {
        editor
            .chain()
            .focus()
            .command(({ tr, dispatch }) => {
                if (dispatch) {
                    if (!editor.isActive("paragraph") || !editor.state.selection.empty) {
                        tr.insert(tr.selection.from, editor.schema.nodes.paragraph.create())
                    }
                }
                return true
            })
            .toggleCodeBlock()
            .run()
    }

    const addCodeGroup = () => {
        editor.chain().focus().insertContent([
            {
                type: 'codeGroup',
                content: []
            },
            {
                type: 'paragraph'
            }
        ]).run()
    };

    const isCodeBlock = editor.isActive("codeBlock")
    const isCodeGroup = editor.isActive('codeGroup');

    return (
        <div className="border-b p-2 flex flex-wrap items-center gap-1 bg-gray-50 dark:bg-[#2A2D33] text-gray-900 dark:text-white">
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

            <Separator orientation="vertical" className="mx-1 h-6 border-gray-300 dark:border-gray-700 dark:bg-gray-500" />

            <Toggle
                size="sm"
                pressed={editor.isActive("heading", { level: 1 })}
                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 ${editor.isActive("heading", { level: 1 }) ? 'bg-blue-500 dark:bg-blue-600' : ''}`}
            >
                <Heading1 className="h-4 w-4" />
            </Toggle>

            <Toggle
                size="sm"
                pressed={editor.isActive("heading", { level: 2 })}
                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 ${editor.isActive("heading", { level: 2 }) ? 'bg-blue-500 dark:bg-blue-600' : ''}`}
            >
                <Heading2 className="h-4 w-4" />
            </Toggle>

            <Toggle
                size="sm"
                pressed={editor.isActive("heading", { level: 3 })}
                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 ${editor.isActive("heading", { level: 3 }) ? 'bg-blue-500 dark:bg-blue-600' : ''}`}
            >
                <Heading3 className="h-4 w-4" />
            </Toggle>

            <Separator orientation="vertical" className="mx-1 h-6 border-gray-300 dark:border-gray-700 dark:bg-gray-500" />

            <Toggle
                size="sm"
                pressed={editor.isActive("bold")}
                onPressedChange={() => editor.chain().focus().toggleBold().run()}
                className={`bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 ${editor.isActive("bold") ? 'bg-blue-500 dark:bg-blue-600' : ''}`}
            >
                <Bold className="h-4 w-4" />
            </Toggle>

            <Toggle
                size="sm"
                pressed={editor.isActive("italic")}
                onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                className={`bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 ${editor.isActive("italic") ? 'bg-blue-500 dark:bg-blue-600' : ''}`}
            >
                <Italic className="h-4 w-4" />
            </Toggle>

            <Toggle
                size="sm"
                pressed={editor.isActive("underline")}
                onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
                className={`bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 ${editor.isActive("underline") ? 'bg-blue-500 dark:bg-blue-600' : ''}`}
            >
                <Underline className="h-4 w-4" />
            </Toggle>

            <Separator orientation="vertical" className="mx-1 h-6 border-gray-300 dark:border-gray-700 dark:bg-gray-500" />

            <Toggle
                size="sm"
                pressed={editor.isActive({ textAlign: "left" })}
                onPressedChange={() => editor.chain().focus().setTextAlign("left").run()}
                className={`bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 ${editor.isActive({ textAlign: "left" }) ? 'bg-blue-500 dark:bg-blue-600' : ''}`}
            >
                <AlignLeft className="h-4 w-4" />
            </Toggle>

            <Toggle
                size="sm"
                pressed={editor.isActive({ textAlign: "center" })}
                onPressedChange={() => editor.chain().focus().setTextAlign("center").run()}
                className={`bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 ${editor.isActive({ textAlign: "center" }) ? 'bg-blue-500 dark:bg-blue-600' : ''}`}
            >
                <AlignCenter className="h-4 w-4" />
            </Toggle>

            <Toggle
                size="sm"
                pressed={editor.isActive({ textAlign: "right" })}
                onPressedChange={() => editor.chain().focus().setTextAlign("right").run()}
                className={`bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 ${editor.isActive({ textAlign: "right" }) ? 'bg-blue-500 dark:bg-blue-600' : ''}`}
            >
                <AlignRight className="h-4 w-4" />
            </Toggle>

            <Toggle
                size="sm"
                pressed={editor.isActive({ textAlign: "justify" })}
                onPressedChange={() => editor.chain().focus().setTextAlign("justify").run()}
                className={`bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 ${editor.isActive({ textAlign: "justify" }) ? 'bg-blue-500 dark:bg-blue-600' : ''}`}
            >
                <AlignJustify className="h-4 w-4" />
            </Toggle>

            <Separator orientation="vertical" className="mx-1 h-6 border-gray-300 dark:border-gray-700 dark:bg-gray-500" />

            <Toggle
                size="sm"
                pressed={editor.isActive("bulletList")}
                onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                className={`bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 ${editor.isActive("bulletList") ? 'bg-blue-500 dark:bg-blue-600' : ''}`}
            >
                <List className="h-4 w-4" />
            </Toggle>

            <Toggle
                size="sm"
                pressed={editor.isActive("orderedList")}
                onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                className={`bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 ${editor.isActive("orderedList") ? 'bg-blue-500 dark:bg-blue-600' : ''}`}
            >
                <ListOrdered className="h-4 w-4" />
            </Toggle>

            <Toggle
                size="sm"
                pressed={editor.isActive("taskList")}
                onPressedChange={() => editor.chain().focus().toggleTaskList().run()}
                className={`bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 ${editor.isActive("taskList") ? 'bg-blue-500 dark:bg-blue-600' : ''}`}
            >
                <ListChecks className="h-4 w-4" />
            </Toggle>

            <Separator orientation="vertical" className="mx-1 h-6 border-gray-300 dark:border-gray-700 dark:bg-gray-500" />

            <Toggle size="sm" pressed={isCodeBlock} onPressedChange={setCodeBlock} className={`bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 ${isCodeBlock ? 'bg-blue-500 dark:bg-blue-600' : ''}`}>
                <Code className="h-4 w-4" />
            </Toggle>

            <Toggle size="sm" pressed={isCodeGroup} onPressedChange={addCodeGroup} className={`bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 ${isCodeBlock ? 'bg-blue-500 dark:bg-blue-600' : ''}`}>
                <Group className="h-4 w-4 mr-1" /> Code Group
            </Toggle>

            {isCodeBlock && (
                <Select value={language || "javascript"} onValueChange={setLanguage}>
                    <SelectTrigger className="h-8 w-24 bg-gray-100 dark:bg-gray-700">
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

            <Separator orientation="vertical" className="mx-1 h-6 border-gray-300 dark:border-gray-700 dark:bg-gray-500" />

            {/* Alert dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <Info className="h-4 w-4" />
                        <span>Alert</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => { }} className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-blue-500" />
                        <span>Info</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { }} className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <span>Warning</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { }} className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <span>Error</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { }} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Success</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Separator orientation="vertical" className="mx-1 h-6 border-gray-300 dark:border-gray-700 dark:bg-gray-500" />

            <Button variant="ghost" size="sm" onClick={addImage} className="hover:bg-gray-200 dark:hover:bg-gray-700">
                <ImageIcon className="h-4 w-4" />
            </Button>

            <Separator orientation="vertical" className="mx-1 h-6 border-gray-300 dark:border-gray-700 dark:bg-gray-500" />

            <Toggle
                size="sm"
                pressed={editor.isActive("paragraph")}
                onPressedChange={() => editor.chain().focus().setParagraph().run()}
                className={`bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 ${editor.isActive("paragraph") ? 'bg-blue-500 dark:bg-blue-600' : ''}`}
            >
                <Pilcrow className="h-4 w-4" />
            </Toggle>
        </div>
    )
}