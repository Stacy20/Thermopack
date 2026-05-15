import type { Brands } from '../types/brands'

type Props = {
  brands: Brands[]
  selectedId?: string
  onChange: (brandId: string | undefined) => void
}

export function BrandSelect({ brands, selectedId, onChange }: Props) {
  return (
    <select
      className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-400"
      aria-label="Buscar por marca"
      value={selectedId ?? ''}
      onChange={(e) => {
        const v = e.target.value
        onChange(v === '' ? undefined : v)
      }}
    >
      <option value="">Todas las marcas</option>
      {brands.map((b) => (
        <option key={b._id} value={b._id}>
          {b.name}
        </option>
      ))}
    </select>
  )
}
