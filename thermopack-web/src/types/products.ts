export interface Products {
  id?: string
  _id?: string
  name: string
  description: string
  brandId: string
  typeId: string
  price: number
  categoryId: string
  subcategoryId: string
  images: string[]
}

export function productId(p: Products): string {
  return p.id ?? p._id ?? ''
}
