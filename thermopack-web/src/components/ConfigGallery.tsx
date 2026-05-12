export type GallerySlot =
  | { kind: 'existing'; url: string }
  | { kind: 'new'; file: File; preview: string }
  | { kind: 'empty' }

type Props = {
  slots: GallerySlot[]
  identifier: string
  onSlotsChange: (slots: GallerySlot[], identifier: string) => void
}

export function ConfigGallery({ slots, identifier, onSlotsChange }: Props) {
  const handleFile = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0]
    if (!file) return
    const preview = URL.createObjectURL(file)
    const next = [...slots]
    next[index] = { kind: 'new', file, preview }
    onSlotsChange(next, identifier)
  }

  const removeSlot = (index: number) => {
    const next = [...slots]
    next[index] = { kind: 'empty' }
    onSlotsChange(next, identifier)
  }

  const displayUrl = (slot: GallerySlot): string | null => {
    if (slot.kind === 'existing') return slot.url
    if (slot.kind === 'new') return slot.preview
    return null
  }

  return (
    <div className="row">
      {slots.map((slot, index) => (
        <div key={index} className="col-md-3 mb-3">
          <div className="input-group mb-2">
            <input
              type="file"
              className="form-control"
              id={`file-${identifier}-${index}`}
              accept="image/*"
              onChange={(ev) => handleFile(ev, index)}
            />
            <label className="input-group-text" htmlFor={`file-${identifier}-${index}`}>
              Subir
            </label>
          </div>
          {displayUrl(slot) ? (
            <div>
              <img src={displayUrl(slot)!} alt="" className="img-fluid rounded" />
              <button
                type="button"
                className="btn btn-sm btn-danger mt-1"
                onClick={() => removeSlot(index)}
              >
                Quitar
              </button>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  )
}
