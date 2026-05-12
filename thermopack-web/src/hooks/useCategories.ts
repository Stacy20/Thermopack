import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '../api/client'
import { QUERY_KEYS } from '../api/queryKeys'
import type { Categories } from '../types/categories'

const ENDPOINT = 'categories'

function fetchAllCategories(): Promise<Categories[]> {
  return apiClient.get<Categories[]>(ENDPOINT).then((r) => r.data)
}

function fetchCategoryByName(name: string): Promise<Categories> {
  return apiClient.get<Categories>(`${ENDPOINT}/${encodeURIComponent(name)}`).then((r) => r.data)
}

function createCategory(name: string): Promise<Categories> {
  return apiClient.post<Categories>(ENDPOINT, { name }).then((r) => r.data)
}

function updateCategory(name: string, newName: string): Promise<Categories> {
  return apiClient.put<Categories>(`${ENDPOINT}/${encodeURIComponent(name)}`, { name: newName }).then((r) => r.data)
}

function deleteCategory(name: string): Promise<Categories> {
  return apiClient.delete<Categories>(`${ENDPOINT}/${encodeURIComponent(name)}`).then((r) => r.data)
}

export function useAllCategories() {
  return useQuery({
    queryKey: QUERY_KEYS.categories.all,
    queryFn: fetchAllCategories,
  })
}

export function useCategoryByName(name: string) {
  return useQuery({
    queryKey: QUERY_KEYS.categories.byName(name),
    queryFn: () => fetchCategoryByName(name),
    enabled: name.length > 0,
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (name: string) => createCategory(name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories.all }),
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ name, newName }: { name: string; newName: string }) => updateCategory(name, newName),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories.all }),
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (name: string) => deleteCategory(name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories.all }),
  })
}
