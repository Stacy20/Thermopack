export function formatDescription(description: string): string {
  return description.replace(/\n/g, '<br>')
}

export function formatColon(value: number): string {
  return `₡${value.toLocaleString('es-CR', { maximumFractionDigits: 0 })}`
}

export function stripHtml(html: string): string {
  if (!html) return ''
  if (typeof document !== 'undefined') {
    const div = document.createElement('div')
    div.innerHTML = html
    return (div.textContent ?? '').replace(/\s+/g, ' ').trim()
  }
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}
