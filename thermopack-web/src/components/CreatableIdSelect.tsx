import CreatableSelect from 'react-select/creatable'

export type Opt = { value: string; label: string }

type Props = {
  options: Opt[]
  value: Opt | null
  onChange: (v: Opt | null) => void
  'aria-label'?: string
}

export function CreatableIdSelect({ options, value, onChange, 'aria-label': aria }: Props) {
  return (
    <CreatableSelect<Opt, false>
      isClearable
      options={options}
      value={value && value.label ? value : null}
      onChange={(opt) => {
        const o = opt as Opt | null
        onChange(o ? { value: String(o.value), label: String(o.label) } : null)
      }}
      formatCreateLabel={(input) => `Crear "${input}"`}
      placeholder="Seleccione o cree..."
      aria-label={aria}
    />
  )
}
