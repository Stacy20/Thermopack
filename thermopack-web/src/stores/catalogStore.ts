import { create } from 'zustand'
import { LIMIT_PRODUCTS, LIMIT_SERVICE } from './limits'

type CatalogState = {
  offsetServices: number
  offsetProducts: number
  idSelectBrand?: string
  idCategory?: string
  idSelectType?: string
  termSearch?: string

  nextPage: (id: string) => void
  pastPage: (id: string) => void
  cleanfilter: () => void
  setBrandFilter: (brandId: string | undefined) => void
  setCategoryFilter: (categoryId: string | undefined) => void
  setTypeFilter: (typeId: string | undefined) => void
  setSearchTerm: (name: string | undefined) => void
}

export const useCatalogStore = create<CatalogState>((set, get) => ({
  offsetServices: 0,
  offsetProducts: 0,
  idSelectBrand: undefined,
  idCategory: undefined,
  idSelectType: undefined,
  termSearch: undefined,

  nextPage: (id: string) => {
    const s = get()
    if (id === '0') {
      set({ offsetServices: s.offsetServices + LIMIT_SERVICE })
    } else {
      set({ offsetProducts: s.offsetProducts + LIMIT_PRODUCTS })
    }
  },

  pastPage: (id: string) => {
    const s = get()
    if (id === '0') {
      let next = s.offsetServices - LIMIT_SERVICE
      if (next <= LIMIT_SERVICE) next = 0
      set({ offsetServices: next })
    } else {
      let next = s.offsetProducts - LIMIT_PRODUCTS
      if (next <= LIMIT_PRODUCTS) next = 0
      set({ offsetProducts: next })
    }
  },

  cleanfilter: () => {
    set({
      idSelectBrand: undefined,
      idCategory: undefined,
      idSelectType: undefined,
      termSearch: undefined,
    })
  },

  setBrandFilter: (brandId) => set({ idSelectBrand: brandId }),
  setCategoryFilter: (categoryId) => set({ idCategory: categoryId }),
  setTypeFilter: (typeId) => set({ idSelectType: typeId }),
  setSearchTerm: (name) => set({ termSearch: name }),
}))
