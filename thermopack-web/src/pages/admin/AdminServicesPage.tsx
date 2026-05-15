import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useServicesPage } from '../../hooks/useServices'
import { ListCard } from '../../components/ListCard'
import { Pagination } from '../../components/Pagination'
import { useCatalogStore } from '../../stores/catalogStore'
import { LIMIT_SERVICE } from '../../stores/limits'
import { useAuth } from '../../auth/AuthContext'
import { Button } from '../../components/ui/button'
import { Separator } from '../../components/ui/separator'

export function AdminServicesPage() {
  const navigate = useNavigate()
  const { isLoggedIn, userLoggedIn, authReady } = useAuth()
  const offsetServices = useCatalogStore((s) => s.offsetServices)

  useEffect(() => {
    if (!authReady) return
    if (!isLoggedIn) navigate('/login')
  }, [authReady, isLoggedIn, navigate])

  const { data } = useServicesPage(LIMIT_SERVICE, offsetServices, isLoggedIn)

  const services = data?.services ?? []
  const totalServices = data?.totalCount ?? 0

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Administrar Servicios</h2>
        {userLoggedIn?.privileges?.[0] === 1 && (
          <Button className="bg-brand-800 hover:bg-brand-700 text-white" onClick={() => navigate('/admin/services/add')}>
            + Agregar servicios
          </Button>
        )}
      </div>
      <Separator className="mb-6" />
      <ListCard type={2} products={[]} services={services} permissions={1} isLoading={false} />
      <div className="mt-8">
        <Pagination type="0" totalServices={totalServices} totalProducts={0} />
      </div>
    </div>
  )
}
