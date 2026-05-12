import { getJson, postJson, putJson, deleteJson } from './client'
import type { Privileges } from '../types/privileges'

export function getAllPrivileges(): Promise<Privileges[]> {
  return getJson<Privileges[]>('privileges', [])
}

export function getPrivilegeByName(name: string): Promise<Privileges> {
  return getJson<Privileges>(`privileges/${encodeURIComponent(name)}`, {} as Privileges)
}

export function createPrivilege(name: string): Promise<Privileges> {
  return postJson<Privileges>('privileges', { name }, {} as Privileges)
}

export function updatePrivilegeByName(name: string, newName: string): Promise<Privileges> {
  return putJson<Privileges>(`privileges/${encodeURIComponent(name)}`, { name: newName }, {} as Privileges)
}

export function deletePrivilegeByName(name: string): Promise<Privileges> {
  return deleteJson<Privileges>(`privileges/${encodeURIComponent(name)}`, {} as Privileges)
}
