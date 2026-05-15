import type { Types } from '../types/types'

type Props = {
  types: Types[]
  selectedId?: string
  onChange: (typeId: string | undefined) => void
}

export function TypeSelect({ types, selectedId, onChange }: Props) {
  return (
    <select
      className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-400"
      aria-label="Buscar por tipo"
      value={selectedId ?? ''}
      onChange={(e) => {
        const v = e.target.value
        onChange(v === '' ? undefined : v)
      }}
    >
      <option value="">Todos los tipos</option>
      {types.map((t) => (
        <option key={t._id} value={t._id}>
          {t.name}
        </option>
      ))}
    </select>
  )
}
