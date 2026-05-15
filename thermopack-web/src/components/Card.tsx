import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { useDeleteProduct } from '../hooks/useProducts'
import { useDeleteService } from '../hooks/useServices'
import { showAlert, showConfirmationAlert } from '../lib/sweetAlert'
import { formatColon } from '../utils/text'
import { Button } from './ui/button'
import {
  Card as ShadCard,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card'

type Props = {
  id: string
  title: string
  category?: string
  src: string
  /** Descripción del producto/servicio (no se muestra en la tarjeta; solo se usa en detalle / API). */
  text: string
  type: number
  permissions: number
  brand?: string
  price?: number
  onViewDetail?: () => void
}

export function Card({ title, category, src, text: _text, type, permissions, brand, price, onViewDetail }: Props) {
  const navigate = useNavigate()
  const { userLoggedIn } = useAuth()
  const deleteProduct = useDeleteProduct()
  const deleteService = useDeleteService()

  const gotoVerMas = () => {
    navigate(`/detalles/${type}/${encodeURIComponent(title)}`)
  }

  const handleVerMas = onViewDetail ?? gotoVerMas

  const gotoEdit = () => {
    if (type === 1) navigate(`/admin/products/edit/${encodeURIComponent(title)}`)
    if (type === 2) navigate(`/admin/services/edit/${encodeURIComponent(title)}`)
  }

  const deleteItem = () => {
    const isProduct = type === 1
    showConfirmationAlert(
      'Confirmación',
      isProduct ? '¿Está seguro que desea eliminar el producto?' : '¿Está seguro que desea eliminar el servicio?',
      () => {
        const mutation = isProduct ? deleteProduct : deleteService
        mutation.mutate(title, {
          onSuccess: () => {
            void showAlert('Éxito', isProduct ? 'El producto se ha eliminado correctamente' : 'El servicio se ha eliminado correctamente', 'success')
            window.location.reload()
          },
        })
      }
    )
  }

  const canEdit = userLoggedIn?.privileges?.[1] === 1
  const canDel = userLoggedIn?.privileges?.[2] === 1

  /* Admin */
  if (permissions !== 0) {
    return (
      <div className="flex h-full min-h-[340px] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="relative mt-3 flex h-44 w-full shrink-0 items-center justify-center overflow-hidden bg-gray-50 px-3 pt-4">
          <img src={src || ''} alt={title} className="h-full w-full object-contain object-center" />
        </div>
        <div className="flex min-h-0 flex-1 flex-col p-4">
          <h5 className="min-h-13 shrink-0 text-sm font-semibold leading-snug text-gray-900 line-clamp-3">
            {title}
          </h5>
          <div className="mt-auto flex min-h-11 shrink-0 justify-between gap-2 pt-4">
            {canEdit && (
              <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700 text-white" onClick={gotoEdit}>
                Editar
              </Button>
            )}
            {canDel && (
              <Button size="sm" variant="destructive" className="flex-1" onClick={deleteItem}>
                Eliminar
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  const showCategory = Boolean((category ?? '').trim())
  const showPrice = price != null && price > 0

  return (
    <ShadCard
      className="flex h-full min-h-[380px] flex-col overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
      onClick={handleVerMas}
    >
      <div className="relative mt-2 w-full shrink-0 overflow-hidden bg-gray-50 px-3 pt-5 pb-3">
        {showCategory && (
          <span className="absolute left-3 top-1 z-10 rounded-full bg-brand-800 px-2 py-1 text-[0.68rem] font-bold text-white">
            {category}
          </span>
        )}
        <div className="flex w-full items-center justify-center">
          {src ? (
            <img
              src={src}
              alt={title}
              className="h-[200px] w-full object-contain object-center"
            />
          ) : (
            <span className="flex h-[200px] w-full items-center justify-center text-6xl">📦</span>
          )}
        </div>
      </div>

      <CardHeader className="shrink-0 space-y-0 px-4 pb-0 pt-2">
        <div className="flex h-5 items-center">
          <span className="w-full truncate text-xs font-bold uppercase tracking-wider text-brand-400">
            {(brand ?? '').trim() || '\u00a0'}
          </span>
        </div>
        <CardTitle className="min-h-13 line-clamp-3 text-[0.95rem] leading-snug">{title}</CardTitle>
      </CardHeader>

      {showPrice && (
      <div className="flex h-8 shrink-0 items-center px-4">
        
          <span className="font-display text-sm font-bold text-brand-700">{formatColon(price)}</span>
        
      </div>
      )}

      <CardFooter className="mt-auto flex h-14 shrink-0 items-center justify-end border-t border-gray-100 px-4 pt-0">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            handleVerMas()
          }}
          className="rounded-full border-none bg-brand-50 px-4 py-2 text-[0.78rem] font-semibold text-brand-700 transition-colors hover:bg-brand-800 hover:text-white font-body cursor-pointer"
        >
          Ver más
        </button>
      </CardFooter>
    </ShadCard>
  )
}
