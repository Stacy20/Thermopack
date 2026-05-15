import type { GallerySlot } from '../components/ConfigGallery'

export function urlsToGallerySlots(urls: string[] | undefined, length: number): GallerySlot[] {
  const list = [...(urls ?? [])]
  while (list.length < length) list.push('')
  return list.slice(0, length).map((url): GallerySlot => (url ? { kind: 'existing', url } : { kind: 'empty' }))
}

export function padUrlList(urls: string[] | undefined, length: number): string[] {
  const list = [...(urls ?? [])]
  while (list.length < length) list.push('')
  return list.slice(0, length)
}

export function gallerySlotsDirtyAgainstUrls(slots: GallerySlot[], baselineUrls: string[]): boolean {
  for (let i = 0; i < slots.length; i++) {
    const s = slots[i]
    const b = baselineUrls[i] ?? ''
    if (s.kind === 'new') return true
    if (s.kind === 'empty' && b) return true
    if (s.kind === 'existing' && s.url !== b) return true
  }
  return false
}
