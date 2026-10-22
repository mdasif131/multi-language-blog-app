import { PutObjectCommand } from "@aws-sdk/client-s3"
import { NextResponse } from "next/server"
import { Readable } from "node:stream"
import { v4 as uuidv4 } from "uuid"
import { z } from "zod"

import { env } from "@/lib/env"
import { S3 } from "@/lib/s3Client"
import arcjet, { fixedWindow } from "@/lib/arcjet"
import { requireAdmin } from "@/app/data/admin/require-admin"

export const runtime = "nodejs"

const uploadMetadataSchema = z.object({
  fileName: z.string().min(1).max(255),
  contentType: z.string().min(1),
  fileType: z.enum(["image", "video"]),
  size: z.coerce.number().int().positive(),
})
const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 5,
  })
)
const maxUploadSize = {
  image: 5 * 1024 * 1024,
  video: 500 * 1024 * 1024,
} as const

function makeCheckedBody(
  body: ReadableStream<Uint8Array>,
  expectedSize: number
) {
  async function* chunks() {
    const reader = body.getReader()
    let bytesRead = 0

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        bytesRead += value.byteLength
        if (bytesRead > expectedSize) {
          throw new Error("The uploaded body is larger than its declared size")
        }

        yield value
      }

      if (bytesRead !== expectedSize) {
        throw new Error("The uploaded body does not match its declared size")
      }
    } finally {
      reader.releaseLock()
    }
  }

  return Readable.from(chunks())
}

export async function PUT(request: Request) {
  const session = await requireAdmin()
  let fileName: string
  try {
    fileName = decodeURIComponent(request.headers.get("x-file-name") ?? "")
  } catch {
    return NextResponse.json({ error: "Invalid file name" }, { status: 400 })
  }
  const decision = await aj.protect(request, { fingerprint: session?.user.id as string })
  if (decision.isDenied()) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    )
  }
  const parsedMetadata = uploadMetadataSchema.safeParse({
    fileName,
    contentType: request.headers.get("content-type"),
    fileType: request.headers.get("x-file-type"),
    size: request.headers.get("x-file-size"),
  })

  if (!parsedMetadata.success) {
    return NextResponse.json(
      { error: "Invalid upload metadata" },
      { status: 400 }
    )
  }

  const {
    fileName: metadataFileName,
    contentType,
    fileType,
    size,
  } = parsedMetadata.data
  const safeFileName = metadataFileName.replace(/[\\/\u0000-\u001f]/g, "_")

  if (
    (fileType === "image" && !contentType.startsWith("image/")) ||
    (fileType === "video" && !contentType.startsWith("video/"))
  ) {
    return NextResponse.json(
      { error: "The file type does not match the selected upload type" },
      { status: 400 }
    )
  }

  if (size > maxUploadSize[fileType]) {
    return NextResponse.json(
      { error: "The file is too large" },
      { status: 413 }
    )
  }

  if (!request.body) {
    return NextResponse.json(
      { error: "The upload body is empty" },
      { status: 400 }
    )
  }

  const key = `${uuidv4()}-${safeFileName}`

  try {
    const command = new PutObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
      Key: key,
      ContentType: contentType,
      ContentLength: size,
      Body: makeCheckedBody(request.body, size),
    })

    await S3.send(command)
    return NextResponse.json({ key })
  } catch (error) {
    console.error("Failed to upload file to S3-compatible storage", error)
    const errorCode = error instanceof Error ? error.name : "UnknownError"
    const errorMessage =
      errorCode === "SignatureDoesNotMatch"
        ? "Tigris rejected the access key and secret key. Check AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in .env."
        : `Storage upload failed (${errorCode})`
    return NextResponse.json({ error: errorMessage }, { status: 502 })
  }
}
