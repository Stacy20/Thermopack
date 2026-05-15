import { useParams, useNavigate } from 'react-router-dom'
import { Star, Check } from 'lucide-react'
import { useContact } from '../hooks/useContact'
import { useProductByName } from '../hooks/useProducts'
import { useServiceByName } from '../hooks/useServices'
import { useAllBrands } from '../hooks/useBrands'
import { useAllCategories } from '../hooks/useCategories'
import { GalleryLightbox } from '../components/GalleryLightbox'
import { formatColon, formatDescription } from '../utils/text'
import type { Products } from '../types/products'
import type { Services } from '../types/services'

export function DetailPage() {
  const { type, id } = useParams<{ type: string; id: string }>()
  const navigate = useNavigate()
  const typeNum = parseInt(type ?? '1', 10)
  const name = id ? decodeURIComponent(id) : ''

  const { data: contactList } = useContact()
  const { data: product } = useProductByName(typeNum === 1 ? name : '')
  const { data: service } = useServiceByName(typeNum !== 1 ? name : '')
  const { data: brands = [] } = useAllBrands()
  const { data: categories = [] } = useAllCategories()

  const item = typeNum === 1 ? product : service
  const title = item?.name ?? ''
  const description = item?.description ?? ''
  const price = item?.price ?? 0
  const images = item?.images ?? []

  const contact = contactList
  const currentPageUrl = typeof window !== 'undefined' ? window.location.href : ''
  const waDigits = contact?.whatsappLink?.replace(/\D/g, '') ?? ''
  const whatsappLink = waDigits
    ? `https://wa.me/${waDigits}?text=${encodeURIComponent('Estoy interesado en lo siguiente:\n\n' + currentPageUrl)}`
    : ''

  const prod = typeNum === 1 ? (product as Products | undefined) : undefined
  const brandName =
    prod?.brand?.trim() ||
    brands.find((b) => (b._id ?? '') === prod?.brandId)?.name ||
    ''
  const categoryName =
    prod?.category?.trim() ||
    categories.find((c) => (c._id ?? '') === prod?.categoryId)?.name ||
    ''

  const listPrice = prod?.listPrice
  const hasDiscount =
    prod != null &&
    listPrice != null &&
    listPrice > 0 &&
    prod.price > 0 &&
    listPrice > prod.price
  const discountPct = hasDiscount ? Math.round((1 - prod.price / listPrice!) * 100) : 0
  const starsFilled =
    prod?.rating != null ? Math.min(5, Math.max(0, Math.round(Number(prod.rating)))) : 5
  const features = (prod?.features ?? []).filter((f) => f.trim().length > 0)

  return (
    <div className="pt-[70px] min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[0.85rem] text-gray-500 hover:text-brand-600 border-none bg-transparent cursor-pointer mb-8 font-body transition-colors"
        >
          ← Volver
        </button>

        {!title && (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">🔍</div>
            <p>Cargando...</p>
          </div>
        )}

        {title && typeNum === 1 && prod && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
              {images.length > 0 ? (
                <GalleryLightbox images={images} />
              ) : (
                <div className="h-64 flex items-center justify-center text-6xl text-gray-300">📦</div>
              )}
            </div>

            <div className="flex flex-col gap-4">
              {categoryName && (
                <span className="inline-block w-fit rounded-full bg-sky-50 text-sky-700 text-[0.65rem] font-bold uppercase tracking-[0.14em] px-3 py-1.5 border border-sky-100">
                  {categoryName.toUpperCase()}
                </span>
              )}

              <div className="flex gap-0.5" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 sm:h-5 sm:w-5 ${
                      i < starsFilled ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-100'
                    }`}
                  />
                ))}
              </div>

              <h1 className="font-display text-3xl lg:text-4xl font-extrabold text-brand-900 leading-tight">
                {title}
              </h1>

              {brandName && <p className="text-sm text-slate-500">por {brandName}</p>}

              {price > 0 && (
                <div className="flex flex-wrap items-end gap-2 sm:gap-3">
                  <span className="font-display text-3xl font-extrabold text-brand-900">{formatColon(price)}</span>
                  {hasDiscount && (
                    <>
                      <span className="text-lg text-slate-400 line-through pb-0.5">{formatColon(listPrice!)}</span>
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
                className="text-[0.92rem] text-gray-600 leading-[1.8] border-t border-slate-100 pt-4"
                dangerouslySetInnerHTML={{ __html: formatDescription(description) }}
              />

              <div className="flex flex-col gap-3 mt-2">
                {whatsappLink && (
                  <button
                    type="button"
                    onClick={() => window.open(whatsappLink, '_blank')}
                    className="flex items-center justify-center gap-3 bg-brand-green text-white font-bold text-[0.95rem] py-4 rounded-full border-none cursor-pointer font-body transition-all hover:bg-brand-green-dark hover:-translate-y-0.5"
                    style={{ boxShadow: '0 4px 20px rgba(34,197,94,.35)' }}
                  >
                    💬 Consultar por WhatsApp
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => navigate('/productos')}
                  className="flex items-center justify-center gap-2 bg-transparent border-[1.5px] border-sky-200 text-brand-900 font-semibold text-[0.9rem] py-3.5 rounded-full cursor-pointer font-body hover:border-brand-400 hover:bg-brand-50 transition-all"
                >
                  Ver más productos
                </button>
              </div>
            </div>
          </div>
        )}

        {title && typeNum !== 1 && (service as Services | undefined) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
              {images.length > 0 ? (
                <GalleryLightbox images={images} />
              ) : (
                <div className="h-64 flex items-center justify-center text-6xl text-gray-300">📦</div>
              )}
            </div>

            <div className="flex flex-col gap-5">
              <span className="inline-block bg-brand-50 text-brand-600 text-[0.72rem] font-bold uppercase tracking-widest px-3 py-1 rounded-full w-fit">
                Servicio
              </span>

              <h1 className="font-display text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight">{title}</h1>

              {price > 0 && (
                <div className="font-display text-3xl font-extrabold text-brand-800">{formatColon(price)}</div>
              )}

              <div
                className="text-[0.92rem] text-gray-600 leading-[1.8]"
                dangerouslySetInnerHTML={{ __html: formatDescription(description) }}
              />

              <div className="flex flex-col gap-3 mt-2">
                {whatsappLink && (
                  <button
                    type="button"
                    onClick={() => window.open(whatsappLink, '_blank')}
                    className="flex items-center justify-center gap-3 bg-brand-green text-white font-bold text-[0.95rem] py-4 rounded-full border-none cursor-pointer font-body transition-all hover:bg-brand-green-dark hover:-translate-y-0.5"
                    style={{ boxShadow: '0 4px 20px rgba(34,197,94,.35)' }}
                  >
                    💬 Consultar por WhatsApp
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => navigate('/servicios')}
                  className="flex items-center justify-center gap-2 bg-transparent border-[1.5px] border-brand-100 text-brand-700 font-semibold text-[0.9rem] py-3.5 rounded-full cursor-pointer font-body hover:border-brand-400 hover:bg-brand-50 transition-all"
                >
                  Ver más servicios
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
