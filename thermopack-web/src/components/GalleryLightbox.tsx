import { useCallback, useEffect, useRef, useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import Counter from 'yet-another-react-lightbox/plugins/counter'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'
import 'yet-another-react-lightbox/plugins/counter.css'
import { ChevronLeft, ChevronRight, Maximize2, Minus, Plus, RotateCcw } from 'lucide-react'

type Props = { images: string[] }

const MIN_SCALE = 1
const MAX_SCALE = 4

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

function touchDistance(a: { clientX: number; clientY: number }, b: { clientX: number; clientY: number }) {
  const dx = a.clientX - b.clientX
  const dy = a.clientY - b.clientY
  return Math.hypot(dx, dy)
}

type ZoomablePreviewProps = {
  src: string
  alt: string
  resetKey: number
  onRequestOpen: () => void
}

/** Vista previa principal: zoom (rueda, pinch, +/-) y capa para abrir en grande cuando no hay zoom. */
function ZoomablePreview({ src, alt, resetKey, onRequestOpen }: ZoomablePreviewProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const pinchStart = useRef<{ dist: number; scale: number; pan: { x: number; y: number } } | null>(null)
  const dragRef = useRef<{ pointerId: number; startX: number; startY: number; panX: number; panY: number } | null>(null)
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    setScale(1)
    setPan({ x: 0, y: 0 })
  }, [resetKey, src])

  useEffect(() => {
    if (scale <= MIN_SCALE + 0.001) setPan({ x: 0, y: 0 })
  }, [scale])

  const onWheel = useCallback((e: React.WheelEvent) => {
    if (!wrapRef.current?.contains(e.target as Node)) return
    e.preventDefault()
    const delta = -e.deltaY * 0.0015
    setScale((previousScale) => {
      const nextScale = clamp(previousScale + delta * previousScale, MIN_SCALE, MAX_SCALE)
      return nextScale
    })
  }, [])

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (scale <= MIN_SCALE) return
      if (e.button !== 0) return
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      dragRef.current = {
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        panX: pan.x,
        panY: pan.y,
      }
      setDragging(true)
    },
    [pan.x, pan.y, scale]
  )

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const dragState = dragRef.current
    if (!dragState || dragState.pointerId !== e.pointerId) return
    setPan({
      x: dragState.panX + (e.clientX - dragState.startX),
      y: dragState.panY + (e.clientY - dragState.startY),
    })
  }, [])

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    const dragState = dragRef.current
    if (dragState?.pointerId === e.pointerId) {
      dragRef.current = null
      setDragging(false)
    }
  }, [])

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2) {
        const d = touchDistance(e.touches[0], e.touches[1])
        pinchStart.current = { dist: d, scale, pan: { ...pan } }
      }
    },
    [pan, scale]
  )

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchStart.current) {
      e.preventDefault()
      const d = touchDistance(e.touches[0], e.touches[1])
      const ratio = d / pinchStart.current.dist
      const nextScale = clamp(pinchStart.current.scale * ratio, MIN_SCALE, MAX_SCALE)
      setScale(nextScale)
    }
  }, [])

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (e.touches.length < 2) pinchStart.current = null
  }, [])

  const zoomIn = () => {
    setScale((previousScale) => clamp(previousScale * 1.25, MIN_SCALE, MAX_SCALE))
  }
  const zoomOut = () => {
    setScale((previousScale) => clamp(previousScale / 1.25, MIN_SCALE, MAX_SCALE))
  }
  const reset = () => {
    setScale(1)
    setPan({ x: 0, y: 0 })
  }

  const showTapLayer = scale <= MIN_SCALE + 0.02

  return (
    <div
      ref={wrapRef}
      className="relative rounded-xl bg-neutral-100 border border-neutral-200/80 overflow-hidden select-none"
      onWheel={onWheel}
    >
      <div
        className="relative flex items-center justify-center min-h-[220px] md:min-h-[320px] max-h-[55vh] md:max-h-[480px] touch-manipulation"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <img
          src={src}
          alt={alt}
          draggable={false}
          className="max-h-[55vh] md:max-h-[480px] w-full object-contain pointer-events-none"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
            transition: dragging ? 'none' : 'transform 0.12s ease-out',
          }}
        />
        {showTapLayer && (
          <button
            type="button"
            className="absolute inset-0 z-10 cursor-zoom-in bg-transparent border-none"
            onClick={onRequestOpen}
            aria-label="Ver imagen en grande"
          />
        )}
      </div>

      <div className="absolute bottom-2 right-2 z-20 flex items-center gap-1 rounded-lg bg-black/55 p-1 backdrop-blur-sm">
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-white hover:bg-white/15 border-none bg-transparent cursor-pointer"
          onClick={zoomOut}
          aria-label="Alejar"
        >
          <Minus className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-white hover:bg-white/15 border-none bg-transparent cursor-pointer"
          onClick={zoomIn}
          aria-label="Acercar"
        >
          <Plus className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-white hover:bg-white/15 border-none bg-transparent cursor-pointer disabled:opacity-30"
          onClick={reset}
          disabled={scale <= MIN_SCALE && Math.abs(pan.x) < 1 && Math.abs(pan.y) < 1}
          aria-label="Restablecer zoom"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-white hover:bg-white/15 border-none bg-transparent cursor-pointer"
          onClick={onRequestOpen}
          aria-label="Abrir galería a pantalla completa"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export function GalleryLightbox({ images }: Props) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const thumbsRef = useRef<HTMLDivElement>(null)
  const slides = images.filter(Boolean).map((src) => ({ src }))

  const go = (direction: -1 | 1) => {
    setIndex((currentIndex) => {
      const slideCount = slides.length
      if (slideCount === 0) return 0
      return (currentIndex + direction + slideCount) % slideCount
    })
  }

  useEffect(() => {
    const el = thumbsRef.current?.querySelector(`[data-thumb-index="${index}"]`)
    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [index])

  if (slides.length === 0) return null

  const current = slides[index]!

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <ZoomablePreview
          src={current.src}
          alt={`Imagen ${index + 1} de ${slides.length}`}
          resetKey={index}
          onRequestOpen={() => setOpen(true)}
        />

        {slides.length > 1 && (
          <>
            <button
              type="button"
              className="absolute left-2 top-1/2 z-30 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-neutral-800 shadow-md border border-neutral-200/80 hover:bg-white cursor-pointer"
              onClick={() => go(-1)}
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              className="absolute right-2 top-1/2 z-30 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-neutral-800 shadow-md border border-neutral-200/80 hover:bg-white cursor-pointer"
              onClick={() => go(1)}
              aria-label="Imagen siguiente"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>

      {slides.length > 1 && (
        <div
          ref={thumbsRef}
          className="flex gap-2 overflow-x-auto pb-1 scroll-smooth snap-x snap-mandatory scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {slides.map((slide, thumbIndex) => (
            <button
              key={thumbIndex}
              type="button"
              data-thumb-index={thumbIndex}
              onClick={() => setIndex(thumbIndex)}
              className={`relative shrink-0 snap-center rounded-lg overflow-hidden border-2 transition-all ${
                thumbIndex === index ? 'border-brand-600 ring-2 ring-brand-500/30 scale-[1.02]' : 'border-transparent opacity-80 hover:opacity-100'
              }`}
              aria-label={`Miniatura ${thumbIndex + 1}`}
              aria-current={thumbIndex === index ? 'true' : undefined}
            >
              <img src={slide.src} alt="" className="h-16 w-20 object-cover" />
            </button>
          ))}
        </div>
      )}

      <p className="text-xs text-neutral-500 text-center md:text-left">
        Miniaturas: desliza horizontalmente. Vista previa: rueda o botones ± y pellizco para zoom; toca la imagen o el icono cuadrado para ampliar. En la galería: rueda, doble clic o pellizco para zoom.
      </p>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={slides}
        plugins={[Zoom, Thumbnails, Counter]}
        zoom={{
          maxZoomPixelRatio: 4,
          scrollToZoom: true,
          pinchZoomV4: true,
        }}
        thumbnails={{ position: 'bottom', width: 64, height: 48, gap: 8, border: 1, borderRadius: 8 }}
        counter={{ container: { style: { top: 'unset', bottom: 0 } } }}
        on={{
          view: ({ index: nextSlideIndex }) => setIndex(nextSlideIndex),
        }}
      />
    </div>
  )
}
