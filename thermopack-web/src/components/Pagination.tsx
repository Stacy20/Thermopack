import { useCallback, useMemo, useState, useEffect } from 'react'
import { useCatalogStore } from '../stores/catalogStore'
import { LIMIT_PRODUCTS, LIMIT_SERVICE } from '../stores/limits'
import { Button } from './ui/button'

type Props = { type: '0' | '1'; totalServices: number; totalProducts: number }

export function Pagination({ type, totalServices, totalProducts }: Props) {
  const { offsetServices, offsetProducts, nextPage, pastPage } = useCatalogStore()
  const limit = type === '0' ? LIMIT_SERVICE : LIMIT_PRODUCTS
  const offset = type === '0' ? offsetServices : offsetProducts
  const total = type === '0' ? totalServices : totalProducts

  const [currentPage, setCurrentPage] = useState(1)
  useEffect(() => { setCurrentPage(Math.floor(offset / limit) + 1) }, [offset, limit])

  const totalPages = Math.ceil(total / limit) || 1

  const generatePagination = useCallback((): number[] => {
    let start = 1
    if (totalPages > 3) {
      if (currentPage > 1 && currentPage < totalPages) start = currentPage - 1
      else if (currentPage === totalPages) start = totalPages - 2
    }
    const pages: number[] = []
    for (let i = 0; i < 3 && start <= totalPages; i++, start++) pages.push(start)
    return pages
  }, [currentPage, totalPages])

  const updatePage = (change: number) => {
    setCurrentPage((p) => p + change)
    if (change > 0) nextPage(type); else pastPage(type)
  }

  const pages = useMemo(() => generatePagination(), [generatePagination])
  const showPrev = type === '0' ? offsetServices !== 0 : offsetProducts !== 0
  const showNext = type === '0' ? totalServices > LIMIT_SERVICE : totalProducts > LIMIT_PRODUCTS

  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Paginación">
      {showPrev && <Button variant="outline" size="sm" onClick={() => updatePage(-1)}>← Anterior</Button>}
      {pages.map((p) => (
        <Button key={p} variant={p === currentPage ? 'default' : 'outline'} size="sm" onClick={() => updatePage(p - currentPage)}
          className={p === currentPage ? 'bg-brand-800 hover:bg-brand-700' : ''}>
          {p}
        </Button>
      ))}
      {showNext && <Button variant="outline" size="sm" onClick={() => updatePage(1)}>Siguiente →</Button>}
    </nav>
  )
}
