import { useEffect, useState } from 'react'
import { X, ShoppingCart, FileText, Plus, Minus, Star, Check } from 'lucide-react'
import { GalleryLightbox } from './GalleryLightbox'
import { formatColon, formatDescription } from '../utils/text'
import type { Products } from '../types/products'

type Props = {
  product: Products | null
  onClose: () => void
  whatsapp: string
}

function buildWhatsappUrl(phone: string, message: string) {
  const digits = phone.replace(/\D/g, '')
  if (!digits) return ''
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}

export function ProductDetailModal({ product, onClose, whatsapp }: Props) {

  useEffect(() => {
    if (!product) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [product, onClose])


  if (!product) return null

  const categoryLabel = (product.category ?? '').toUpperCase()
  const brandLabel = product.brand?.trim() ?? ''
  const listPrice = product.listPrice
  const hasDiscount = listPrice != null && listPrice > 0 && product.price > 0 && listPrice > product.price
  const discountPct = hasDiscount ? Math.round((1 - product.price / listPrice) * 100) : 0
  const starsFilled =
    product.rating != null ? Math.min(5, Math.max(0, Math.round(Number(product.rating)))) : 5
  const features = (product.features ?? []).filter((f) => f.trim().length > 0)


  const waQuote = whatsapp
    ? buildWhatsappUrl(
        whatsapp,
        `Hola, solicito cotización / información sobre el producto:\n\n• ${product.name}\n• ${formatColon(product.price)}\n\nGracias.`
      )
    : ''

  return (
    <div
      className="fixed inset-0 z-50 bg-black/55 flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto relative border border-slate-100"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-detail-title"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-sky-100 hover:bg-sky-200 border-none cursor-pointer text-sky-800 transition-colors shadow-sm"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" strokeWidth={2.5} />
        </button>

        <div className="p-5 sm:p-7 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-start pt-12 sm:pt-10">
          <div className="rounded-2xl bg-slate-50 p-3 sm:p-4 border border-slate-200/90 order-2 lg:order-1">
            {product.images?.length > 0 ? (
              <GalleryLightbox images={product.images} />
            ) : (
              <div className="h-52 flex items-center justify-center text-6xl text-slate-300 rounded-xl">📦</div>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:gap-4 order-1 lg:order-2 pr-2">
            {categoryLabel && (
              <span className="inline-block w-fit rounded-full bg-sky-50 text-sky-700 text-[0.65rem] sm:text-[0.7rem] font-bold uppercase tracking-[0.14em] px-3 py-1.5 border border-sky-100">
                {categoryLabel}
              </span>
            )}
            <h2
              id="product-detail-title"
              className="font-display text-xl sm:text-2xl lg:text-[1.65rem] font-extrabold text-[#0a1f5c] leading-snug pr-6"
            >
              {product.name}
            </h2>

            {brandLabel && <p className="text-sm text-slate-500">por {brandLabel}</p>}

            {product.price != null && product.price > 0 && (
              <div className="flex flex-wrap items-end gap-2 sm:gap-3 pt-1">
                <span className="font-display text-2xl sm:text-3xl font-extrabold text-[#0a1f5c]">
                  {formatColon(product.price)}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-base text-slate-400 line-through pb-0.5">{formatColon(listPrice!)}</span>
                    <span className="inline-flex items-center rounded-full bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 mb-0.5">
                      −{discountPct}%
                    </span>
                  </>
                )}
              </div>
            )}

            {features.length > 0 && (
              <ul className="flex flex-col gap-2 pt-1">
                {features.map((line, i) => (
                  <li key={i} className="flex gap-2.5 text-sm text-slate-600 leading-snug">
                    <Check className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" strokeWidth={2.5} />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            )}

            <div
              className="text-sm text-slate-600 leading-[1.75] border-t border-slate-100 pt-3 mt-1"
              dangerouslySetInnerHTML={{ __html: formatDescription(product.description ?? '') }}
            />

            {/* <div className="flex flex-wrap items-center gap-3 pt-4">
              <span className="text-sm font-semibold text-slate-700">Cantidad:</span>
              <div className="inline-flex items-center rounded-xl bg-slate-100/90 border border-slate-200/80 p-0.5">
                <button
                  type="button"
                  className="w-9 h-9 flex items-center justify-center rounded-lg border-none bg-transparent text-slate-700 hover:bg-white cursor-pointer disabled:opacity-40"
                  aria-label="Menos"
                  disabled={qty <= 1}
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-[2rem] text-center text-sm font-bold text-[#0a1f5c] tabular-nums">{qty}</span>
                <button
                  type="button"
                  className="w-9 h-9 flex items-center justify-center rounded-lg border-none bg-transparent text-slate-700 hover:bg-white cursor-pointer"
                  aria-label="Más"
                  onClick={() => setQty((q) => Math.min(99, q + 1))}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div> */}

            <div className="flex flex-col gap-2.5 pt-2">
              {/* <button
                type="button"
                disabled={!waCart}
                onClick={() => waCart && window.open(waCart, '_blank')}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0a1f5c] hover:bg-[#071647] disabled:opacity-45 disabled:cursor-not-allowed text-white font-bold text-sm py-3.5 border-none cursor-pointer transition-colors shadow-md"
              >
                <ShoppingCart className="h-4 w-4" />
                Agregar al carrito
              </button> */}
              <button
                type="button"
                disabled={!waQuote}
                onClick={() => waQuote && window.open(waQuote, '_blank')}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-white border-[1.5px] border-sky-200 text-[#0a1f5c] font-semibold text-sm py-3.5 hover:bg-sky-50/60 cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed transition-colors"
              >
                <FileText className="h-4 w-4 text-pink-500" />
                Solicitar producto / cotizar
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full text-center text-sm text-slate-500 hover:text-slate-800 py-1 border-none bg-transparent cursor-pointer underline-offset-2 hover:underline"
              >
                Seguir viendo productos
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
