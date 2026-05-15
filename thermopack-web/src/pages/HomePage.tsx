import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useHomePublic } from '../hooks/useHomePublic'
import { ProductDetailModal } from '../components/ProductDetailModal'
import { formatDescription } from '../utils/text'
import { DEFAULT_SLOGAN, mergeHomeHero } from '../constants/homeDefaults'
import type { Products } from '../types/products'
import { ListCard } from '@/components/ListCard'

export function HomePage() {
  const [selectedProduct, setSelectedProduct] = useState<Products | null>(null)
  const navigate = useNavigate()
  const { data, isLoading, isError } = useHomePublic()

  const hero = useMemo(() => mergeHomeHero(data?.homeHero ?? null), [data?.homeHero])
  const slogan = data?.slogan?.trim() ? data.slogan : DEFAULT_SLOGAN
  const description = data?.description ?? ''
  const srcLogo = data?.logo ?? ''
  const products = data?.featuredProducts ?? []
  const whatsapp = data?.whatsappLink ?? ''

  const defaultSub =
    'Somos una empresa dedicada a la maquila, asesoría e implementación de ofertas para consumo masivo.'
  const heroLeadHtml = description
    ? formatDescription(description)
    : defaultSub.replace(/\n/g, '<br>')

  const shell = 'max-w-5xl mx-auto w-full min-w-0 px-5 sm:px-8'

  if (isError) {
    return (
      <div className="pt-[70px] px-6 py-20 text-center text-red-600">
        No se pudo cargar el inicio. Intenta de nuevo más tarde.
      </div>
    )
  }

  return (
    <div className="pt-[70px] w-full min-w-0 overflow-x-hidden">
      {/* ===== HERO ===== */}
      <section className="hero-gradient relative w-full min-w-0 flex justify-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
          <div className="absolute top-[10%] right-[5%] size-[min(350px,55vw)] rounded-full border border-white/8" />
          <div className="absolute top-[18%] right-[10%] size-[min(200px,40vw)] rounded-full border border-white/10" />
        </div>
        <div
          className={`${shell} py-12 sm:py-14 lg:py-16 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 lg:items-start items-center text-center lg:text-left relative z-10`}
        >
          <div className="min-w-0 max-w-xl mx-auto lg:max-w-none lg:mx-0">
            <div className="flex justify-center lg:justify-start mb-4 sm:mb-5">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3.5 py-1.5 text-[0.7rem] sm:text-[0.75rem] font-semibold text-white/90 tracking-wide">
                <span className="w-2 h-2 bg-brand-green rounded-full badge-pulse shrink-0" />
                {hero.badge}
              </div>
            </div>

            <h1 className="font-display text-3xl leading-tight sm:text-4xl lg:text-[2.35rem] font-extrabold text-white mb-3 sm:mb-4">
              {slogan}
            </h1>

            <div
              className="text-white/80 text-[0.9rem] sm:text-[0.95rem] leading-relaxed mb-6 sm:mb-7 mx-auto lg:mx-0 max-w-md lg:max-w-104"
              dangerouslySetInnerHTML={{ __html: heroLeadHtml }}
            />

            <div className="flex gap-2.5 sm:gap-3 flex-wrap justify-center lg:justify-start">
              <button
                type="button"
                onClick={() => navigate('/productos')}
                className="inline-flex items-center justify-center min-h-[44px] sm:min-h-[46px] bg-brand-green text-white font-bold text-[0.875rem] sm:text-[0.9rem] px-6 sm:px-7 py-2.5 rounded-full border-none cursor-pointer font-body transition-all hover:-translate-y-0.5"
                style={{ boxShadow: '0 4px 24px rgba(34,197,94,.4)' }}
              >
                Ver productos →
              </button>
              <button
                type="button"
                onClick={() => navigate('/contactenos')}
                className="inline-flex items-center justify-center min-h-[44px] sm:min-h-[46px] bg-brand-800/90 text-white border border-white/25 font-semibold text-[0.875rem] sm:text-[0.9rem] px-6 sm:px-7 py-2.5 rounded-full cursor-pointer font-body hover:bg-brand-800 transition-colors"
              >
                Contáctenos
              </button>
            </div>
          </div>

          <div className="hidden lg:flex flex-col gap-3 min-w-0 w-full max-w-md lg:max-w-none justify-self-end">
            <div className="bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur-md">
              {srcLogo ? (
                <img src={srcLogo} alt="ThermoPack" className="w-16 h-16 rounded-full object-cover mb-4" />
              ) : (
                <div className="text-4xl mb-4">🏆</div>
              )}
              <h3 className="font-display font-bold text-white text-base mb-2">{hero.spotlight.title}</h3>
              <p className="text-white/70 text-[0.82rem] leading-relaxed">{hero.spotlight.body}</p>
              <div className="flex gap-5 mt-4 justify-between sm:justify-start sm:gap-6">
                {hero.spotlight.stats.map((s, idx) => (
                  <div key={idx}>
                    <div className="font-display text-[1.8rem] font-extrabold text-white leading-none">{s.value}</div>
                    <div className="text-[0.7rem] text-white/55 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {hero.tiles.map((t) => (
                <div key={t.title} className="bg-white/10 border border-white/15 rounded-xl p-4">
                  <div className="text-xl mb-1.5">{t.icon}</div>
                  <h4 className="text-white font-bold text-[0.8rem] mb-1">{t.title}</h4>
                  <p className="text-white/60 text-[0.72rem]">{t.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <div className="bg-white border-b border-gray-200 py-6 sm:py-7">
        <div className={`${shell} grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5`}>
          {hero.statsBar.map(({ value, label }, idx) => (
            <div key={idx} className="text-center py-2 sm:py-3">
              <div className="font-display text-[1.75rem] sm:text-[2rem] font-extrabold text-brand-800 leading-none">{value}</div>
              <div className="text-[0.78rem] sm:text-[0.8rem] text-gray-400 mt-1.5 leading-snug px-1">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className=" flex justify-center bg-gray-50 ">
        <div className={shell}>
          <div className="flex justify-between items-end mb-8 sm:mb-9 flex-wrap gap-4">
            <div>
              <span className="inline-block bg-brand-50 text-brand-600 text-[0.72rem] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                Productos destacados
              </span>
              <h2 className="font-display text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight">
                Lo más <span className="text-brand-500">popular</span>
              </h2>
              <p className="text-[0.9rem] text-gray-500 max-w-md mt-2 leading-7">
                Distribución de los mejores productos con marcas líderes del mercado.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/productos')}
              className="inline-flex items-center justify-center min-h-[44px] bg-brand-800 text-white px-6 py-2.5 rounded-full font-semibold text-[0.85rem] border-none cursor-pointer hover:bg-brand-500 transition-colors font-body"
            >
              Ver todo el catálogo
            </button>
          </div>

          {isLoading ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-4">⏳</div>
              <p>Cargando productos...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-4">📦</div>
              <p>No hay productos para mostrar.</p>
            </div>
          ) : (
            <div className="row justify-content-center">
              <ListCard
                type={1}
                products={products}
                services={[]}
                permissions={0}
                isLoading={isLoading}
                onViewDetail={(p) => setSelectedProduct(p)}
              />
            </div>
          )}
        </div>
      </section>

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        whatsapp={whatsapp}
      />
    </div>
  )
}
