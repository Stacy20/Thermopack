import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '../api/client'
import { QUERY_KEYS } from '../api/queryKeys'
import type { Services } from '../types/services'

const ENDPOINT = 'services'

export type ServicesPageResult = {
  services: Services[]
  totalCount: number
}

export type CreateServiceParams = {
  name: string
  description: string
  price: number
  newImages: File[]
}

export type UpdateServiceParams = {
  originalName: string
  name: string
  description: string
  price: number
  newImages: File[]
  existingImages: string[]
}

function fetchServicesPage(limit: number, offset: number): Promise<ServicesPageResult> {
  return apiClient
    .get<ServicesPageResult>(`${ENDPOINT}?limit=${limit}&offset=${offset}`)
    .then((r) => r.data)
}

function fetchAllServices(): Promise<Services[]> {
  return apiClient.get<Services[]>(ENDPOINT).then((r) => r.data)
}

function fetchServiceByName(name: string): Promise<Services> {
  return apiClient.get<Services>(`${ENDPOINT}/${encodeURIComponent(name)}`).then((r) => r.data)
}

function fetchServicesHasAny(): Promise<boolean> {
  return apiClient
    .get<{ exists: boolean }>(`${ENDPOINT}/check/not_empty`)
    .then((r) => r.data.exists)
}

function createService(params: CreateServiceParams): Promise<Services> {
  const form = new FormData()
  form.append('name', params.name)
  form.append('description', params.description)
  form.append('price', String(params.price))
  params.newImages.forEach((file) => form.append('images', file))
  return apiClient.post<Services>(ENDPOINT, form).then((r) => r.data)
}

function updateService(params: UpdateServiceParams): Promise<Services> {
  const form = new FormData()
  form.append('name', params.name)
  form.append('description', params.description)
  form.append('price', String(params.price))
  form.append('existingImages', JSON.stringify(params.existingImages))
  params.newImages.forEach((file) => form.append('images', file))
  return apiClient
    .put<Services>(`${ENDPOINT}/${encodeURIComponent(params.originalName)}`, form)
    .then((r) => r.data)
}

function deleteService(name: string): Promise<Services> {
  return apiClient.delete<Services>(`${ENDPOINT}/${encodeURIComponent(name)}`).then((r) => r.data)
}

export function useServicesPage(limit: number, offset: number, enabled = true) {
  return useQuery({
    queryKey: QUERY_KEYS.services.page(offset),
    queryFn: () => fetchServicesPage(limit, offset),
    enabled,
  })
}

export function useAllServices() {
  return useQuery({
    queryKey: [...QUERY_KEYS.services.page(0), 'all'],
    queryFn: fetchAllServices,
  })
}

export function useServiceByName(name: string) {
  return useQuery({
    queryKey: QUERY_KEYS.services.byName(name),
    queryFn: () => fetchServiceByName(name),
    enabled: name.length > 0,
  })
}

export function useServicesHasAny() {
  return useQuery({
    queryKey: QUERY_KEYS.services.hasAny,
    queryFn: fetchServicesHasAny,
  })
}

export function useCreateService() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: CreateServiceParams) => createService(params),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['services'] }),
  })
}

export function useUpdateService() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: UpdateServiceParams) => updateService(params),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['services'] }),
  })
}

export function useDeleteService() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (name: string) => deleteService(name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['services'] }),
  })
}
