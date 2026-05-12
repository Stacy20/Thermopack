/** Same contract as Angular MainService connectionUrl */
export function getApiBase(): string {
  const fromEnv = import.meta.env.VITE_API_BASE_URL as string | undefined
  if (fromEnv && fromEnv.length > 0) {
    return fromEnv.endsWith('/') ? fromEnv : `${fromEnv}/`
  }
  if (import.meta.env.DEV) {
    return '/server/'
  }
  return 'http://localhost:3000/server/'
}

export function apiUrl(path: string): string {
  const base = getApiBase()
  const p = path.startsWith('/') ? path.slice(1) : path
  return `${base}${p}`
}
