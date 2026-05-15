/**
 * Índices de slots para galerías en admin. Ampliar los arrays (p. ej. añadir 4, 5…)
 * si el backend y las pantallas públicas soportan más imágenes.
 *
 * `visionImages` en inicio (legacy Angular): [0,1] misión, [2,3] visión.
 */
export const HOME_VISION_MISSION_SLOT_INDICES = [0] as const
export const HOME_VISION_VISION_SLOT_INDICES = [1] as const

export const HOME_VISION_IMAGE_SLOT_INDICES = [
  ...HOME_VISION_MISSION_SLOT_INDICES,
  ...HOME_VISION_VISION_SLOT_INDICES,
] as const

export const HOME_VISION_MISSION_SLOT_LABELS = ['Misión — imagen 1'] as const
export const HOME_VISION_VISION_SLOT_LABELS = ['Visión — imagen 1'] as const

export const HOME_PRESENTATION_IMAGE_SLOT_INDICES = [0, 1, 2, 3] as const
export const HOME_PRESENTATION_IMAGE_SLOT_LABELS = [
  'Presentación — imagen 1',
  'Presentación — imagen 2',
  'Presentación — imagen 3',
  'Presentación — imagen 4',
] as const

export const CONTACT_PAGE_IMAGE_SLOT_INDICES = [0, 1, 2, 3] as const
export const CONTACT_PAGE_IMAGE_SLOT_LABELS = [
  'Contacto — imagen 1',
  'Contacto — imagen 2',
  'Contacto — imagen 3',
  'Contacto — imagen 4',
] as const

export const HOME_VISION_IMAGE_SLOT_COUNT = HOME_VISION_IMAGE_SLOT_INDICES.length
export const HOME_PRESENTATION_IMAGE_SLOT_COUNT = HOME_PRESENTATION_IMAGE_SLOT_INDICES.length
export const CONTACT_PAGE_IMAGE_SLOT_COUNT = CONTACT_PAGE_IMAGE_SLOT_INDICES.length
