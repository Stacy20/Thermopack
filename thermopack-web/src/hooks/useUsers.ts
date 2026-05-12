import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import emailjs from '@emailjs/browser'
import bcrypt from 'bcryptjs'
import apiClient from '../api/client'
import { QUERY_KEYS } from '../api/queryKeys'
import type { Users, DBResponse } from '../types/users'

const ENDPOINT = 'users'

function generateSecurePassword(length: number): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+='
  let password = ''
  for (let i = 0; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)]
  }
  return password
}

async function sendEmailWithPassword(email: string, password: string): Promise<void> {
  emailjs.init('r-AFDRCTXu8pq0Vfg')
  await emailjs.send('service_dffyfl6', 'template_zbgo64g', {
    contrasenha: password,
    to_email: email,
  })
}

function fetchAllUsers(): Promise<Users[]> {
  return apiClient.get<Users[]>(ENDPOINT).then((r) => r.data)
}

function fetchUserByEmail(email: string): Promise<Users> {
  return apiClient.get<Users>(`${ENDPOINT}/${encodeURIComponent(email)}`).then((r) => r.data)
}

async function createUser(email: string, privileges: number[]): Promise<Users> {
  const passwordGenerated = generateSecurePassword(12)
  await sendEmailWithPassword(email, passwordGenerated)
  const password = bcrypt.hashSync(passwordGenerated, 10)
  return apiClient.post<Users>(ENDPOINT, { email, password, privileges }).then((r) => r.data)
}

function updateUser(email: string, newEmail: string, password: string, privileges: number[]): Promise<DBResponse> {
  return apiClient
    .put<DBResponse>(`${ENDPOINT}/${encodeURIComponent(email)}`, { newEmail, password, privileges })
    .then((r) => r.data)
}

function deleteUser(email: string): Promise<DBResponse> {
  return apiClient.delete<DBResponse>(`${ENDPOINT}/${encodeURIComponent(email)}`).then((r) => r.data)
}

export function useAllUsers() {
  return useQuery({
    queryKey: QUERY_KEYS.users.all,
    queryFn: fetchAllUsers,
  })
}

export function useUserByEmail(email: string) {
  return useQuery({
    queryKey: QUERY_KEYS.users.byEmail(email),
    queryFn: () => fetchUserByEmail(email),
    enabled: email.length > 0,
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ email, privileges }: { email: string; privileges: number[] }) =>
      createUser(email, privileges),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users.all }),
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      email,
      newEmail,
      password,
      privileges,
    }: {
      email: string
      newEmail: string
      password: string
      privileges: number[]
    }) => updateUser(email, newEmail, password, privileges),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users.all }),
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (email: string) => deleteUser(email),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users.all }),
  })
}

export function useForgotPassword() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ email, privileges }: { email: string; privileges: number[] }) => {
      const passwordGenerated = generateSecurePassword(12)
      await sendEmailWithPassword(email, passwordGenerated)
      const password = bcrypt.hashSync(passwordGenerated, 10)
      return updateUser(email, email, password, privileges)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users.all }),
  })
}
