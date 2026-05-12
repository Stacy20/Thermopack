import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { fetchServicesPage } from '../api/servicesApi'
import { getData } from '../api/data'
import { ListCard } from '../components/ListCard'
import { Pagination } from '../components/Pagination'
import { useCatalogStore } from '../stores/catalogStore'
import { LIMIT_SERVICE } from '../stores/limits'
import { formatDescription } from '../utils/text'

export function ServicesPage() {
  const offsetServices = useCatalogStore((s) => s.offsetServices)

  const [title, setTitle] = useState('Nuestros servicios')
  const [description, setDescription] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['servicesPage', offsetServices],
    queryFn: () => fetchServicesPage(LIMIT_SERVICE, offsetServices),
  })

  useEffect(() => {
    void getData().then((d) => {
      if (d[0]) {
        setTitle(d[0].servicesTitle)
        setDescription(d[0].servicesParagraph)
      }
    })
  }, [])

  const services = data?.services ?? []
  const totalServices = data?.totalCount ?? 0
  const loading = isLoading && title === '' && description === ''

  return (
    <div className="container">
      {loading ? (
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
