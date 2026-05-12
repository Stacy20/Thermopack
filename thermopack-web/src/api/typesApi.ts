import { getJson, postJson, putJson, deleteJson } from './client'
import type { Types } from '../types/types'

export function getAllTypes(): Promise<Types[]> {
  return getJson<Types[]>('types', [])
}

export function getTypeByName(name: string): Promise<Types> {
  return getJson<Types>(`types/${encodeURIComponent(name)}`, {} as Types)
}

export function createType(name: string): Promise<Types> {
  return postJson<Types>('types', { name }, {} as Types)
}

export function updateTypeByName(name: string, newName: string): Promise<Types> {
  return putJson<Types>(`types/${encodeURIComponent(name)}`, { name: newName }, {} as Types)
}

export function deleteTypeByName(name: string): Promise<Types> {
  return deleteJson<Types>(`types/${encodeURIComponent(name)}`, {} as Types)
}
