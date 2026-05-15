import { useMemo } from 'react'
import { useNosotrosData } from '../hooks/useData'
import { formatDescription } from '../utils/text'
import {
  DEFAULT_HISTORIA_LIST,
  DEFAULT_NOSOTROS_DESC,
  DEFAULT_VALORES_LIST,
  mergeNosotrosPage,
} from '../constants/nosotrosPageDefaults'

export function NosotrosPage() {
  const { data: nosotrosData } = useNosotrosData()

  const page = useMemo(() => mergeNosotrosPage(nosotrosData?.nosotrosPage), [nosotrosData?.nosotrosPage])

  const mision = nosotrosData?.mision ?? ''
  const vision = nosotrosData?.vision ?? ''
  const visionImages: string[] = (nosotrosData?.visionImages as string[]) ?? []
  const presentationImages: string[] = (nosotrosData?.presentationImages as string[]) ?? []
  const nosotrosDescription = (nosotrosData?.nosotrosDescription ?? '').trim() || DEFAULT_NOSOTROS_DESC
  const valoresList =
    nosotrosData?.valoresList && nosotrosData.valoresList.length > 0 ? nosotrosData.valoresList : DEFAULT_VALORES_LIST
  const historiaList =
    nosotrosData?.historiaList && nosotrosData.historiaList.length > 0
      ? nosotrosData.historiaList
      : DEFAULT_HISTORIA_LIST

  const misionImg = presentationImages[1] || presentationImages[0] || ''
  const visionImg = visionImages[0] || presentationImages[0] || ''

  const shell = 'max-w-5xl mx-auto w-full min-w-0 px-5 sm:px-8'

  return (
    <div className="pt-[70px] w-full min-w-0 overflow-x-hidden">
      {/* ===== HERO ===== */}
      <div className="hero-gradient wave-bottom relative isolate overflow-hidden pb-28 pt-14 sm:pb-32 sm:pt-16 lg:pb-36">
        <div className={`${shell} text-center relative z-10`}>
          <span className="inline-block bg-white/15 text-blue-200 text-[0.7rem] sm:text-[0.72rem] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            {page.hero.badge}
          </span>
          <h1
            className="font-display text-3xl sm:text-4xl lg:text-[2.35rem] font-extrabold text-white mb-4 leading-tight [&_em]:not-italic [&_em]:text-blue-200"
            dangerouslySetInnerHTML={{ __html: formatDescription(page.hero.title) }}
          />
          <p className="relative z-10 mx-auto max-w-2xl min-w-0 wrap-break-word text-[0.95rem] leading-relaxed text-white/85 text-balance">
            {nosotrosDescription}
          </p>
        </div>
      </div>

      {/* ===== MISIÓN ===== */}
      <section className="py-12 sm:py-16">
        <div className={`${shell} grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center`}>
          <div className="relative rounded-3xl overflow-hidden min-w-0">
            <div
              className="w-full min-h-[280px] sm:min-h-[320px] lg:h-[380px] rounded-3xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #eff6ff, #dbeafe)' }}
            >
              {misionImg ? (
                <img src={misionImg} alt="Misión" className="w-full h-full min-h-[280px] sm:min-h-[320px] lg:min-h-0 object-cover rounded-3xl" />
              ) : (
                <span className="text-[5rem] sm:text-[7rem]" style={{ filter: 'drop-shadow(0 12px 24px rgba(0,0,0,.12))' }}>
                  🎯
                </span>
              )}
            </div>
            <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 bg-white/95 rounded-2xl p-3 sm:p-4 shadow-xl backdrop-blur-sm">
              <h4 className="font-display font-bold text-[0.9rem] sm:text-[0.95rem] text-gray-900 mb-1">{page.misionOverlay.title}</h4>
              <p className="text-[0.78rem] sm:text-[0.8rem] text-gray-500 leading-relaxed">{page.misionOverlay.body}</p>
            </div>
          </div>

          <div className="min-w-0">
            <span className="inline-block bg-brand-50 text-brand-600 text-[0.72rem] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
              {page.misionSection.badge}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-4">
              {page.misionSection.h2Before}
              <span className="text-brand-500">{page.misionSection.h2Highlight}</span>
              {page.misionSection.h2After}
            </h2>

            {mision.trim() ? (
              <div
                className="text-[0.92rem] sm:text-[0.95rem] text-gray-500 leading-[1.75] mb-6"
                dangerouslySetInnerHTML={{ __html: formatDescription(mision) }}
              />
            ) : (
              <p className="text-[0.92rem] sm:text-[0.95rem] text-gray-500 leading-[1.75] mb-6">
                Ofrecer servicios de maquila, asesoría, distribución e implementación de ofertas en el mercado de manera
                eficiente y confiable, garantizando la satisfacción total de nuestros clientes.
              </p>
            )}

            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              {page.misionPillars.map((p, idx) => (
                <div
                  key={`${p.title}-${idx}`}
                  className="bg-gray-50 rounded-2xl p-3 sm:p-4 border border-gray-200 hover:border-brand-300 transition-colors"
                >
                  <div className="text-xl sm:text-2xl mb-1">{p.icon}</div>
                  <h5 className="font-bold text-[0.78rem] sm:text-[0.82rem] text-gray-900 mb-1">{p.title}</h5>
                  <p className="text-[0.72rem] sm:text-[0.75rem] text-gray-500 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== VISIÓN ===== */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className={`${shell} grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center`}>
          <div className="lg:order-1 order-2 min-w-0">
            <span className="inline-block bg-brand-50 text-brand-600 text-[0.72rem] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
              {page.visionSection.badge}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-4">
              {page.visionSection.h2Before}
              <span className="text-brand-500">{page.visionSection.h2Highlight}</span>
              {page.visionSection.h2After}
            </h2>
            {vision.trim() ? (
              <div
                className="text-[0.92rem] sm:text-[0.95rem] text-gray-500 leading-[1.75] mb-6"
                dangerouslySetInnerHTML={{ __html: formatDescription(vision) }}
              />
            ) : (
              <p className="text-[0.92rem] sm:text-[0.95rem] text-gray-500 leading-[1.75] mb-6">{page.visionBodyFallback}</p>
            )}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              {page.visionPillars.map((p, idx) => (
                <div
                  key={`${p.title}-v-${idx}`}
                  className="bg-white rounded-2xl p-3 sm:p-4 border border-gray-200 hover:border-brand-300 transition-colors"
                >
                  <div className="text-xl sm:text-2xl mb-1">{p.icon}</div>
                  <h5 className="font-bold text-[0.78rem] sm:text-[0.82rem] text-gray-900 mb-1">{p.title}</h5>
                  <p className="text-[0.72rem] sm:text-[0.75rem] text-gray-500 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden lg:order-2 order-1 min-w-0">
            <div
              className="w-full min-h-[280px] sm:min-h-[320px] lg:h-[380px] rounded-3xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)' }}
            >
              {visionImg ? (
                <img src={visionImg} alt="Visión" className="w-full h-full min-h-[280px] sm:min-h-[320px] lg:min-h-0 object-cover rounded-3xl" />
              ) : (
                <span className="text-[5rem] sm:text-[7rem]" style={{ filter: 'drop-shadow(0 12px 24px rgba(0,0,0,.1))' }}>
                  🚀
                </span>
              )}
            </div>
            <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 bg-white/95 rounded-2xl p-3 sm:p-4 shadow-xl backdrop-blur-sm">
              <h4 className="font-display font-bold text-[0.9rem] sm:text-[0.95rem] text-gray-900 mb-1">{page.visionOverlay.title}</h4>
              <p className="text-[0.78rem] sm:text-[0.8rem] text-gray-500 leading-relaxed">{page.visionOverlay.body}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== VALORES ===== */}
      <section className="hero-gradient py-12 sm:py-16">
        <div className={shell}>
          <div className="text-center mb-8 sm:mb-10">
            <span className="inline-block bg-white/15 text-blue-200 text-[0.72rem] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
              {page.valoresHeading.badge}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">{page.valoresHeading.title}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {valoresList.map(({ icon, title, desc }, idx) => (
              <div
                key={`${title}-${idx}`}
                className="bg-white/10 border border-white/15 rounded-2xl sm:rounded-3xl px-5 py-7 sm:px-6 sm:py-8 text-center hover:bg-white/15 hover:-translate-y-0.5 transition-all duration-200"
              >
                <span className="text-3xl sm:text-4xl block mb-3 sm:mb-4">{icon}</span>
                <h3 className="font-display font-bold text-white text-[0.95rem] sm:text-base mb-2">{title}</h3>
                <p className="text-white/65 text-[0.78rem] sm:text-[0.82rem] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TIMELINE ===== */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className={shell}>
          <div className="text-center mb-8 sm:mb-10">
            <span className="inline-block bg-brand-50 text-brand-600 text-[0.72rem] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
              {page.historiaHeading.badge}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-gray-900">{page.historiaHeading.title}</h2>
          </div>

          <div className="max-w-3xl mx-auto relative timeline-line">
            {historiaList.map(({ year, title, desc }, i) => (
              <div key={`${year}-${i}`} className={`flex mb-10 sm:mb-12 relative ${i % 2 === 0 ? 'flex-row-reverse' : ''}`}>
                <div
                  className="absolute left-1/2 top-6 w-3.5 h-3.5 bg-brand-500 rounded-full border-[3px] border-white z-10"
                  style={{ transform: 'translateX(-50%)', boxShadow: '0 0 0 3px #dbeafe' }}
                />
                <div className={`w-[calc(50%-1.5rem)] ${i % 2 === 0 ? 'pr-8 sm:pr-10 text-right' : 'pl-8 sm:pl-10'}`}>
                  <div className="font-display text-[0.72rem] sm:text-[0.75rem] font-bold text-brand-500 uppercase tracking-wider mb-1">
                    {year}
                  </div>
                  <h4 className="font-display font-bold text-gray-900 mb-1 text-[0.95rem]">{title}</h4>
                  <p className="text-[0.78rem] sm:text-[0.82rem] text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {(visionImages.length > 1 || presentationImages.length > 1) && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-10">
              {[...presentationImages, ...visionImages].filter(Boolean).slice(1, 5).map((img, i) => (
                <div key={i} className="rounded-2xl overflow-hidden h-32 sm:h-40">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
