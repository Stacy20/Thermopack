import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '../api/client'
import { QUERY_KEYS } from '../api/queryKeys'
import type { Brands } from '../types/brands'

const ENDPOINT = 'brands'

function fetchAllBrands(): Promise<Brands[]> {
  return apiClient.get<Brands[]>(ENDPOINT).then((r) => r.data)
}

function fetchBrandByName(name: string): Promise<Brands> {
  return apiClient.get<Brands>(`${ENDPOINT}/${encodeURIComponent(name)}`).then((r) => r.data)
}

function createBrand(name: string): Promise<Brands> {
  return apiClient.post<Brands>(ENDPOINT, { name }).then((r) => r.data)
}

function updateBrand(name: string, newName: string): Promise<Brands> {
  return apiClient.put<Brands>(`${ENDPOINT}/${encodeURIComponent(name)}`, { name: newName }).then((r) => r.data)
}

function deleteBrand(name: string): Promise<Brands> {
  return apiClient.delete<Brands>(`${ENDPOINT}/${encodeURIComponent(name)}`).then((r) => r.data)
}

export function useAllBrands() {
  return useQuery({
    queryKey: QUERY_KEYS.brands.all,
    queryFn: fetchAllBrands,
  })
}

export function useBrandByName(name: string) {
  return useQuery({
    queryKey: QUERY_KEYS.brands.byName(name),
    queryFn: () => fetchBrandByName(name),
    enabled: name.length > 0,
  })
}

export function useCreateBrand() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (name: string) => createBrand(name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.brands.all }),
  })
}

export function useUpdateBrand() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ name, newName }: { name: string; newName: string }) => updateBrand(name, newName),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.brands.all }),
  })
}

export function useDeleteBrand() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (name: string) => deleteBrand(name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.brands.all }),
  })
}
