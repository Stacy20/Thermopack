import type { HomeHeroConfig } from './home'

export interface HistoriaItem {
  year: string
  title: string
  desc: string
}

export interface ValorItem {
  icon: string
  title: string
  desc: string
}

export interface Data {
  id?: string
  _id?: string
  slogan: string
  description: string
  mision: string
  vision: string
  logo: string
  visionImages: string[]
  presentationImages: string[]
  productsTitle: string
  productsParagraph: string
  servicesTitle: string
  servicesParagraph: string
  nosotrosDescription?: string
  historiaList?: HistoriaItem[]
  valoresList?: ValorItem[]
  homeHero?: HomeHeroConfig | Record<string, unknown>
  nosotrosPage?: Record<string, unknown>
}
