export function formatDescription(description: string): string {
  return description.replace(/\n/g, '<br>')
}

export function formatColon(value: number): string {
  return `₡${value}`
}
