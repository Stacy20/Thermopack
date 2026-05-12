import { useData } from '../hooks/useData'
import { useAllBrands } from '../hooks/useBrands'
import { useAllCategories } from '../hooks/useCategories'
import { useAllTypes } from '../hooks/useTypes'
import { useProductsPage } from '../hooks/useProducts'
import { BrandSelect } from '../components/BrandSelect'
import { TypeSelect } from '../components/TypeSelect'
import { Sidebar } from '../components/Sidebar'
import { SearchBar } from '../components/SearchBar'
import { ListCard } from '../components/ListCard'
import { Pagination } from '../components/Pagination'
import { useCatalogStore } from '../stores/catalogStore'
import { LIMIT_PRODUCTS } from '../stores/limits'
import { formatDescription } from '../utils/text'

export function ProductsPage() {
  const offsetProducts = useCatalogStore((s) => s.offsetProducts)
  const idSelectBrand = useCatalogStore((s) => s.idSelectBrand)
  const idCategory = useCatalogStore((s) => s.idCategory)
  const idSelectType = useCatalogStore((s) => s.idSelectType)
  const termSearch = useCatalogStore((s) => s.termSearch)
  const cleanfilter = useCatalogStore((s) => s.cleanfilter)
  const setBrandFilter = useCatalogStore((s) => s.setBrandFilter)
  const setTypeFilter = useCatalogStore((s) => s.setTypeFilter)

  const { data: pageData } = useProductsPage({
    limit: LIMIT_PRODUCTS,
    offset: offsetProducts,
    brandId: idSelectBrand,
    categoryId: idCategory,
    typeId: idSelectType,
    name: termSearch,
  })

  const { data: siteData } = useData()
  const { data: brands = [] } = useAllBrands()
  const { data: categories = [] } = useAllCategories()
  const { data: types = [] } = useAllTypes()

  const products = pageData?.products ?? []
  const totalProducts = pageData?.totalCount ?? 0
  const title = siteData?.productsTitle ?? 'Nuestros productos'
  const description = siteData?.productsParagraph ?? ''

  return (
    <div className="container">
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
      <div className="row mt-4 ms-4">
        <div className="col-11 col-sm-5 col-md-4 col-lg-3">
          <Sidebar categories={categories} />
        </div>
        <div className="col-12 col-sm-12 col-md-12 col-lg-9">
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
              <div className="col-12 col-sm-12 col-lg-5 col-md-5 d-flex align-items-center mt-sm-3 mt-3 mt-lg-0 mt-md-0">
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
              <button
                type="button"
                className="col-3 col-sm-2 col-lg-1 mt-sm-3 mt-3 mt-lg-0 mt-md-0 my-custom-button"
                title="Limpiar filtros"
                onClick={() => cleanfilter()}
              >
                <i className="fas fa-broom" aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="container mybackground col-12 ms-2">
            <div className="col-8">
              <SearchBar />
            </div>
            <div className="row justify-content-center align-items-center">
              <ListCard type={1} products={products} services={[]} permissions={0} />
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
