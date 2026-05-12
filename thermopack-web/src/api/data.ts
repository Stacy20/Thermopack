import { getJson, getJsonOrNull, putJson } from './client'
import type { Data } from '../types/data'

export function getData(): Promise<Data[]> {
  return getJson<Data[]>('data', [])
}

export function getTextData(): Promise<Record<string, string> | null> {
  return getJsonOrNull<Record<string, string>>('data/text')
}

export function getLogo(): Promise<{ logo: string } | null> {
  return getJsonOrNull<{ logo: string }>('data/logo')
}

export function getVisionImages(): Promise<{ visionImages: string[] } | null> {
  return getJsonOrNull<{ visionImages: string[] }>('data/visionImages')
}

export function getPresentationImages(): Promise<{ presentationImages: string[] } | null> {
  return getJsonOrNull<{ presentationImages: string[] }>('data/presentationImages')
}

export function updateData(
  slogan: string,
  description: string,
  mision: string,
  vision: string,
  logo: string,
  visionImages: string[],
  presentationImages: string[],
  productsTitle: string,
  productsParagraph: string,
  servicesTitle: string,
  servicesParagraph: string
): Promise<Data> {
  return putJson<Data>(
    'data',
    {
      slogan,
      description,
      mision,
      vision,
      logo,
      visionImages,
      presentationImages,
      productsTitle,
      productsParagraph,
      servicesTitle,
      servicesParagraph,
    },
    {} as Data
  )
}

export function updateMainPage(
  slogan: string,
  description: string,
  mision: string,
  vision: string,
  logo: string
): Promise<Data> {
  return putJson<Data>('data/main-page', { slogan, description, mision, vision, logo }, {} as Data)
}

export function updateMisionImages(visionImages: string[]): Promise<Data> {
  return putJson<Data>('data/vision-images', { visionImages }, {} as Data)
}

export function updatePresentationImages(presentationImages: string[]): Promise<Data> {
  return putJson<Data>('data/presentation-images', { presentationImages }, {} as Data)
}

export function updateProductsServices(
  productsTitle: string,
  productsParagraph: string,
  servicesTitle: string,
  servicesParagraph: string
): Promise<Data> {
  return putJson<Data>(
    'data/products-services',
    { productsTitle, productsParagraph, servicesTitle, servicesParagraph },
    {} as Data
  )
}
