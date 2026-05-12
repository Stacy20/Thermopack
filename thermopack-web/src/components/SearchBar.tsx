import { useCatalogStore } from '../stores/catalogStore'

export function SearchBar() {
  const { setSearchTerm } = useCatalogStore()

  const search = (query: string) => {
    setSearchTerm(query || undefined)
  }

  return (
    <div className="input-group mb-3">
      <input
        type="search"
        className="form-control"
        placeholder="Buscar productos..."
        onKeyDown={(e) => {
          if (e.key === 'Enter') search((e.target as HTMLInputElement).value)
        }}
      />
      <button className="btn btn-outline-secondary" type="button" onClick={(e) => {
        const input = (e.currentTarget.previousSibling as HTMLInputElement)
        search(input?.value ?? '')
      }}>
        Buscar
      </button>
    </div>
  )
}
