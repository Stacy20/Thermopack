import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '../api/client'
import { QUERY_KEYS } from '../api/queryKeys'
import type { Types } from '../types/types'

const ENDPOINT = 'types'

function fetchAllTypes(): Promise<Types[]> {
  return apiClient.get<Types[]>(ENDPOINT).then((r) => r.data)
}

function fetchTypeByName(name: string): Promise<Types> {
  return apiClient.get<Types>(`${ENDPOINT}/${encodeURIComponent(name)}`).then((r) => r.data)
}

function createType(name: string): Promise<Types> {
  return apiClient.post<Types>(ENDPOINT, { name }).then((r) => r.data)
}

function updateType(name: string, newName: string): Promise<Types> {
  return apiClient.put<Types>(`${ENDPOINT}/${encodeURIComponent(name)}`, { name: newName }).then((r) => r.data)
}

function deleteType(name: string): Promise<Types> {
  return apiClient.delete<Types>(`${ENDPOINT}/${encodeURIComponent(name)}`).then((r) => r.data)
}

export function useAllTypes() {
  return useQuery({
    queryKey: QUERY_KEYS.types.all,
    queryFn: fetchAllTypes,
  })
}

export function useTypeByName(name: string) {
  return useQuery({
    queryKey: QUERY_KEYS.types.byName(name),
    queryFn: () => fetchTypeByName(name),
    enabled: name.length > 0,
  })
}

export function useCreateType() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (name: string) => createType(name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.types.all }),
  })
}

export function useUpdateType() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ name, newName }: { name: string; newName: string }) => updateType(name, newName),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.types.all }),
  })
}

export function useDeleteType() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (name: string) => deleteType(name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.types.all }),
  })
}
