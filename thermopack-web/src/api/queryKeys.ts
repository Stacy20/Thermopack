export const QUERY_KEYS = {
  brands: {
    all: ['brands'] as const,
    byName: (name: string) => ['brands', name] as const,
  },
  categories: {
    all: ['categories'] as const,
    byName: (name: string) => ['categories', name] as const,
  },
  types: {
    all: ['types'] as const,
    byName: (name: string) => ['types', name] as const,
  },
  products: {
    page: (offset: number, brandId?: string, categoryId?: string, typeId?: string, name?: string) =>
      ['products', 'page', offset, brandId, categoryId, typeId, name] as const,
    byName: (name: string) => ['products', name] as const,
    hasAny: ['products', 'hasAny'] as const,
  },
  services: {
    page: (offset: number) => ['services', 'page', offset] as const,
    byName: (name: string) => ['services', name] as const,
    hasAny: ['services', 'hasAny'] as const,
  },
  data: {
    full: ['data'] as const,
    text: ['data', 'text'] as const,
    logo: ['data', 'logo'] as const,
    visionImages: ['data', 'visionImages'] as const,
    presentationImages: ['data', 'presentationImages'] as const,
  },
  contact: {
    all: ['contact'] as const,
  },
  users: {
    all: ['users'] as const,
    byEmail: (email: string) => ['users', email] as const,
  },
  privileges: {
    all: ['privileges'] as const,
  },
}
