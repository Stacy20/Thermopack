import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '../api/client'
import { QUERY_KEYS } from '../api/queryKeys'
import type { Data } from '../types/data'

const ENDPOINT = 'data'

export type UpdateMainPageParams = {
  slogan: string
  description: string
  mision: string
  vision: string
  logo?: File
  removeLogo?: boolean
}

export type UpdateImagesParams = {
  newImages: File[]
  existingImages: string[]
}

export type UpdateProductsServicesParams = {
  productsTitle: string
  productsParagraph: string
  servicesTitle: string
  servicesParagraph: string
}

function fetchData(): Promise<Data> {
  return apiClient.get<Data>(ENDPOINT).then((r) => r.data[0])
}

function fetchTextData(): Promise<Record<string, string>> {
  return apiClient.get<Record<string, string>>(`${ENDPOINT}/text`).then((r) => r.data)
}

function fetchLogo(): Promise<{ logo: string | null }> {
  return apiClient.get<{ logo: string | null }>(`${ENDPOINT}/logo`).then((r) => r.data)
}

function fetchVisionImages(): Promise<{ visionImages: string[] }> {
  return apiClient.get<{ visionImages: string[] }>(`${ENDPOINT}/visionImages`).then((r) => r.data)
}

function fetchPresentationImages(): Promise<{ presentationImages: string[] }> {
  return apiClient
    .get<{ presentationImages: string[] }>(`${ENDPOINT}/presentationImages`)
    .then((r) => r.data)
}

function updateMainPage(params: UpdateMainPageParams): Promise<Data> {
  const form = new FormData()
  form.append('slogan', params.slogan)
  form.append('description', params.description)
  form.append('mision', params.mision)
  form.append('vision', params.vision)
  if (params.removeLogo) {
    form.append('removeLogo', 'true')
  } else if (params.logo) {
    form.append('logo', params.logo)
  }
  return apiClient.put<Data>(`${ENDPOINT}/main-page`, form).then((r) => r.data)
}

function updateVisionImages(params: UpdateImagesParams): Promise<Data> {
  const form = new FormData()
  form.append('existingImages', JSON.stringify(params.existingImages))
  params.newImages.forEach((file) => form.append('images', file))
  return apiClient.put<Data>(`${ENDPOINT}/vision-images`, form).then((r) => r.data)
}

function updatePresentationImages(params: UpdateImagesParams): Promise<Data> {
  const form = new FormData()
  form.append('existingImages', JSON.stringify(params.existingImages))
  params.newImages.forEach((file) => form.append('images', file))
  return apiClient.put<Data>(`${ENDPOINT}/presentation-images`, form).then((r) => r.data)
}

function updateProductsServices(params: UpdateProductsServicesParams): Promise<Data> {
  return apiClient.put<Data>(`${ENDPOINT}/products-services`, params).then((r) => r.data)
}

export function useData() {
  return useQuery({
    queryKey: QUERY_KEYS.data.full,
    queryFn: fetchData,
  })
}

export function useTextData() {
  return useQuery({
    queryKey: QUERY_KEYS.data.text,
    queryFn: fetchTextData,
  })
}

export function useLogo() {
  return useQuery({
    queryKey: QUERY_KEYS.data.logo,
    queryFn: fetchLogo,
  })
}

export function useVisionImages() {
  return useQuery({
    queryKey: QUERY_KEYS.data.visionImages,
    queryFn: fetchVisionImages,
  })
}

export function usePresentationImages() {
  return useQuery({
    queryKey: QUERY_KEYS.data.presentationImages,
    queryFn: fetchPresentationImages,
  })
}

export function useUpdateMainPage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: UpdateMainPageParams) => updateMainPage(params),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.data.full }),
  })
}

export function useUpdateVisionImages() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: UpdateImagesParams) => updateVisionImages(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.data.full })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.data.visionImages })
    },
  })
}

export function useUpdatePresentationImages() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: UpdateImagesParams) => updatePresentationImages(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.data.full })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.data.presentationImages })
    },
  })
}

export function useUpdateProductsServices() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: UpdateProductsServicesParams) => updateProductsServices(params),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.data.full }),
  })
}
