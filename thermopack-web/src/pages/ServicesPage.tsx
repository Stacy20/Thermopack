import { useData } from '../hooks/useData'
import { useServicesPage } from '../hooks/useServices'
import { ListCard } from '../components/ListCard'
import { Pagination } from '../components/Pagination'
import { useCatalogStore } from '../stores/catalogStore'
import { LIMIT_SERVICE } from '../stores/limits'
import { formatDescription } from '../utils/text'

export function ServicesPage() {
  const offsetServices = useCatalogStore((s) => s.offsetServices)

  const { data, isLoading } = useServicesPage(LIMIT_SERVICE, offsetServices)
  const { data: siteData } = useData()

  const services = data?.services ?? []
  const totalServices = data?.totalCount ?? 0
  const title = siteData?.servicesTitle ?? 'Nuestros servicios'
  const description = siteData?.servicesParagraph ?? ''

  return (
    <div className="container">
      {isLoading && !siteData ? (
        <div className="text-center py-5">
          <div className="spinner-border" role="status" />
          <p>Cargando...</p>
        </div>
      ) : (
        <>
          <div className="ms-5 me-5">
            <h1>{title}</h1>
            {description === '' ? (
              <p className="placeholder-glow">
                <span className="placeholder col-10 rounded" />
              </p>
            ) : (
              <div className="me-5" dangerouslySetInnerHTML={{ __html: formatDescription(description) }} />
            )}
          </div>
          <div className="container mybackground col-12 ms-2 mt-4">
            <div className="row justify-content-center align-items-center">
              <ListCard type={2} products={[]} services={services} permissions={0} />
            </div>
            <div className="mt-5">
              <Pagination type="0" totalServices={totalServices} totalProducts={0} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
