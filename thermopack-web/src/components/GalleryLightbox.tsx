import { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

type Props = { images: string[] }

export function GalleryLightbox({ images }: Props) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const slides = images.filter(Boolean).map((src) => ({ src }))

  if (slides.length === 0) return null

  return (
    <>
      <div className="row g-2">
        {slides.map((s, i) => (
          <div key={i} className="col-6 col-md-4">
            <button type="button" className="btn p-0 border-0 w-100" onClick={() => { setIndex(i); setOpen(true); }}>
              <img src={s.src} alt="" className="img-fluid rounded" />
            </button>
          </div>
        ))}
      </div>
      <Lightbox open={open} close={() => setOpen(false)} index={index} slides={slides} />
    </>
  )
}
