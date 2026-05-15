import mongoose from 'mongoose'
import ProductsModel from '../collections/products.collection'
import BrandModel from '../collections/brands.collection'
import CategoryModel from '../collections/categories.collection'
import TypesModel from '../collections/types.collection'

export type ProductListFilter = {
  brandId?: string
  categoryId?: string
  typeId?: string
  name?: { $regex: string; $options: string }
}

const toId = (id: string) => {
  try {
    return new mongoose.Types.ObjectId(id)
  } catch {
    return null
  }
}

/** Siempre un `string[]` de beneficios (viñetas) para el cliente. */
export function normalizeProductFeatures(raw: unknown): string[] {
  if (!Array.isArray(raw)) return []
  return raw
    .filter((x): x is string => typeof x === 'string')
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
}

function attachEnrichedFields(
  p: Record<string, unknown>,
  brandMap: Record<string, string>,
  categoryMap: Record<string, string>,
  typeMap: Record<string, string>
): Record<string, unknown> {
  return {
    ...p,
    features: normalizeProductFeatures(p.features),
    brand: p.brandId ? (brandMap[p.brandId as string] ?? null) : null,
    category: p.categoryId ? (categoryMap[p.categoryId as string] ?? null) : null,
    type: p.typeId ? (typeMap[p.typeId as string] ?? null) : null,
  }
}

async function loadBrandCategoryTypeMaps(
  brandIds: string[],
  categoryIds: string[],
  typeIds: string[]
): Promise<{
  brandMap: Record<string, string>
  categoryMap: Record<string, string>
  typeMap: Record<string, string>
}> {
  const [brands, categories, types] = await Promise.all([
    BrandModel.find({ _id: { $in: brandIds.map(toId).filter(Boolean) } })
      .lean()
      .exec(),
    CategoryModel.find({ _id: { $in: categoryIds.map(toId).filter(Boolean) } })
      .lean()
      .exec(),
    TypesModel.find({ _id: { $in: typeIds.map(toId).filter(Boolean) } })
      .lean()
      .exec(),
  ])

  const brandMap: Record<string, string> = Object.fromEntries(
    brands.map((b) => [(b._id as mongoose.Types.ObjectId).toString(), b.name as string])
  )
  const categoryMap: Record<string, string> = Object.fromEntries(
    categories.map((c) => [(c._id as mongoose.Types.ObjectId).toString(), c.name as string])
  )
  const typeMap: Record<string, string> = Object.fromEntries(
    types.map((t) => [(t._id as mongoose.Types.ObjectId).toString(), t.name as string])
  )

  return { brandMap, categoryMap, typeMap }
}

export async function listEnrichedProducts(
  filter: ProductListFilter,
  skip: number,
  limit: number
): Promise<{ products: Record<string, unknown>[]; totalCount: number }> {
  const [products, totalCount] = await Promise.all([
    ProductsModel.find(filter).skip(skip).limit(limit).lean().exec(),
    ProductsModel.countDocuments(filter),
  ])

  const brandIds = [...new Set(products.map((p) => p.brandId).filter(Boolean))] as string[]
  const categoryIds = [...new Set(products.map((p) => p.categoryId).filter(Boolean))] as string[]
  const typeIds = [...new Set(products.map((p) => p.typeId).filter(Boolean))] as string[]

  const { brandMap, categoryMap, typeMap } = await loadBrandCategoryTypeMaps(brandIds, categoryIds, typeIds)

  const enriched = products.map((p) => attachEnrichedFields(p as Record<string, unknown>, brandMap, categoryMap, typeMap))

  return { products: enriched, totalCount }
}

/** GET por nombre: misma forma que el listado (`brand`, `category`, `type`, `features[]`). */
export async function getEnrichedProductByName(name: string): Promise<Record<string, unknown> | null> {
  const p = await ProductsModel.findOne({ name }).lean().exec()
  if (!p) return null

  const doc = p as Record<string, unknown>
  const brandIds = [...new Set([doc.brandId].filter(Boolean))] as string[]
  const categoryIds = [...new Set([doc.categoryId].filter(Boolean))] as string[]
  const typeIds = [...new Set([doc.typeId].filter(Boolean))] as string[]

  const { brandMap, categoryMap, typeMap } = await loadBrandCategoryTypeMaps(brandIds, categoryIds, typeIds)
  return attachEnrichedFields(doc, brandMap, categoryMap, typeMap)
}
