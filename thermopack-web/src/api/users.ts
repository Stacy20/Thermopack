import { apiUrl } from '../config/apiBase'
import { getJson, postJson, putJson, deleteJson } from './client'
import type { Users, DBResponse } from '../types/users'
import emailjs from '@emailjs/browser'
import bcrypt from 'bcryptjs'

export async function getUserByEmail(email: string): Promise<Users> {
  try {
    const res = await fetch(apiUrl(`users/${encodeURIComponent(email)}`))
    if (!res.ok) return {} as Users
    return (await res.json()) as Users
  } catch {
    return {} as Users
  }
}

export function getAllUsers(): Promise<Users[]> {
  return getJson<Users[]>('users', [])
}

export async function sendEmailWithPassword(email: string, password: string): Promise<void> {
  emailjs.init('r-AFDRCTXu8pq0Vfg')
  await emailjs.send('service_dffyfl6', 'template_zbgo64g', {
    contrasenha: password,
    to_email: email,
  })
}

export function generateSecurePassword(length: number): string {
  const charset =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+='
  let password = ''
  for (let i = 0; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)]
  }
  return password
}

export async function createUser(email: string, privileges: number[]): Promise<Users> {
  const passwordGenerated = generateSecurePassword(12)
  await sendEmailWithPassword(email, passwordGenerated)
  const password = bcrypt.hashSync(passwordGenerated, 10)
  return postJson<Users>('users', { email, password, privileges }, {} as Users)
}

export function updateUserByEmail(
  email: string,
  newEmail: string,
  password: string,
  privileges: number[]
): Promise<DBResponse> {
  return putJson<DBResponse>(
    `users/${encodeURIComponent(email)}`,
    { newEmail, password, privileges },
    {} as DBResponse
  )
}

export function deleteUserByEmail(email: string): Promise<DBResponse> {
  return deleteJson<DBResponse>(`users/${encodeURIComponent(email)}`, {} as DBResponse)
}

export async function forgotPassword(email: string, privileges: number[]): Promise<void> {
  const passwordGenerated = generateSecurePassword(12)
  await sendEmailWithPassword(email, passwordGenerated)
  const password = bcrypt.hashSync(passwordGenerated, 10)
  await updateUserByEmail(email, email, password, privileges)
}
