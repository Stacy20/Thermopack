import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from '../auth/AuthContext'

export type ListItem = { _id: string; name: string }

type Props = {
  items: ListItem[]
  onEdit: (item: ListItem) => void
  onDelete: (item: ListItem) => void
}

const limitRows = 5

export function EditList({ items: itemsProp, onEdit, onDelete }: Props) {
  const { userLoggedIn } = useAuth()
  const [offset, setOffset] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [query, setQuery] = useState('')
  const [items, setItems] = useState<ListItem[]>(itemsProp)

  useEffect(() => {
    setItems(itemsProp)
  }, [itemsProp])

  const filtered = useMemo(() => {
    if (query.trim() === '') return items
    return items.filter((item) => item.name.toLowerCase().startsWith(query.toLowerCase()))
  }, [items, query])

  const renderItems = useMemo(
    () => filtered.slice(offset, offset + limitRows),
    [filtered, offset]
  )

  const totalRows = filtered.length
  const totalPages = Math.max(1, Math.ceil(totalRows / limitRows))

  useEffect(() => {
    setOffset((currentPage - 1) * limitRows)
  }, [currentPage])

  const search = (q: string) => {
    setQuery(q)
    setOffset(0)
    setCurrentPage(1)
  }

  const editItem = (item: ListItem) => {
    const safeId = item._id.replace(/"/g, '\\"')
    const element = document.querySelector(`[data-index="${safeId}"]`)
    if (element instanceof HTMLElement) {
      const newItem = element.innerText
      onEdit({ _id: newItem, name: item.name })
      if (items.find((i) => i.name === newItem) || newItem.trim() === '') {
        element.innerText = item.name
      } else {
        setItems((prev) => prev.map((i) => (i._id === item._id ? { ...i, name: newItem } : i)))
      }
    }
  }

  const deleteItem = (item: ListItem) => {
    onDelete(item)
    setItems((prev) => prev.filter((i) => i._id !== item._id))
  }

  const generatePagination = useCallback((): number[] => {
    let startPage = 1
    const paginationItems: number[] = []
    if (totalPages > 3) {
      if (currentPage > 1 && currentPage < totalPages) startPage = currentPage - 1
      else if (currentPage === totalPages) startPage = totalPages - 2
    }
    for (let i = 0; i < 3 && startPage <= totalPages; i++, startPage++) {
      paginationItems.push(startPage)
    }
    return paginationItems
  }, [currentPage, totalPages])

  const updateCurrentPage = (change: number) => {
    setCurrentPage((prev) => {
      const next = prev + change
      const tp = Math.max(1, Math.ceil(filtered.length / limitRows))
      return Math.min(Math.max(1, next), tp)
    })
  }

  const pages = generatePagination()
  const canEdit = userLoggedIn?.privileges?.[1] === 1
  const canDel = userLoggedIn?.privileges?.[2] === 1

  return (
    <div>
      <div className="mt-4 d-flex">
        <input
          className="form-control me-2 mt-4"
          type="search"
          placeholder="Introduzca el término que desea buscar"
          aria-label="Buscar"
          onKeyDown={(e) => {
            if (e.key === 'Enter') search((e.target as HTMLInputElement).value)
          }}
        />
        <button
          type="button"
          className="btn mt-4"
          style={{ backgroundColor: '#1c53a8', color: '#ffff' }}
          onClick={(e) => {
            const input = (e.currentTarget.previousSibling as HTMLInputElement)
            search(input?.value ?? '')
          }}
        >
          Search
        </button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th />
            <th />
            <th />
          </tr>
        </thead>
        <tbody>
          {renderItems.length === 0 && (
            <tr>
              <td colSpan={3}>No hay elementos para mostrar.</td>
            </tr>
          )}
          {renderItems.map((item) => (
            <tr key={item._id} className="align-middle">
              <td data-index={item._id} contentEditable suppressContentEditableWarning>
                {item.name}
              </td>
              <td className="col-3">
                {canEdit && (
                  <button type="button" className="btn btn-success w-100" onClick={() => editItem(item)}>
                    <img src="/assets/icons/edit_note_icon.svg" alt="" /> Editar
                  </button>
                )}
              </td>
              <td className="col-3">
                {canDel && (
                  <button type="button" className="btn btn-danger w-100" onClick={() => deleteItem(item)}>
                    <img src="/assets/icons/cancel_close_icon.svg" alt="" /> Eliminar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <nav aria-label="navigation">
        <ul className="pagination justify-content-center">
          {offset !== 0 && (
            <li className="page-item">
              <button type="button" className="page-link" onClick={() => updateCurrentPage(-1)}>
                Anterior
              </button>
            </li>
          )}
          {pages.map((pageNumber) => (
            <li key={pageNumber} className={'page-item' + (pageNumber === currentPage ? ' active' : '')}>
              <button type="button" className="page-link" onClick={() => updateCurrentPage(pageNumber - currentPage)}>
                {pageNumber}
              </button>
            </li>
          ))}
          {totalRows > limitRows && (
            <li className="page-item">
              <button type="button" className="page-link" onClick={() => updateCurrentPage(1)}>
                Siguiente
              </button>
            </li>
          )}
        </ul>
      </nav>
    </div>
  )
}
