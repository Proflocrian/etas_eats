// Re-encode a captured image to a downscaled JPEG so stored photos stay small.
// Returns the original blob unchanged if the browser can't process it, so a
// photo is never lost.
const MAX_EDGE = 1600
const QUALITY = 0.8

export async function compressImage(
  file: Blob,
  maxEdge = MAX_EDGE,
  quality = QUALITY,
): Promise<Blob> {
  try {
    // imageOrientation honours EXIF rotation (iOS camera photos).
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
    const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height))
    const w = Math.round(bitmap.width * scale)
    const h = Math.round(bitmap.height * scale)
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) return file
    ctx.drawImage(bitmap, 0, 0, w, h)
    bitmap.close()
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', quality),
    )
    return blob ?? file
  } catch {
    return file
  }
}
