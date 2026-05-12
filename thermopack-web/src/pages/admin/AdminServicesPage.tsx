import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useServicesPage } from '../../hooks/useServices'
import { ListCard } from '../../components/ListCard'
import { Pagination } from '../../components/Pagination'
import { useCatalogStore } from '../../stores/catalogStore'
import { LIMIT_SERVICE } from '../../stores/limits'
import { useAuth } from '../../auth/AuthContext'

export function AdminServicesPage() {
  const navigate = useNavigate()
  const { isLoggedIn, userLoggedIn } = useAuth()
  const offsetServices = useCatalogStore((s) => s.offsetServices)

  useEffect(() => {
    if (!isLoggedIn) navigate('/login')
  }, [isLoggedIn, navigate])

  const { data } = useServicesPage(LIMIT_SERVICE, offsetServices, isLoggedIn)

  const services = data?.services ?? []
  const totalServices = data?.totalCount ?? 0

  return (
    <div className="container justify-content-center align-items-center">
      <div className="d-flex flex-wrap justify-content-between align-items-center">
        <h2 className="col-10 col-lg-6 col-md-6">Administrar Servicios</h2>
        {userLoggedIn?.privileges?.[0] === 1 && (
          <div className="mb-3 col-10 col-lg-6 col-md-6">
            <button type="button" className="my-custom-button w-100 w-md-auto" onClick={() => navigate('/admin/services/add')}>
              <i className="fa-solid fa-plus" /> Agregar servicios
            </button>
          </div>
        )}
      </div>
      <hr />
      <div className="justify-content-center align-items-center">
        <ListCard type={2} products={[]} services={services} permissions={1} />
      </div>
      <div className="mt-5">
        <Pagination type="0" totalServices={totalServices} totalProducts={0} />
      </div>
    </div>
  )
}
