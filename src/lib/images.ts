import { db } from '../db/db'
import { id as newId } from './id'
import type { ImageRef } from '../types/model'

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve((reader.result as string).split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

function base64ToBlob(base64: string, mime: string): Blob {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return new Blob([bytes], { type: mime })
}

export async function exportBlobs(
  refs: ImageRef[],
): Promise<Record<string, { data: string; mime: string }>> {
  const result: Record<string, { data: string; mime: string }> = {}
  for (const ref of refs) {
    const record = await db.blobs.get(ref.blobId)
    if (!record) continue
    result[ref.blobId] = { data: await blobToBase64(record.data), mime: ref.mime }
  }
  return result
}

export async function importBlobs(
  blobs: Record<string, { data: string; mime: string }>,
): Promise<Map<string, string>> {
  const idMap = new Map<string, string>()
  for (const [oldId, { data, mime }] of Object.entries(blobs)) {
    const id = newId()
    await db.blobs.put({ id, data: base64ToBlob(data, mime) })
    idMap.set(oldId, id)
  }
  return idMap
}

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
