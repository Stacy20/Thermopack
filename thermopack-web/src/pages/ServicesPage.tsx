import { useMemo, useState } from 'react'
import { useCatalogPageCopy } from '../hooks/useData'
import { useContactWhatsapp } from '../hooks/useContact'
import { useServicesPage } from '../hooks/useServices'
import { Pagination } from '../components/Pagination'
import { ServiceDetailModal } from '../components/ServiceDetailModal'
import { useCatalogStore } from '../stores/catalogStore'
import { LIMIT_SERVICE } from '../stores/limits'
import { formatDescription } from '../utils/text'
import { mergeServicesPageConfig } from '../lib/mergeServicesPage'
import type { Services } from '../types/services'

export function ServicesPage() {
  const [selectedService, setSelectedService] = useState<Services | null>(null)
  const offsetServices = useCatalogStore((s) => s.offsetServices)

  const { data, isLoading } = useServicesPage(LIMIT_SERVICE, offsetServices)
  const { data: catalogCopy } = useCatalogPageCopy()
  const { data: whatsappPayload } = useContactWhatsapp()

  const servicesVisual = useMemo(
    () => mergeServicesPageConfig(catalogCopy?.servicesPage),
    [catalogCopy?.servicesPage]
  )

  const services = data?.services ?? []
  const totalServices = data?.totalCount ?? 0
  const title = catalogCopy?.servicesTitle ?? 'Nuestros servicios'
  const description = catalogCopy?.servicesParagraph ?? ''
  const whatsapp = whatsappPayload?.whatsappLink ?? ''

  const { cardGradients, processSteps } = servicesVisual

  return (
    <div className="pt-[70px]">
      {/* Hero */}
      <div className="hero-gradient wave-bottom-gray relative py-20 text-center overflow-hidden">
        <h1 className="font-display text-4xl lg:text-5xl font-extrabold text-white mb-3">{title}</h1>
        {description && (
          <div
            className="text-white/72 text-base max-w-xl mx-auto leading-[1.8]"
            dangerouslySetInnerHTML={{ __html: formatDescription(description) }}
          />
        )}
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Services grid */}
        {isLoading && services.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-block w-10 h-10 border-4 border-brand-800 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-500">Cargando servicios...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {services.map((service, serviceIndex) => (
              <div
                key={service._id ?? service.id}
                className="rounded-3xl overflow-hidden border border-gray-200 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedService(service)}
              >
                <div
                  className="h-[180px] flex items-center justify-center text-5xl"
                  style={{
                    background: cardGradients[serviceIndex % cardGradients.length] ?? cardGradients[0],
                  }}
                >
                  {service.images?.[0] ? (
                    <img src={service.images[0]} alt={service.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>🔧</span>
                  )}
                </div>
                <div className="p-7 bg-white">
                  <h3 className="font-display font-bold text-gray-900 text-lg mb-2">{service.name}</h3>
                  <p
                    className="text-[0.88rem] text-gray-500 leading-[1.7] mb-4 overflow-hidden"
                    style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}
                  >
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalServices > LIMIT_SERVICE && (
          <div className="mb-16">
            <Pagination type="0" totalServices={totalServices} totalProducts={0} />
          </div>
        )}

        {/* Process steps */}
        <div className="bg-gray-50 rounded-4xl p-10">
          <h2 className="font-display text-2xl font-extrabold text-gray-900 mb-2 text-center">¿Cómo trabajamos?</h2>
          <p className="text-[0.9rem] text-gray-500 text-center mb-8">Un proceso simple y eficiente para brindarle el mejor servicio.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((processStep) => (
              <div key={processStep.step} className="step-item relative text-center">
                <div className="w-[52px] h-[52px] bg-brand-800 text-white rounded-full flex items-center justify-center font-display font-extrabold text-xl mx-auto mb-4">
                  {processStep.step}
                </div>
                <h4 className="font-display font-bold text-gray-900 text-[0.9rem] mb-2">{processStep.title}</h4>
                <p className="text-[0.78rem] text-gray-500 leading-relaxed">{processStep.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ServiceDetailModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
        whatsapp={whatsapp}
      />
    </div>
  )
}
