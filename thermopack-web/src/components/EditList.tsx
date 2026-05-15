import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { EDIT_LIST_ROWS_PER_PAGE } from '../constants/editListLayout'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'

export type ListItem = { _id: string; name: string; productCount?: number }

type Props = {
  items: ListItem[]
  onEdit: (item: ListItem) => void
  onDelete: (item: ListItem) => void
  showCount?: boolean
}

export function EditList({ items: itemsProp, onEdit, onDelete, showCount = false }: Props) {
  const { userLoggedIn } = useAuth()
  const [offset, setOffset] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [items, setItems] = useState<ListItem[]>(itemsProp)

  useEffect(() => {
    setItems(itemsProp)
  }, [itemsProp])

  const filteredItems = useMemo(
    () =>
      searchQuery.trim() === ''
        ? items
        : items.filter((listItem) => listItem.name.toLowerCase().startsWith(searchQuery.toLowerCase())),
    [items, searchQuery]
  )

  const visibleRows = useMemo(
    () => filteredItems.slice(offset, offset + EDIT_LIST_ROWS_PER_PAGE),
    [filteredItems, offset]
  )
  const totalRows = filteredItems.length
  const totalPages = Math.max(1, Math.ceil(totalRows / EDIT_LIST_ROWS_PER_PAGE))

  useEffect(() => {
    setOffset((currentPage - 1) * EDIT_LIST_ROWS_PER_PAGE)
  }, [currentPage])

  const applySearch = (query: string) => {
    setSearchQuery(query)
    setOffset(0)
    setCurrentPage(1)
  }

  const editItem = (item: ListItem) => {
    const cell = document.querySelector(`[data-index="${item._id.replace(/"/g, '\\"')}"]`)
    if (cell instanceof HTMLElement) {
      const newName = cell.innerText
      onEdit({ _id: newName, name: item.name })
      if (items.find((listItem) => listItem.name === newName) || newName.trim() === '') {
        cell.innerText = item.name
      } else {
        setItems((previous) =>
          previous.map((listItem) => (listItem._id === item._id ? { ...listItem, name: newName } : listItem))
        )
      }
    }
  }

  const deleteItem = (item: ListItem) => {
    onDelete(item)
    setItems((previous) => previous.filter((listItem) => listItem._id !== item._id))
  }

  const buildPaginationWindow = useCallback((): number[] => {
    let windowStart = 1
    if (totalPages > 3) {
      if (currentPage > 1 && currentPage < totalPages) windowStart = currentPage - 1
      else if (currentPage === totalPages) windowStart = totalPages - 2
    }
    const pageNumbers: number[] = []
    for (let slot = 0; slot < 3 && windowStart <= totalPages; slot++, windowStart++) {
      pageNumbers.push(windowStart)
    }
    return pageNumbers
  }, [currentPage, totalPages])

  const shiftPage = (pageDelta: number) => {
    setCurrentPage((previousPage) => {
      const nextPage = previousPage + pageDelta
      const maxPage = Math.max(1, Math.ceil(filteredItems.length / EDIT_LIST_ROWS_PER_PAGE))
      return Math.min(Math.max(1, nextPage), maxPage)
    })
  }

  const paginationWindow = buildPaginationWindow()
  const canEdit = userLoggedIn?.privileges?.[1] === 1
  const canDel = userLoggedIn?.privileges?.[2] === 1

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex gap-2 mt-4">
        <Input
          placeholder="Buscar..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') applySearch((e.target as HTMLInputElement).value)
          }}
        />
        <Button
          variant="outline"
          onClick={(e) => {
            const input = e.currentTarget.previousSibling as HTMLInputElement
            applySearch(input?.value ?? '')
          }}
        >
          Buscar
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              {showCount && <TableHead className="w-28">Productos</TableHead>}
              <TableHead className="w-28" />
              <TableHead className="w-28" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={showCount ? 4 : 3} className="text-center text-muted-foreground py-6">
                  No hay elementos para mostrar.
                </TableCell>
              </TableRow>
            )}
            {visibleRows.map((item) => (
              <TableRow key={item._id}>
                <TableCell
                  data-index={item._id}
                  className="font-medium"
                  contentEditable
                  suppressContentEditableWarning
                >
                  {item.name}
                </TableCell>
                {showCount && (
                  <TableCell>
                    <Badge variant="secondary">{item.productCount ?? 0}</Badge>
                  </TableCell>
                )}
                <TableCell>
                  {canEdit && (
                    <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={() => editItem(item)}>
                      Editar
                    </Button>
                  )}
                </TableCell>
                <TableCell>
                  {canDel && (
                    <Button size="sm" variant="destructive" className="w-full" onClick={() => deleteItem(item)}>
                      Eliminar
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-1">
        {offset !== 0 && (
          <Button variant="outline" size="sm" onClick={() => shiftPage(-1)}>
            ← Anterior
          </Button>
        )}
        {paginationWindow.map((pageNumber) => (
          <Button
            key={pageNumber}
            size="sm"
            variant={pageNumber === currentPage ? 'default' : 'outline'}
            className={pageNumber === currentPage ? 'bg-brand-800 hover:bg-brand-700' : ''}
            onClick={() => shiftPage(pageNumber - currentPage)}
          >
            {pageNumber}
          </Button>
        ))}
        {totalRows > EDIT_LIST_ROWS_PER_PAGE && (
          <Button variant="outline" size="sm" onClick={() => shiftPage(1)}>
            Siguiente →
          </Button>
        )}
      </div>
    </div>
  )
}
