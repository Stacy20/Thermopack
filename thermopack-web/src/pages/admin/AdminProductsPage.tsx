import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProductsPage } from '../../hooks/useProducts'
import { useAllBrands } from '../../hooks/useBrands'
import { useAllTypes } from '../../hooks/useTypes'
import { BrandSelect } from '../../components/BrandSelect'
import { TypeSelect } from '../../components/TypeSelect'
import { SearchBar } from '../../components/SearchBar'
import { ListCard } from '../../components/ListCard'
import { Pagination } from '../../components/Pagination'
import { useCatalogStore } from '../../stores/catalogStore'
import { LIMIT_PRODUCTS } from '../../stores/limits'
import { useAuth } from '../../auth/AuthContext'
import { Button } from '../../components/ui/button'
import { Separator } from '../../components/ui/separator'

export function AdminProductsPage() {
  const navigate = useNavigate()
  const { isLoggedIn, userLoggedIn, authReady } = useAuth()
  const offsetProducts = useCatalogStore((s) => s.offsetProducts)
  const idSelectBrand = useCatalogStore((s) => s.idSelectBrand)
  const idCategory = useCatalogStore((s) => s.idCategory)
  const idSelectType = useCatalogStore((s) => s.idSelectType)
  const termSearch = useCatalogStore((s) => s.termSearch)
  const cleanfilter = useCatalogStore((s) => s.cleanfilter)
  const setBrandFilter = useCatalogStore((s) => s.setBrandFilter)
  const setTypeFilter = useCatalogStore((s) => s.setTypeFilter)

  useEffect(() => {
    if (!authReady) return
    if (!isLoggedIn) navigate('/login')
  }, [authReady, isLoggedIn, navigate])

  const { data: pageData } = useProductsPage(
    { limit: LIMIT_PRODUCTS, offset: offsetProducts, brandId: idSelectBrand, categoryId: idCategory, typeId: idSelectType, name: termSearch },
    isLoggedIn
  )

  const { data: brands = [] } = useAllBrands()
  const { data: types = [] } = useAllTypes()

  const products = pageData?.products ?? []
  const totalProducts = pageData?.totalCount ?? 0

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Administrar Productos</h2>
        {userLoggedIn?.privileges?.[0] === 1 && (
          <Button className="bg-brand-800 hover:bg-brand-700 text-white" onClick={() => navigate('/admin/products/add')}>
            + Agregar productos
          </Button>
        )}
      </div>
      <Separator className="mb-6" />

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-4 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 flex-1 min-w-[160px]">
          <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Marca:</span>
          <div className="flex-1">
            <BrandSelect brands={brands} selectedId={idSelectBrand} onChange={setBrandFilter} />
          </div>
        </div>
        <div className="flex items-center gap-2 flex-1 min-w-[160px]">
          <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Tipo:</span>
          <div className="flex-1">
            <TypeSelect types={types} selectedId={idSelectType} onChange={setTypeFilter} />
          </div>
        </div>
        <Button variant="outline" size="sm" title="Limpiar filtros" onClick={() => cleanfilter()}>
          🧹 Limpiar
        </Button>
      </div>

      <SearchBar />
      <ListCard type={1} products={products} services={[]} permissions={1} isLoading={false} />
      <div className="mt-8">
        <Pagination type="1" totalProducts={totalProducts} totalServices={0} />
      </div>
    </div>
  )
}
