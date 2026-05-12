import { getJson, postJson, putJson, deleteJson } from './client'
import type { Categories } from '../types/categories'

export function getAllCategories(): Promise<Categories[]> {
  return getJson<Categories[]>('categories', [])
}

export function getCategoryByName(name: string): Promise<Categories> {
  return getJson<Categories>(`categories/${encodeURIComponent(name)}`, {} as Categories)
}

export function createCategory(name: string): Promise<Categories> {
  return postJson<Categories>('categories', { name }, {} as Categories)
}

export function updateCategoryByName(name: string, newName: string): Promise<Categories> {
  return putJson<Categories>(`categories/${encodeURIComponent(name)}`, { name: newName }, {} as Categories)
}

export function deleteCategoryByName(name: string): Promise<Categories> {
  return deleteJson<Categories>(`categories/${encodeURIComponent(name)}`, {} as Categories)
}
