import type { NosotrosPageConfig, NosotrosPillar } from '../types/nosotrosPage'
import type { HistoriaItem, ValorItem } from '../types/data'

const padPillars = (arr: NosotrosPillar[] | undefined, defaults: NosotrosPillar[], n: number): NosotrosPillar[] => {
  const src = Array.isArray(arr) && arr.length ? arr : defaults
  return Array.from({ length: n }, (_, i) => ({
    icon: (src[i]?.icon ?? defaults[i]?.icon ?? '').trim(),
    title: (src[i]?.title ?? defaults[i]?.title ?? '').trim(),
    desc: (src[i]?.desc ?? defaults[i]?.desc ?? '').trim(),
  }))
}

export const DEFAULT_VALORES_LIST: ValorItem[] = [
  { icon: '⚡', title: 'Eficiencia', desc: 'Procesos optimizados para resultados rápidos y confiables.' },
  { icon: '🤝', title: 'Confianza', desc: 'Relaciones sólidas y transparentes con cada cliente.' },
  { icon: '💡', title: 'Innovación', desc: 'Tecnología al servicio de la distribución y el comercio.' },
  { icon: '🌱', title: 'Sostenibilidad', desc: 'Compromiso con el desarrollo de nuestra comunidad.' },
]

export const DEFAULT_HISTORIA_LIST: HistoriaItem[] = [
  { year: '2010', title: 'Fundación', desc: 'Inicio de operaciones como importadora de marcas europeas.' },
  { year: '2014', title: 'Expansión', desc: 'Ampliamos nuestro portafolio a más de 100 productos.' },
  { year: '2018', title: 'Certificaciones', desc: 'Obtención de certificaciones internacionales de calidad.' },
  { year: '2023', title: 'Hoy', desc: 'Líderes en distribución masiva con presencia nacional.' },
]

export const DEFAULT_NOSOTROS_PAGE: NosotrosPageConfig = {
  hero: {
    badge: 'Quiénes somos',
    title: 'Más que distribución,\nun socio estratégico',
  },
  misionOverlay: {
    title: 'Eficiencia operativa garantizada',
    body: 'Procesos optimizados para la distribución eficaz y confiable en todo el país',
  },
  misionSection: {
    badge: 'Nuestra Misión',
    h2Before: 'Ser su mejor ',
    h2Highlight: 'aliado comercial',
    h2After: '',
  },
  misionPillars: [
    { icon: '⚡', title: 'Eficiencia', desc: 'Procesos optimizados para resultados rápidos' },
    { icon: '🤝', title: 'Confianza', desc: 'Relaciones sólidas y transparentes' },
    { icon: '🔧', title: 'Soluciones', desc: 'Respuestas personalizadas a cada cliente' },
    { icon: '📈', title: 'Crecimiento', desc: 'Impulsamos el éxito de su negocio' },
  ],
  visionSection: {
    badge: 'Nuestra Visión',
    h2Before: 'Ser ',
    h2Highlight: 'referentes',
    h2After: ' del sector',
  },
  visionPillars: [
    { icon: '🏆', title: 'Liderazgo', desc: 'Posición de referencia en el mercado' },
    { icon: '💡', title: 'Innovación', desc: 'Tecnología al servicio de la distribución' },
    { icon: '🌱', title: 'Sostenibilidad', desc: 'Compromiso con la comunidad' },
    { icon: '🤝', title: 'Partnerships', desc: 'Alianzas estratégicas internacionales' },
  ],
  visionBodyFallback:
    'Proyectarnos como empresa líder en el sector de la maquila y distribución, reconocida por nuestra excelencia en el servicio, innovación en nuestros procesos y compromiso con la calidad.',
  visionOverlay: {
    title: 'Líderes reconocidos del sector',
    body: 'Proyectados como referente de excelencia en maquila y distribución a nivel regional',
  },
  valoresHeading: {
    badge: 'Valores',
    title: 'Nuestros valores corporativos',
  },
  historiaHeading: {
    badge: 'Historia',
    title: 'Nuestra trayectoria',
  },
}

export function mergeNosotrosPage(raw: unknown): NosotrosPageConfig {
  const d = raw && typeof raw === 'object' ? (raw as Partial<NosotrosPageConfig>) : {}
  const def = DEFAULT_NOSOTROS_PAGE

  const hero = d.hero ?? {}
  const mo = d.misionOverlay ?? {}
  const ms = d.misionSection ?? {}
  const vs = d.visionSection ?? {}
  const vo = d.visionOverlay ?? {}
  const vh = d.valoresHeading ?? {}
  const hh = d.historiaHeading ?? {}

  return {
    hero: {
      badge: hero.badge?.trim() || def.hero.badge,
      title: hero.title?.trim() || def.hero.title,
    },
    misionOverlay: {
      title: mo.title?.trim() || def.misionOverlay.title,
      body: mo.body?.trim() || def.misionOverlay.body,
    },
    misionSection: {
      badge: ms.badge?.trim() || def.misionSection.badge,
      h2Before: ms.h2Before?.trim() ?? def.misionSection.h2Before,
      h2Highlight: ms.h2Highlight?.trim() || def.misionSection.h2Highlight,
      h2After: ms.h2After?.trim() ?? def.misionSection.h2After,
    },
    misionPillars: padPillars(d.misionPillars, def.misionPillars, 4),
    visionSection: {
      badge: vs.badge?.trim() || def.visionSection.badge,
      h2Before: vs.h2Before?.trim() ?? def.visionSection.h2Before,
      h2Highlight: vs.h2Highlight?.trim() || def.visionSection.h2Highlight,
      h2After: vs.h2After?.trim() ?? def.visionSection.h2After,
    },
    visionPillars: padPillars(d.visionPillars, def.visionPillars, 4),
    visionBodyFallback: (d.visionBodyFallback ?? '').trim() || def.visionBodyFallback,
    visionOverlay: {
      title: vo.title?.trim() || def.visionOverlay.title,
      body: vo.body?.trim() || def.visionOverlay.body,
    },
    valoresHeading: {
      badge: vh.badge?.trim() || def.valoresHeading.badge,
      title: vh.title?.trim() || def.valoresHeading.title,
    },
    historiaHeading: {
      badge: hh.badge?.trim() || def.historiaHeading.badge,
      title: hh.title?.trim() || def.historiaHeading.title,
    },
  }
}

export const DEFAULT_NOSOTROS_DESC =
  'Nos especializamos en brindar soluciones integrales para el mercado de consumo masivo, con enfoque en innovación, calidad y excelencia operativa.'
