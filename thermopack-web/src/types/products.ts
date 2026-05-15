export interface Products {
  id?: string
  _id?: string
  name: string
  description: string
  brand: string
  type: string
  price: number
  category: string
  subcategory: string
  images: string[]
  brandId?: string
  typeId?: string
  categoryId?: string
  subcategoryId?: string
  listPrice?: number
  rating?: number
  features?: string[]
}

export function productId(p: Products): string {
  return p.id ?? p._id ?? ''
}
