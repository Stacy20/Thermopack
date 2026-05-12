import type { Types } from '../types/types'

type Props = { types: Types[]; onPick: (index: number) => void }

export function TypeSelect({ types, onPick }: Props) {
  return (
    <select className="form-select" aria-label="Buscar por tipo" defaultValue="" onChange={(e) => onPick(Number(e.target.value))}>
      <option value="" disabled hidden>
        Buscar por tipo
      </option>
      {types.map((t, index) => (
        <option key={t._id} value={index}>
          {t.name}
        </option>
      ))}
    </select>
  )
}
