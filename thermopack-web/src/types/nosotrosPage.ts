
export type NosotrosPillar = { icon: string; title: string; desc: string }


export type NosotrosPageConfig = {
  hero: { badge: string; title: string }
  misionOverlay: { title: string; body: string }
  misionSection: { badge: string; h2Before: string; h2Highlight: string; h2After: string }
  misionPillars: NosotrosPillar[]
  visionSection: { badge: string; h2Before: string; h2Highlight: string; h2After: string }
  visionPillars: NosotrosPillar[]
  visionBodyFallback: string
  visionOverlay: { title: string; body: string }
  valoresHeading: { badge: string; title: string }
  historiaHeading: { badge: string; title: string }
}
