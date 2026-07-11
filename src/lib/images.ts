import { db } from '../db/db'
import { id as newId } from './id'
import type { ImageRef } from '../types/model'

const urlRegistry = new Map<string, string>()

export async function fileToImageRef(file: File): Promise<ImageRef> {
  const blobId = newId()
  const { width, height } = await naturalDimensions(file)
  await db.blobs.put({ id: blobId, data: file })
  return { blobId, width, height, mime: file.type }
}

export async function imageRefToObjectURL(ref: ImageRef): Promise<string> {
  const cached = urlRegistry.get(ref.blobId)
  if (cached) return cached

  const record = await db.blobs.get(ref.blobId)
  if (!record) throw new Error(`Blob not found: ${ref.blobId}`)

  const url = URL.createObjectURL(record.data)
  urlRegistry.set(ref.blobId, url)
  return url
}

export function revokeObjectURL(blobId: string): void {
  const url = urlRegistry.get(blobId)
  if (url) {
    URL.revokeObjectURL(url)
    urlRegistry.delete(blobId)
  }
}

function naturalDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to read image dimensions'))
    }
    img.src = url
  })
}
