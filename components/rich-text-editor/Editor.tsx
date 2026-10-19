"use client"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import TextAlign from "@tiptap/extension-text-align"
import Menubar from "./Menubar"
const RichTextEditor = ({
  field,
}: {
  field: { value?: string | null; onChange: (value: string) => void }
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],

    editorProps: {
      attributes: {
        class:
          "rich-text-content min-h-[300px] w-full max-w-none p-4 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      field.onChange(JSON.stringify(editor.getJSON()))
    },
    content: (() => {
      if (!field.value) return "<p>Hello World...</p>"

      try {
        return JSON.parse(field.value)
      } catch {
        return field.value
      }
    })(),
    immediatelyRender: false,
  })
  return (
    <div className="mt-1 w-full overflow-hidden rounded-lg border border-input dark:bg-input/30 bg-background">
      <Menubar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}

export default RichTextEditor
