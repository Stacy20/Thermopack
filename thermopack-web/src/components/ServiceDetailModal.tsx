import { useEffect } from 'react'
import { GalleryLightbox } from './GalleryLightbox'
import { formatColon, formatDescription } from '../utils/text'
import type { Services } from '../types/services'

type Props = {
  service: Services | null
  onClose: () => void
  whatsapp: string
}

export function ServiceDetailModal({ service, onClose, whatsapp }: Props) {
  useEffect(() => {
    if (!service) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [service, onClose])

  if (!service) return null

  const whatsappLink = whatsapp
    ? `https://wa.me/${whatsapp}?text=${encodeURIComponent('Estoy interesado en el siguiente servicio:\n\n' + service.name)}`
    : ''

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 border-none cursor-pointer text-gray-600 text-lg font-bold transition-colors"
          aria-label="Cerrar"
        >
          ✕
        </button>

        <div className="p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Gallery */}
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
            {service.images?.length > 0 ? (
              <GalleryLightbox images={service.images} />
            ) : (
              <div className="h-52 flex items-center justify-center text-6xl text-gray-300">🔧</div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-4">
            <span className="inline-block bg-brand-50 text-brand-600 text-[0.72rem] font-bold uppercase tracking-widest px-3 py-1 rounded-full w-fit">
              Servicio
            </span>

            <h2 className="font-display text-2xl lg:text-3xl font-extrabold text-gray-900 leading-tight">
              {service.name}
            </h2>

            {service.price != null && service.price > 0 && (
              <div className="font-display text-2xl font-extrabold text-brand-800">
                {formatColon(service.price)}
              </div>
            )}

            <div
              className="text-[0.92rem] text-gray-600 leading-[1.8]"
              dangerouslySetInnerHTML={{ __html: formatDescription(service.description ?? '') }}
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
                onClick={onClose}
                className="flex items-center justify-center gap-2 bg-transparent border-[1.5px] border-brand-100 text-brand-700 font-semibold text-[0.9rem] py-3.5 rounded-full cursor-pointer font-body hover:border-brand-400 hover:bg-brand-50 transition-all"
              >
                Ver más servicios
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
