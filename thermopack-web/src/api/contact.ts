import { getJson, putJson } from './client'
import type { Contact } from '../types/contact'

export function getContactData(): Promise<Contact[]> {
  return getJson<Contact[]>('contact', [])
}

export function updateContactData(
  welcomeParagraph: string,
  ubicationText: string,
  ubicationGMLink: string,
  ubicationWazeLink: string,
  telephoneNumbers: string[],
  email: string,
  whatsappLink: string,
  facebookLink: string,
  instagramLink: string,
  youtubeLink: string
): Promise<Contact> {
  return putJson<Contact>(
    'contact',
    {
      welcomeParagraph,
      ubicationText,
      ubicationGMLink,
      ubicationWazeLink,
      telephoneNumbers,
      email,
      whatsappLink,
      facebookLink,
      instagramLink,
      youtubeLink,
    },
    {} as Contact
  )
}

export function updateContactImages(images: string[]): Promise<Contact> {
  return putJson<Contact>('contact', { images }, {} as Contact)
}
