import { apiUrl } from '../config/apiBase'
import { getJson, postJson, putJson, deleteJson } from './client'
import type { Products } from '../types/products'

export function getAllProducts(): Promise<Products[]> {
  return getJson<Products[]>('products', [])
}

export async function getProductByName(name: string): Promise<Products> {
  try {
    const res = await fetch(apiUrl(`products/${encodeURIComponent(name)}`))
    if (!res.ok) return {} as Products
    return (await res.json()) as Products
  } catch {
    return {} as Products
  }
}

export function areProducts(): Promise<boolean> {
  return getJson<{ exists: boolean }>('products/check/not_empty', { exists: false }).then((r) => r.exists)
}

export async function fetchProductsPage(params: {
  limit: number
  offset: number
  brandId?: string
  categoryId?: string
  typeId?: string
  name?: string
}): Promise<{ products: Products[]; totalCount: number }> {
  let url = `products?limit=${params.limit}&offset=${params.offset}`
  if (params.brandId) url += `&brandId=${encodeURIComponent(params.brandId)}`
  if (params.categoryId) url += `&categoryId=${encodeURIComponent(params.categoryId)}`
  if (params.typeId) url += `&typeId=${encodeURIComponent(params.typeId)}`
  if (params.name) url += `&name=${encodeURIComponent(params.name)}`
  return getJson<{ products: Products[]; totalCount: number }>(url, {
    products: [],
    totalCount: 0,
  })
}

export function createProduct(
  name: string,
  description: string,
  brandId: string,
  typeId: string,
  price: number,
  categoryId: string,
  subcategoryId: string,
  images: string[]
): Promise<Products> {
  return postJson<Products>(
    'products',
    { name, description, brandId, typeId, price, categoryId, subcategoryId, images },
    {} as Products
  )
}

export function updateProductByName(
  name: string,
  newName: string,
  description: string,
  brandId: string,
  typeId: string,
  price: number,
  categoryId: string,
  subcategoryId: string,
  images: string[]
): Promise<Products> {
  return putJson<Products>(
    `products/${encodeURIComponent(name)}`,
    { name: newName, description, brandId, typeId, price, categoryId, subcategoryId, images },
    {} as Products
  )
}

export function deleteProductByName(name: string): Promise<Products> {
  return deleteJson<Products>(`products/${encodeURIComponent(name)}`, {} as Products)
}
