import { useState } from 'react'
import { useCatalogPageCopy } from '../hooks/useData'
import { useContactWhatsapp } from '../hooks/useContact'
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
import { ProductDetailModal } from '../components/ProductDetailModal'
import { useCatalogStore } from '../stores/catalogStore'
import { LIMIT_PRODUCTS } from '../stores/limits'
import { formatDescription } from '../utils/text'
import type { Products } from '../types/products'

export function ProductsPage() {
  const [selectedProduct, setSelectedProduct] = useState<Products | null>(null)

  const offsetProducts = useCatalogStore((s) => s.offsetProducts)
  const idSelectBrand = useCatalogStore((s) => s.idSelectBrand)
  const idCategory = useCatalogStore((s) => s.idCategory)
  const idSelectType = useCatalogStore((s) => s.idSelectType)
  const termSearch = useCatalogStore((s) => s.termSearch)
  const cleanfilter = useCatalogStore((s) => s.cleanfilter)
  const setBrandFilter = useCatalogStore((s) => s.setBrandFilter)
  const setTypeFilter = useCatalogStore((s) => s.setTypeFilter)

  const { data: pageData, isLoading } = useProductsPage({
    limit: LIMIT_PRODUCTS,
    offset: offsetProducts,
    brandId: idSelectBrand,
    categoryId: idCategory,
    typeId: idSelectType,
    name: termSearch,
  })

  const { data: catalogCopy } = useCatalogPageCopy()
  const { data: whatsappPayload } = useContactWhatsapp()
  const { data: brands = [] } = useAllBrands()
  const { data: categories = [] } = useAllCategories()
  const { data: types = [] } = useAllTypes()

  const products = pageData?.products ?? []
  const totalProducts = pageData?.totalCount ?? 0
  const title = catalogCopy?.productsTitle ?? 'Nuestros productos'
  const description = catalogCopy?.productsParagraph ?? ''
  const whatsapp = whatsappPayload?.whatsappLink ?? ''

  return (
    <div className="pt-[70px]">
      {/* Hero */}
      <div className="hero-gradient py-16 text-center">
        <h1 className="font-display text-4xl font-extrabold text-white mb-2">{title}</h1>
        {description && (
          <div
            className="text-white/70 text-base max-w-xl mx-auto"
            dangerouslySetInnerHTML={{ __html: formatDescription(description) }}
          />
        )}
      </div>

      {/* Layout */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
          {/* Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-[90px]">
              <p className="font-display font-bold text-[0.9rem] text-gray-900 mb-3 uppercase tracking-wider">Categorías</p>
              <Sidebar categories={categories} />
            </div>
          </div>

          {/* Main */}
          <div>
            {/* Filter bar */}
            <div className="flex flex-wrap gap-3 mb-5 p-4 bg-white rounded-2xl border border-gray-200 shadow-sm items-center">
              <div className="flex items-center gap-2 flex-1 min-w-[180px]">
                <span className="text-[0.82rem] font-semibold text-gray-700 whitespace-nowrap">Marca:</span>
                <div className="flex-1">
                  <BrandSelect brands={brands} selectedId={idSelectBrand} onChange={setBrandFilter} />
                </div>
              </div>
              <div className="flex items-center gap-2 flex-1 min-w-[180px]">
                <span className="text-[0.82rem] font-semibold text-gray-700 whitespace-nowrap">Tipo:</span>
                <div className="flex-1">
                  <TypeSelect types={types} selectedId={idSelectType} onChange={setTypeFilter} />
                </div>
              </div>
              <button
                type="button"
                title="Limpiar filtros"
                onClick={() => cleanfilter()}
                className="bg-gray-100 border border-gray-200 rounded-full px-4 py-2 text-[0.82rem] text-gray-600 cursor-pointer hover:bg-gray-200 transition-colors font-body"
              >
                🧹 Limpiar
              </button>
            </div>

            {/* Search */}
            <div className="mb-5">
              <SearchBar />
            </div>

            {/* Cards */}
            <div className="row justify-content-center">
              <ListCard
                type={1}
                products={products}
                services={[]}
                permissions={0}
                isLoading={isLoading}
                onViewDetail={(p) => setSelectedProduct(p)}
              />
            </div>

            {/* Pagination */}
            <div className="mt-8">
              <Pagination type="1" totalProducts={totalProducts} totalServices={0} />
            </div>
          </div>
        </div>
      </div>

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        whatsapp={whatsapp}
      />
    </div>
  )
}
