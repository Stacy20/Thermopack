import { apiUrl } from '../config/apiBase'
import { getJson, postJson, putJson, deleteJson } from './client'
import type { Services } from '../types/services'

export async function fetchServicesPage(
  limit: number,
  offset: number
): Promise<{ services: Services[]; totalCount: number }> {
  return getJson(`services?limit=${limit}&offset=${offset}`, { services: [], totalCount: 0 })
}

export function getAllServices(): Promise<Services[]> {
  return getJson<Services[]>('services', [])
}

export async function getServiceByName(name: string): Promise<Services> {
  try {
    const res = await fetch(apiUrl(`services/${encodeURIComponent(name)}`))
    if (!res.ok) return {} as Services
    return (await res.json()) as Services
  } catch {
    return {} as Services
  }
}

export function areServices(): Promise<boolean> {
  return getJson<{ exists: boolean }>('services/check/not_empty', { exists: false }).then((r) => r.exists)
}

export function createService(
  name: string,
  description: string,
  price: number,
  images: string[]
): Promise<Services> {
  return postJson<Services>('services', { name, description, price, images }, {} as Services)
}

export function updateServiceByName(
  name: string,
  newName: string,
  description: string,
  price: number,
  images: string[]
): Promise<Services> {
  return putJson<Services>(
    `services/${encodeURIComponent(name)}`,
    { name: newName, description, price, images },
    {} as Services
  )
}

export function deleteServiceByName(name: string): Promise<Services> {
  return deleteJson<Services>(`services/${encodeURIComponent(name)}`, {} as Services)
}
