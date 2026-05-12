import { useState } from 'react'
import type { Categories } from '../types/categories'
import { useCatalogStore } from '../stores/catalogStore'

type Props = { categories: Categories[] }

export function Sidebar({ categories }: Props) {
  const { setCategoryFilter } = useCatalogStore()
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)

  return (
    <div className="list-group">
      {categories.map((c, index) => (
        <button
          key={c._id}
          type="button"
          className={'list-group-item list-group-item-action' + (selectedCategory === index ? ' active' : '')}
          onClick={() => {
            setCategoryFilter(c._id)
            setSelectedCategory(index)
          }}
        >
          {c.name}
        </button>
      ))}
    </div>
  )
}
