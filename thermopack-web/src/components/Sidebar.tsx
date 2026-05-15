import type { Categories } from '../types/categories'
import { useCatalogStore } from '../stores/catalogStore'

type Props = { categories: Categories[] }

export function Sidebar({ categories }: Props) {
  const idCategory = useCatalogStore((s) => s.idCategory)
  const setCategoryFilter = useCatalogStore((s) => s.setCategoryFilter)

  return (
    <div className="flex flex-col gap-1">
      {categories.map((c) => {
        const isActive = idCategory === c._id
        return (
          <button
            key={c._id}
            type="button"
            className={
              'flex justify-between items-center w-full px-4 py-2.5 rounded-xl text-sm font-medium text-left transition-colors cursor-pointer border-none ' +
              (isActive
                ? 'bg-brand-800 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-brand-50 hover:text-brand-700')
            }
            onClick={() => {
              setCategoryFilter(c._id)
            }}
          >
            <span>{c.name}</span>
            {c.productCount !== undefined && (
              <span
                className={
                  'text-xs px-2 py-0.5 rounded-full font-semibold ' +
                  (isActive ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600')
                }
              >
                {c.productCount}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
