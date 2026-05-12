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

export function AdminProductsPage() {
  const navigate = useNavigate()
  const { isLoggedIn, userLoggedIn } = useAuth()
  const offsetProducts = useCatalogStore((s) => s.offsetProducts)
  const idSelectBrand = useCatalogStore((s) => s.idSelectBrand)
  const idCategory = useCatalogStore((s) => s.idCategory)
  const idSelectType = useCatalogStore((s) => s.idSelectType)
  const termSearch = useCatalogStore((s) => s.termSearch)
  const cleanfilter = useCatalogStore((s) => s.cleanfilter)
  const setBrandFilter = useCatalogStore((s) => s.setBrandFilter)
  const setTypeFilter = useCatalogStore((s) => s.setTypeFilter)

  useEffect(() => {
    if (!isLoggedIn) navigate('/login')
  }, [isLoggedIn, navigate])

  const { data: pageData } = useProductsPage(
    {
      limit: LIMIT_PRODUCTS,
      offset: offsetProducts,
      brandId: idSelectBrand,
      categoryId: idCategory,
      typeId: idSelectType,
      name: termSearch,
    },
    isLoggedIn
  )

  const { data: brands = [] } = useAllBrands()
  const { data: types = [] } = useAllTypes()

  const products = pageData?.products ?? []
  const totalProducts = pageData?.totalCount ?? 0

  return (
    <div className="container">
      <div className="row mt-4 ms-4 d-flex justify-content-center">
        <div className="d-flex flex-wrap justify-content-between align-items-center col-12">
          <h2 className="col-10 col-lg-6 col-md-6">Administrar Productos</h2>
          {userLoggedIn?.privileges?.[0] === 1 && (
            <div className="mb-3 col-10 col-lg-6 col-md-6">
              <button type="button" className="my-custom-button w-100 w-md-auto" onClick={() => navigate('/admin/products/add')}>
                <i className="fa-solid fa-plus" /> Agregar productos
              </button>
            </div>
          )}
        </div>
        <hr />
        <div className="col-12 col-lg-9">
          <div className="mb-3 col-12 ms-3">
            <div className="row shadow p-2 bg-body rounded">
              <div className="col-12 col-sm-12 col-lg-5 col-md-5 d-flex align-items-center">
                <span className="me-4 col-2 col-md-2 col-sm-1 ms-1">Marca: </span>
                <div className="col-8">
                  <BrandSelect
                    brands={brands}
                    onPick={(index) => {
                      if (!Number.isNaN(index) && brands[index]) setBrandFilter(brands[index]._id)
                    }}
                  />
                </div>
              </div>
              <div className="col-12 col-sm-12 col-lg-5 col-md-5 d-flex align-items-center mt-3 mt-lg-0">
                <span className="me-4 col-2 col-sm-1">Tipo:</span>
                <div className="col-8">
                  <TypeSelect
                    types={types}
                    onPick={(index) => {
                      if (!Number.isNaN(index) && types[index]) setTypeFilter(types[index]._id)
                    }}
                  />
                </div>
              </div>
              <button type="button" className="col-3 col-sm-2 col-lg-1 mt-3 mt-lg-0 my-custom-button" title="Limpiar filtros" onClick={() => cleanfilter()}>
                <i className="fas fa-broom" />
              </button>
            </div>
          </div>
          <div className="container mybackground col-12 ms-2">
            <div className="col-8">
              <SearchBar />
            </div>
            <div className="row justify-content-center align-items-center">
              <ListCard type={1} products={products} services={[]} permissions={1} />
            </div>
            <div className="mt-5">
              <Pagination type="1" totalProducts={totalProducts} totalServices={0} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
