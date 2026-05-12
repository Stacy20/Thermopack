type Props = {
  images: string[]
  identifier: string
  onImagesChange: (images: string[], identifier: string) => void
}

export function ConfigGallery({ images, identifier, onImagesChange }: Props) {
  const handleFile = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const next = [...images]
      next[index] = String(e.target?.result ?? '')
      onImagesChange(next, identifier)
    }
    reader.readAsDataURL(file)
  }

  const deleteImage = (index: number) => {
    const next = [...images]
    next[index] = ''
    onImagesChange(next, identifier)
  }

  return (
    <div className="row">
      {images.map((src, index) => (
        <div key={index} className="col-md-3 mb-3">
          <div className="input-group mb-2">
            <input type="file" className="form-control" id={`file-${identifier}-${index}`} accept="image/*" onChange={(ev) => handleFile(ev, index)} />
            <label className="input-group-text" htmlFor={`file-${identifier}-${index}`}>
              Subir
            </label>
          </div>
          {src ? (
            <div>
              <img src={src} alt="" className="img-fluid rounded" />
              <button type="button" className="btn btn-sm btn-danger mt-1" onClick={() => deleteImage(index)}>
                Quitar
              </button>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  )
}
