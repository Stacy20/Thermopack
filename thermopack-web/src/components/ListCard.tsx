import { useProductsHasAny } from '../hooks/useProducts'
import { useServicesHasAny } from '../hooks/useServices'
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
}

export function ListCard({ services, products, type, permissions }: Props) {
  const { data: hasProducts, isLoading: loadingProducts } = useProductsHasAny()
  const { data: hasServices, isLoading: loadingServices } = useServicesHasAny()

  const isLoading = type === 1 ? loadingProducts : loadingServices
  const hasItems = type === 1 ? hasProducts : hasServices
  const isReady = !isLoading && (type === 1 ? products.length > 0 || !hasItems : services.length > 0 || !hasItems)

  if (!isReady) {
    return (
      <div className="row justify-content-center align-items-center">
        <div className="spinner-border mt-5 mb-2" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <h6 className="d-flex justify-content-center align-items-center">Cargando...</h6>
      </div>
    )
  }

  if (type === 1) {
    return (
      <div className="row">
        {products.length === 0 && <p className="mt-4">No hay productos para mostrar.</p>}
        {products.map((product) => (
          <div key={productId(product)} className={permissions === 0 ? 'col-10 col-sm-8 col-md-5 col-lg-4 mt-4' : 'col-12 col-sm-8 col-md-5 col-lg-4 mt-4'}>
            <Card
              permissions={permissions}
              type={type}
              id={productId(product)}
              title={product.name}
              text={product.description}
              src={product.images?.[0] ?? ''}
            />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="row">
      {services.length === 0 && <p>No hay servicios para mostrar.</p>}
      {services.map((s) => (
        <div key={serviceId(s)} className={permissions === 0 ? 'col-10 col-sm-8 col-md-5 col-lg-4 mt-4' : 'col-12 col-sm-8 col-md-5 col-lg-4 mt-4'}>
          <Card permissions={permissions} id={serviceId(s)} title={s.name} text={s.description} type={2} src={s.images?.[0] ?? ''} />
        </div>
      ))}
    </div>
  )
}
