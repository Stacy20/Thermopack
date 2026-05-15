import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '../api/client'
import { QUERY_KEYS } from '../api/queryKeys'
import type { Contact } from '../types/contact'

const ENDPOINT = 'contact'

export type UpdateContactParams = {
  welcomeParagraph: string
  ubicationText: string
  ubicationGMLink: string
  ubicationWazeLink: string
  telephoneNumbers: string[]
  email: string
  whatsappLink: string
  facebookLink: string
  instagramLink: string
  youtubeLink: string
}

export type UpdateContactImagesParams = {
  newImages: File[]
  existingImages: string[]
}

function fetchContact(): Promise<Contact> {
  return apiClient.get<Contact>(ENDPOINT).then((r) => r.data)
}

function fetchContactWhatsapp(): Promise<{ whatsappLink: string }> {
  return apiClient.get<{ whatsappLink: string }>(`${ENDPOINT}/whatsapp`).then((r) => r.data)
}

function updateContact(params: UpdateContactParams): Promise<Contact> {
  return apiClient.put<Contact>(ENDPOINT, params).then((r) => r.data)
}

function updateContactImages(params: UpdateContactImagesParams): Promise<Contact> {
  const form = new FormData()
  form.append('existingImages', JSON.stringify(params.existingImages))
  params.newImages.forEach((file) => form.append('images', file))
  return apiClient.put<Contact>(ENDPOINT, form).then((r) => r.data)
}

export function useContact() {
  return useQuery({
    queryKey: QUERY_KEYS.contact.all,
    queryFn: fetchContact,
  })
}

export function useContactWhatsapp() {
  return useQuery({
    queryKey: QUERY_KEYS.contact.whatsapp,
    queryFn: fetchContactWhatsapp,
  })
}

export function useUpdateContact() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: UpdateContactParams) => updateContact(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.contact.all })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.contact.whatsapp })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.home.public })
    },
  })
}

export function useUpdateContactImages() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: UpdateContactImagesParams) => updateContactImages(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.contact.all })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.contact.whatsapp })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.home.public })
    },
  })
}
