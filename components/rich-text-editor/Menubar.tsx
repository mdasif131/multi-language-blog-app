import { cn } from "@/lib/utils"
import { type Editor } from "@tiptap/react"
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  Bold,
  BoxSelect,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  Italic,
  ListIcon,
  ListOrderedIcon,
  Redo,
  StrikethroughIcon,
  Undo,
} from "lucide-react"
import { Button } from "../ui/button"
import { Toggle } from "../ui/toggle"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"
interface iWebProps {
  editor: Editor | null
}
const Menubar = ({ editor }: iWebProps) => {
  if (!editor) {
    return null
  }
  return (
    <div className="flex flex-wrap items-center gap-1 rounded-t-lg border border-x-0 border-t-0 border-input bg-card p-2">
      <TooltipProvider>
        <div className="flex flex-wrap gap-1 shadow-[0_4px_10px_rgba(0,0,0,0.25)]">
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size={"sm"}
                pressed={editor.isActive("bold")}
                onPressedChange={() => {
                  editor.chain().focus().toggleBold().run()
                }}
                className={cn(
                  editor.isActive("bold") && "bg-muted text-muted-foreground"
                )}
              >
                <Bold />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Bold</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size={"sm"}
                pressed={editor.isActive("italic")}
                onPressedChange={() => {
                  editor.chain().focus().toggleItalic().run()
                }}
                className={cn(
                  editor.isActive("italic") && "bg-muted text-muted-foreground"
                )}
              >
                <Italic />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Italic</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size={"sm"}
                pressed={editor.isActive("strike")}
                onPressedChange={() => {
                  editor.chain().focus().toggleStrike().run()
                }}
                className={cn(
                  editor.isActive("strike") && "bg-muted text-muted-foreground"
                )}
              >
                <StrikethroughIcon />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Strike</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size={"sm"}
                pressed={editor.isActive("heading", { level: 1 })}
                onPressedChange={() => {
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                }}
                className={cn(
                  editor.isActive("heading", { level: 1 }) &&
                    "bg-muted text-muted-foreground"
                )}
              >
                <Heading1Icon />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Heading 1</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size={"sm"}
                pressed={editor.isActive("heading", { level: 2 })}
                onPressedChange={() => {
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }}
                className={cn(
                  editor.isActive("heading", { level: 2 }) &&
                    "bg-muted text-muted-foreground"
                )}
              >
                <Heading2Icon />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Heading 2</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size={"sm"}
                pressed={editor.isActive("heading", { level: 3 })}
                onPressedChange={() => {
                  editor.chain().focus().toggleHeading({ level: 3 }).run()
                }}
                className={cn(
                  editor.isActive("heading", { level: 3 }) &&
                    "bg-muted text-muted-foreground"
                )}
              >
                <Heading3Icon />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Heading 3</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size={"sm"}
                pressed={editor.isActive("bulletList")}
                onPressedChange={() => {
                  editor.chain().focus().toggleBulletList().run()
                }}
                className={cn(
                  editor.isActive("bulletList") &&
                    "bg-muted text-muted-foreground"
                )}
              >
                <ListIcon />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Bullet List</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size={"sm"}
                pressed={editor.isActive("orderedList")}
                onPressedChange={() => {
                  editor.chain().focus().toggleOrderedList().run()
                }}
                className={cn(
                  editor.isActive("orderedList") &&
                    "bg-muted text-muted-foreground"
                )}
              >
                <ListOrderedIcon />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Ordered List</TooltipContent>
          </Tooltip>
        </div>
        <div className="mx-2 h-6 w-px bg-border"></div>
        <div className="flex flex-wrap gap-1 shadow-[0_4px_10px_rgba(0,0,0,0.25)]">
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size={"sm"}
                pressed={editor.isActive({ TextAlign: "left" })}
                onPressedChange={() => {
                  editor.chain().focus().setTextAlign("left").run()
                }}
                className={cn(
                  editor.isActive({ TextAlign: "left" }) &&
                    "bg-muted text-muted-foreground"
                )}
              >
                <AlignLeftIcon />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Align Left</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size={"sm"}
                pressed={editor.isActive({ TextAlign: "center" })}
                onPressedChange={() => {
                  editor.chain().focus().setTextAlign("center").run()
                }}
                className={cn(
                  editor.isActive({ TextAlign: "center" }) &&
                    "bg-muted text-muted-foreground"
                )}
              >
                <AlignCenterIcon />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Align Center</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size={"sm"}
                pressed={editor.isActive({ TextAlign: "right" })}
                onPressedChange={() => {
                  editor.chain().focus().setTextAlign("right").run()
                }}
                className={cn(
                  editor.isActive({ TextAlign: "right" }) &&
                    "bg-muted text-muted-foreground"
                )}
              >
                <AlignRightIcon />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Align Right</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive({ textAlign: "justify" })}
                onPressedChange={() => {
                  editor.chain().focus().setTextAlign("justify").run()
                }}
                className={cn(
                  editor.isActive({ textAlign: "justify" }) &&
                    "bg-muted text-muted-foreground"
                )}
              >
                <AlignJustifyIcon />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Align Justify</TooltipContent>
          </Tooltip>
        </div>

        <div className="mx-2 h-6 w-px bg-border"></div>
        <div className="flex flex-wrap gap-1 shadow-[0_4px_10px_rgba(0,0,0,0.25)]">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size={"sm"}
                variant={"ghost"}
                type="button"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
              >
                {" "}
                <Undo />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size={"sm"}
                variant={"ghost"}
                type="button"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
              >
                {" "}
                <Redo />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  )
}

export default Menubar
