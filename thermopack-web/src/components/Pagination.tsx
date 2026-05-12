import { useCallback, useMemo, useState, useEffect } from 'react'
import { useCatalogStore } from '../stores/catalogStore'
import { LIMIT_PRODUCTS, LIMIT_SERVICE } from '../stores/limits'

type Props = {
  type: '0' | '1'
  totalServices: number
  totalProducts: number
}

export function Pagination({ type, totalServices, totalProducts }: Props) {
  const { offsetServices, offsetProducts, nextPage, pastPage } = useCatalogStore()
  const limitService = LIMIT_SERVICE
  const limitProducts = LIMIT_PRODUCTS

  const offset = type === '0' ? offsetServices : offsetProducts
  const limit = type === '0' ? limitService : limitProducts
  const total = type === '0' ? totalServices : totalProducts

  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    setCurrentPage(Math.floor(offset / limit) + 1)
  }, [offset, limit])

  const totalPages = Math.ceil(total / limit) || 1

  const generatePagination = useCallback((): number[] => {
    let startPage = 1
    const paginationItems: number[] = []
    if (totalPages > 3) {
      if (currentPage > 1 && currentPage < totalPages) {
        startPage = currentPage - 1
      } else if (currentPage === totalPages) {
        startPage = totalPages - 2
      }
    }
    for (let i = 0; i < 3 && startPage <= totalPages; i++, startPage++) {
      paginationItems.push(startPage)
    }
    return paginationItems
  }, [currentPage, totalPages])

  const updateCurrentPage = (change: number) => {
    setCurrentPage((p) => p + change)
    if (change > 0) nextPage(type)
    else if (change < 0) pastPage(type)
  }

  const pages = useMemo(() => generatePagination(), [generatePagination])

  return (
    <nav aria-label="Page navigation example">
      <ul className="pagination justify-content-center">
        {type === '0' ? (
          offsetServices !== 0 ? (
            <li className="page-item">
              <button type="button" className="page-link" onClick={() => updateCurrentPage(-1)}>
                Previous
              </button>
            </li>
          ) : null
        ) : offsetProducts !== 0 ? (
          <li className="page-item">
            <button type="button" className="page-link" onClick={() => updateCurrentPage(-1)}>
              Previous
            </button>
          </li>
        ) : null}

        {pages.map((pageNumber) => (
          <li key={pageNumber} className={'page-item' + (pageNumber === currentPage ? ' active' : '')}>
            <button type="button" className="page-link" onClick={() => updateCurrentPage(pageNumber - currentPage)}>
              {pageNumber}
            </button>
          </li>
        ))}

        {type === '0' ? (
          totalServices > limitService ? (
            <li className="page-item">
              <button type="button" className="page-link" onClick={() => updateCurrentPage(1)}>
                Next
              </button>
            </li>
          ) : null
        ) : totalProducts > limitProducts ? (
          <li className="page-item">
            <button type="button" className="page-link" onClick={() => updateCurrentPage(1)}>
              Next
            </button>
          </li>
        ) : null}
      </ul>
    </nav>
  )
}
