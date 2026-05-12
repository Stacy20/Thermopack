export interface Services {
  id?: string
  _id?: string
  name: string
  description: string
  price: number
  images: string[]
}

export function serviceId(s: Services): string {
  return s.id ?? s._id ?? ''
}
