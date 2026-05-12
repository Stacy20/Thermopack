import { useMemo } from 'react'

type Props = { images: string[] }

export function Carousel({ images }: Props) {
  const slides = useMemo(() => images.filter(Boolean), [images])
  const id = 'homeCarousel'

  if (slides.length === 0) return null

  return (
    <div id={id} className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-indicators">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            data-bs-target={`#${id}`}
            data-bs-slide-to={i}
            className={i === 0 ? 'active' : ''}
            aria-current={i === 0 ? 'true' : undefined}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
      <div className="carousel-inner">
        {slides.map((src, i) => (
          <div key={i} className={'carousel-item' + (i === 0 ? ' active' : '')}>
            <div className="d-flex justify-content-center p-2">
              <img src={src} className="d-block img-fluid rounded" alt="" style={{ maxHeight: 420 }} />
            </div>
          </div>
        ))}
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target={`#${id}`} data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true" />
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target={`#${id}`} data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true" />
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  )
}
