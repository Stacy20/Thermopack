export type HomeStatPair = { value: string; label: string }

export type HomeHeroConfig = {
  badge: string
  spotlight: {
    title: string
    body: string
    stats: HomeStatPair[]
  }
  tiles: { icon: string; title: string; body: string }[]
  statsBar: HomeStatPair[]
}

import type { Products } from './products'

/** Respuesta de GET /home/public */
export type HomePublicPayload = {
  slogan: string
  description: string
  logo: string | null
  homeHero: Partial<HomeHeroConfig> | null
  whatsappLink: string
  featuredProducts: Products[]
}
