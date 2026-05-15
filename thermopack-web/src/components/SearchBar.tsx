import { useEffect, useState } from 'react'
import { useCatalogStore } from '../stores/catalogStore'
import { Input } from './ui/input'
import { Button } from './ui/button'

export function SearchBar() {
  const termSearch = useCatalogStore((s) => s.termSearch)
  const setSearchTerm = useCatalogStore((s) => s.setSearchTerm)
  const [draft, setDraft] = useState(() => termSearch ?? '')

  useEffect(() => {
    setDraft(termSearch ?? '')
  }, [termSearch])

  const search = (query: string) => setSearchTerm(query.trim() || undefined)

  return (
    <div className="flex gap-2 mb-4">
      <Input
        type="search"
        placeholder="Buscar productos..."
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') search((e.target as HTMLInputElement).value)
        }}
      />
      <Button variant="outline" onClick={() => search(draft)}>
        Buscar
      </Button>
    </div>
  )
}
