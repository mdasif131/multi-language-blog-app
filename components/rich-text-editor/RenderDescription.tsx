"use client"

import { useMemo } from "react"
import { generateHTML } from "@tiptap/core"
import { type JSONContent } from "@tiptap/react"

import StarterKit from "@tiptap/starter-kit"
import TextAlign from "@tiptap/extension-text-align"

interface RenderDescriptionProps {
  json: JSONContent
}
const RenderDescription = ({ json }: RenderDescriptionProps) => {
  const html = useMemo(
    () =>
      generateHTML(json, [
        StarterKit.configure({
          heading: { levels: [1, 2, 3] },
        }),
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
      ]),
    [json]
  )

  return (
    <div
      className="rich-text-content max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

export default RenderDescription
