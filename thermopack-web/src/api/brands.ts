import { getJson, postJson, putJson, deleteJson } from './client'
import type { Brands } from '../types/brands'

export function getAllBrands(): Promise<Brands[]> {
  return getJson<Brands[]>('brands', [])
}

export function getBrandByName(name: string): Promise<Brands> {
  return getJson<Brands>(`brands/${encodeURIComponent(name)}`, {} as Brands)
}

export function createBrand(name: string): Promise<Brands> {
  return postJson<Brands>('brands', { name }, {} as Brands)
}

export function updateBrandByName(name: string, newName: string): Promise<Brands> {
  return putJson<Brands>(`brands/${encodeURIComponent(name)}`, { name: newName }, {} as Brands)
}

export function deleteBrandByName(name: string): Promise<Brands> {
  return deleteJson<Brands>(`brands/${encodeURIComponent(name)}`, {} as Brands)
}
