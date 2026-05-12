import type { Brands } from '../types/brands'

type Props = { brands: Brands[]; onPick: (index: number) => void }

export function BrandSelect({ brands, onPick }: Props) {
  return (
    <select className="form-select" aria-label="Buscar por marca" defaultValue="" onChange={(e) => onPick(Number(e.target.value))}>
      <option value="" disabled hidden>
        Buscar por marca
      </option>
      {brands.map((b, index) => (
        <option key={b._id} value={index}>
          {b.name}
        </option>
      ))}
    </select>
  )
}
