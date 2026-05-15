import { useQuery } from '@tanstack/react-query'
import apiClient from '../api/client'
import { QUERY_KEYS } from '../api/queryKeys'
import type { HomePublicPayload } from '../types/home'

function fetchHomePublic(): Promise<HomePublicPayload> {
  return apiClient.get<HomePublicPayload>('home/public').then((r) => r.data)
}

/** Una sola petición con slogan, descripción, logo, hero, WhatsApp y productos destacados */
export function useHomePublic() {
  return useQuery({
    queryKey: QUERY_KEYS.home.public,
    queryFn: fetchHomePublic,
  })
}
