import { cn } from '../lib/utils'
import { Button } from './ui/button'

export type GallerySlot =
  | { kind: 'existing'; url: string }
  | { kind: 'new'; file: File; preview: string }
  | { kind: 'empty' }

type Props = {
  title?: string
  description?: string
  slots: GallerySlot[]
  identifier: string
  slotLabels?: readonly string[]
  className?: string
  onSlotsChange: (slots: GallerySlot[]) => void
}

export function ConfigGallery({ title, description, slots, identifier, slotLabels, className, onSlotsChange }: Props) {
  const handleFile = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0]
    if (!file) return
    const next = [...slots]
    next[index] = { kind: 'new', file, preview: URL.createObjectURL(file) }
    onSlotsChange(next)
  }

  const removeSlot = (index: number) => {
    const next = [...slots]
    next[index] = { kind: 'empty' }
    onSlotsChange(next)
  }

  const displayUrl = (slot: GallerySlot): string | null => {
    if (slot.kind === 'existing') return slot.url
    if (slot.kind === 'new') return slot.preview
    return null
  }

  return (
    <div className={cn('space-y-3', className)}>
      {title ? <h4 className="font-semibold text-foreground">{title}</h4> : null}
      {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {slots.map((slot, index) => (
          <div key={`${identifier}-${index}`} className="flex flex-col gap-2">
            {slotLabels?.[index] ? (
              <p className="text-xs font-medium text-muted-foreground leading-snug">{slotLabels[index]}</p>
            ) : null}
            <div className="flex rounded-md border border-input overflow-hidden">
              <input
                type="file"
                className="flex-1 px-2 py-1.5 text-sm border-none outline-none min-w-0"
                id={`file-${identifier}-${index}`}
                accept="image/*"
                onChange={(ev) => handleFile(ev, index)}
              />
              <label
                htmlFor={`file-${identifier}-${index}`}
                className="px-3 py-1.5 bg-muted border-l border-input text-sm text-muted-foreground cursor-pointer whitespace-nowrap hover:bg-secondary transition-colors"
              >
                Subir
              </label>
            </div>
            {displayUrl(slot) && (
              <div className="flex flex-col gap-1">
                <img src={displayUrl(slot)!} alt="" className="w-full h-28 object-cover rounded-md border border-border" />
                <Button type="button" variant="destructive" size="sm" onClick={() => removeSlot(index)}>
                  Quitar
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
