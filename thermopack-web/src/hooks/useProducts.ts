import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '../api/client'
import { QUERY_KEYS } from '../api/queryKeys'
import type { Products } from '../types/products'

const ENDPOINT = 'products'

export type ProductsPageParams = {
  limit: number
  offset: number
  brandId?: string
  categoryId?: string
  typeId?: string
  name?: string
}

export type ProductsPageResult = {
  products: Products[]
  totalCount: number
}

export type CreateProductParams = {
  name: string
  description: string
  brandId: string
  typeId: string
  price: number
  categoryId: string
  subcategoryId: string
  newImages: File[]
  rating?: number
  listPrice?: number
  features?: string[]
}

export type UpdateProductParams = {
  originalName: string
  name: string
  description: string
  brandId: string
  typeId: string
  price: number
  categoryId: string
  subcategoryId: string
  newImages: File[]
  existingImages: string[]
  rating?: number
  listPrice?: number
  features?: string[]
}

function fetchProductsPage(params: ProductsPageParams): Promise<ProductsPageResult> {
  let url = `${ENDPOINT}?limit=${params.limit}&offset=${params.offset}`
  if (params.brandId) url += `&brandId=${encodeURIComponent(params.brandId)}`
  if (params.categoryId) url += `&categoryId=${encodeURIComponent(params.categoryId)}`
  if (params.typeId) url += `&typeId=${encodeURIComponent(params.typeId)}`
  if (params.name) url += `&name=${encodeURIComponent(params.name)}`
  return apiClient.get<ProductsPageResult>(url).then((r) => r.data)
}

function fetchProductByName(name: string): Promise<Products> {
  return apiClient.get<Products>(`${ENDPOINT}/${encodeURIComponent(name)}`).then((r) => r.data)
}

function fetchProductsHasAny(): Promise<boolean> {
  return apiClient
    .get<{ exists: boolean }>(`${ENDPOINT}/check/not_empty`)
    .then((r) => r.data.exists)
}

function createProduct(params: CreateProductParams): Promise<Products> {
  const form = new FormData()
  form.append('name', params.name)
  form.append('description', params.description)
  form.append('brandId', params.brandId)
  form.append('typeId', params.typeId)
  form.append('price', String(params.price))
  form.append('categoryId', params.categoryId)
  form.append('subcategoryId', params.subcategoryId)
  if (params.rating != null && !Number.isNaN(params.rating)) form.append('rating', String(params.rating))
  form.append('listPrice', params.listPrice != null && !Number.isNaN(params.listPrice) ? String(params.listPrice) : '')
  form.append('features', JSON.stringify(params.features ?? []))
  params.newImages.forEach((file) => form.append('images', file))
  return apiClient.post<Products>(ENDPOINT, form).then((r) => r.data)
}

function updateProduct(params: UpdateProductParams): Promise<Products> {
  const form = new FormData()
  form.append('name', params.name)
  form.append('description', params.description)
  form.append('brandId', params.brandId)
  form.append('typeId', params.typeId)
  form.append('price', String(params.price))
  form.append('categoryId', params.categoryId)
  form.append('subcategoryId', params.subcategoryId)
  if (params.rating != null && !Number.isNaN(params.rating)) form.append('rating', String(params.rating))
  form.append('listPrice', params.listPrice != null && !Number.isNaN(params.listPrice) ? String(params.listPrice) : '')
  form.append('features', JSON.stringify(params.features ?? []))
  form.append('existingImages', JSON.stringify(params.existingImages))
  params.newImages.forEach((file) => form.append('images', file))
  return apiClient
    .put<Products>(`${ENDPOINT}/${encodeURIComponent(params.originalName)}`, form)
    .then((r) => r.data)
}

function deleteProduct(name: string): Promise<Products> {
  return apiClient.delete<Products>(`${ENDPOINT}/${encodeURIComponent(name)}`).then((r) => r.data)
}

export function useProductsPage(params: ProductsPageParams, enabled = true) {
  return useQuery({
    queryKey: QUERY_KEYS.products.page(params.offset, params.brandId, params.categoryId, params.typeId, params.name),
    queryFn: () => fetchProductsPage(params),
    enabled,
  })
}

export function useProductByName(name: string) {
  return useQuery({
    queryKey: QUERY_KEYS.products.byName(name),
    queryFn: () => fetchProductByName(name),
    enabled: name.length > 0,
  })
}

export function useProductsHasAny() {
  return useQuery({
    queryKey: QUERY_KEYS.products.hasAny,
    queryFn: fetchProductsHasAny,
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: CreateProductParams) => createProduct(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.home.public })
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: UpdateProductParams) => updateProduct(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.home.public })
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (name: string) => deleteProduct(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.home.public })
    },
  })
}
