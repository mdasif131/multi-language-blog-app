import { cn } from "@/lib/utils"
import { CloudUploadIcon, ImageIcon, Loader, XIcon } from "lucide-react"
import { Button } from "../ui/button"
import Image from "next/image"

export const RenderEmptyState = ({
  isDragActive,
}: {
  isDragActive: boolean
}) => {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
        <CloudUploadIcon
          className={cn(
            "size-6 text-muted-foreground",
            isDragActive && "text-primary"
          )}
        />
      </div>
      <p className="text-base font-semibold text-foreground">
        Drag & drop some files here, or{" "}
        <span className="cursor-pointer font-bold text-primary">
          click to upload
        </span>
      </p>
      <Button type="button" className="mt-4">
        Select File
      </Button>
    </div>
  )
}

export const RenderErrorState = ({ message }: { message?: string }) => {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/30">
        <ImageIcon className={cn("size-6 text-destructive")} />
      </div>
      <p className="text-base font-semibold">Upload Failed</p>
      <p className="mt-1 text-xs text-muted-foreground">
        {message ?? "Something went wrong"}
      </p>
      <Button type="button" className="mt-4">
        Retry file selection
      </Button>
    </div>
  )
}
export const RenderUploadedState = ({
  previewUrl,
  isDeleting,
  handleRemoveFile,
  fileType,
}: {
  previewUrl: string
  isDeleting: boolean
  handleRemoveFile: () => void
  fileType: "image" | "video"
}) => {
  return (
    <div className="relative flex w-full items-center justify-center">
      {fileType === "video" ? (
        <video
          src={previewUrl}
          controls
          className="h-auto max-h-100 w-full rounded-md object-contain"
        />
      ) : (
        <div className="relative h-40 w-full">
          <Image
            src={previewUrl}
            alt="Uploaded File"
            fill
            unoptimized={
              previewUrl.startsWith("blob:") || previewUrl.startsWith("data:")
            }
            className="object-contain "
          />
        </div>
      )}
      <Button
        type="button"
        variant={"destructive"}
        size={"icon"}
        className={cn("absolute top-4 right-4")}
        onClick={handleRemoveFile}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <Loader className="size-4 animate-spin" />
        ) : (
          <XIcon className="size-4" />
        )}
      </Button>
    </div>
  )
}

export const RenderUploadingState = ({
  progress,
  file,
}: {
  progress: number
  file: File
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <p className="text-xl text-primary">{progress}</p>
      <p className="mt-2 text-sm font-medium text-foreground">Uploadng...</p>
      <p className="mt-1 max-w-xs truncate text-xs text-muted-foreground">
        {file.name}
      </p>
    </div>
  )
}
