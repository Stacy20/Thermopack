import { Card } from './Card'
import type { Products } from '../types/products'
import type { Services } from '../types/services'
import { productId } from '../types/products'
import { serviceId } from '../types/services'

type Props = {
  services: Services[]
  products: Products[]
  type: number
  permissions: number
  isLoading: boolean
  onViewDetail?: (product: Products) => void
}

export function ListCard({ services, products, type, permissions, isLoading, onViewDetail }: Props) {

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <div className="animate-spin h-10 w-10 border-4 border-brand-800 border-t-transparent rounded-full" />
        <p className="text-gray-500 text-sm">Cargando...</p>
      </div>
    )
  }

  if (type === 1) {
    return (
      <div className="grid w-full grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.length === 0 && <p className="col-span-full text-gray-500 text-sm mt-4">No hay productos para mostrar.</p>}
        {products.map((product) => (
          <Card
            key={productId(product)}
            id={product._id}
            permissions={permissions}
            type={type}
            category={product.category}
            title={product.name}
            text={product.description}
            brand={product.brand}
            src={product.images?.[0] ?? ''}
            price={product.price}
            onViewDetail={onViewDetail ? () => onViewDetail(product) : undefined}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="grid w-full grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {services.length === 0 && <p className="col-span-full text-gray-500 text-sm">No hay servicios para mostrar.</p>}
      {services.map((s) => (
        <Card
          key={serviceId(s)}
          permissions={permissions}
          id={serviceId(s)}
          title={s.name}
          text={s.description}
          type={2}
          src={s.images?.[0] ?? ''}
        />
      ))}
    </div>
  )
}
