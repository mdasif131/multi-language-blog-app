
"use client"

import { useCallback, useEffect, useState } from "react"
import { FileRejection, useDropzone } from "react-dropzone"

import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { v4 as uuidv4 } from "uuid"
import { Card, CardContent } from "../ui/card"
import {
  RenderEmptyState,
  RenderErrorState,
  RenderUploadedState,
  RenderUploadingState,
} from "./RenderState"
import { useConstructUrl } from "@/hooks/use-construct-url"

interface UploaderState {
  id: string | null
  file: File | null
  uploading: boolean
  progress: number
  key?: string
  isDeleting: boolean
  error: boolean
  errorMessage?: string
  objectUrl?: string
  fileType: "image" | "video"
}

interface iAppProps {
  value?: string
  onChange?: (value: string) => void
  fileTypeAccepted: "image" | "video"
}
const Uploader = ({ value, onChange, fileTypeAccepted }: iAppProps) => {
  const fileUrl = useConstructUrl(value ?? "")
  const [fileState, setFileState] = useState<UploaderState>({
    error: false,
    file: null,
    id: null,
    uploading: false,
    progress: 0,
    isDeleting: false,
    fileType: fileTypeAccepted,
    key: value,
    objectUrl: value ? fileUrl : undefined,
  })

  const uploadFile = useCallback(
    async (file: File) => {
      setFileState((prev) => ({
        ...prev,
        uploading: true,
        progress: 0,
      }))

      try {
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest()
          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              // Reserve the last 5% for the server-to-storage upload.
              const percentageCompleted = (event.loaded / event.total) * 100
              setFileState((prev) => ({
                ...prev,
                progress: Math.round(percentageCompleted),
              }))
            }
          }
          xhr.onload = () => {
            let result: { key?: string; error?: string } = {}
            try {
              result = JSON.parse(xhr.responseText)
            } catch {
              // The server may return a non-JSON error page.
            }

            if (xhr.status >= 200 && xhr.status < 300 && result.key) {
              setFileState((prev) => ({
                ...prev,
                progress: 100,
                uploading: false,
                key: result.key,
              }))
              onChange?.(result.key)
              toast.success("File uploaded successfully")
              resolve()
            } else {
              reject(
                new Error(
                  result.error ?? `Upload failed (${xhr.status || "network error"})`
                )
              )
            }
          }
          xhr.onerror = () => {
            reject(new Error("Could not reach the upload server"))
          }
          xhr.open("PUT", "/api/s3/upload")
          xhr.setRequestHeader("Content-Type", file.type)
          xhr.setRequestHeader("X-File-Name", encodeURIComponent(file.name))
          xhr.setRequestHeader("X-File-Type", fileTypeAccepted)
          xhr.setRequestHeader("X-File-Size", file.size.toString())
          xhr.send(file)
        })
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "File upload failed"
        toast.error(errorMessage)
        setFileState((prev) => ({
          ...prev,
          progress: 0,
          error: true,
          uploading: false,
          file: null,
          objectUrl: undefined,
          key: undefined,
          errorMessage,
        }))
      }
    },
    [fileTypeAccepted, onChange]
  )

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]

        if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
          URL.revokeObjectURL(fileState.objectUrl)
        }
        setFileState({
          file: file,
          uploading: false,
          progress: 0,
          objectUrl: URL.createObjectURL(file),
          error: false,
          errorMessage: undefined,
          id: uuidv4(),
          isDeleting: false,
          fileType: fileTypeAccepted,
        })
        uploadFile(file)
      }
    },
    [fileState.objectUrl, fileTypeAccepted, uploadFile]
  )
  const handleRemoveFile = async () => {
    if (fileState.isDeleting || !fileState.objectUrl) return
    try {
      setFileState((prev) => ({
        ...prev,
        isDeleting: true,
      }))
      const response = await fetch("/api/s3/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: fileState.key,
        }),
      })
      if (!response.ok) {
        toast.error("Failed to remove file form storage")
        setFileState((prev) => ({
          ...prev,
          isDeleting: true,
          error: true,
        }))
        return
      }
      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl)
      }
      onChange?.("")
      setFileState(() => ({
        file: null,
        uploading: false,
        progress: 0,
        objectUrl: undefined,
        error: false,
        fileType: fileTypeAccepted,
        id: null,
        isDeleting: false,
      }))
      toast.success("File removed successfully")
    } catch {
      setFileState((prev) => ({
        ...prev,
        isDeleting: false,
        error: true,
      }))
      toast.error("Error removing file , Please try again")
    }
  }
  const rejectedFiles = (fileRejection: FileRejection[]) => {
    if (fileRejection.length) {
      const tooManyFiles = fileRejection.find(
        (rejection) => rejection.errors[0].code === "too-many-files"
      )
      if (tooManyFiles) {
        toast.error("Too many files selection, max is 1")
      }
      const fileSizeToBig = fileRejection.find(
        (rejection) => rejection.errors[0].code === "file-too-large"
      )
      if (fileSizeToBig) {
        toast.error("File Size exceeds the limit 5mb")
      }
    }
  }
  const renderContent = () => {
    if (fileState.uploading) {
      return (
        <RenderUploadingState
          file={fileState.file as File}
          progress={fileState.progress}
        />
      )
    }
    if (fileState.error) {
      return <RenderErrorState message={fileState.errorMessage} />
    }
    if (fileState.objectUrl) {
      return (
        <RenderUploadedState
          previewUrl={fileState.objectUrl}
          handleRemoveFile={handleRemoveFile}
          isDeleting={fileState.isDeleting}
          fileType={fileState.fileType}
        />
      )
    }
    return <RenderEmptyState isDragActive={isDragActive} />
  }
  useEffect(() => {
    return () => {
      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl)
      }
    }
  }, [fileState.objectUrl])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept:
      fileTypeAccepted === "video" ? { "video/*": [] } : { "image/*": [] },
    maxFiles: 1,
    multiple: false,
    maxSize: fileTypeAccepted === "image" ? 5 * 1024 * 1024 : 500 * 1024 * 1024,
    onDropRejected: rejectedFiles,
    disabled: fileState.uploading || !!fileState.objectUrl,
  })

  return (
    <Card
      {...getRootProps()}
      className={cn(
        "relative mt-1 min-h-60 cursor-pointer border-2 border-dashed p-10 text-center transition-colors",
        isDragActive
          ? "border-primary bg-primary/10"
          : "border-muted-foreground/25"
      )}
    >
      <input {...getInputProps()} />

      <CardContent className="flex items-center justify-center p-0">
        {renderContent()}
      </CardContent>
    </Card>
  )
}

export default Uploader
