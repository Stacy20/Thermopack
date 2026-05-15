/** Tarjetas 2x2 (misión / visión) */
export type NosotrosPillar = { icon: string; title: string; desc: string }

/** Texto editable de la página Nosotros (además de misión/visión largas en Config Inicio) */
export type NosotrosPageConfig = {
  hero: { badge: string; title: string }
  misionOverlay: { title: string; body: string }
  misionSection: { badge: string; h2Before: string; h2Highlight: string; h2After: string }
  misionPillars: NosotrosPillar[]
  visionSection: { badge: string; h2Before: string; h2Highlight: string; h2After: string }
  visionPillars: NosotrosPillar[]
  /** Si la visión larga está vacía en Config Inicio, se muestra este texto */
  visionBodyFallback: string
  visionOverlay: { title: string; body: string }
  valoresHeading: { badge: string; title: string }
  historiaHeading: { badge: string; title: string }
}
