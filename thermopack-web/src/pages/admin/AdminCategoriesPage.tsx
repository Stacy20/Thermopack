import { useAllBrands, useUpdateBrand, useDeleteBrand } from '../../hooks/useBrands'
import { useAllTypes, useUpdateType, useDeleteType } from '../../hooks/useTypes'
import { useAllCategories, useUpdateCategory, useDeleteCategory } from '../../hooks/useCategories'
import apiClient from '../../api/client'
import { EditList, type ListItem } from '../../components/EditList'
import { showAlert, showConfirmationAlert } from '../../lib/sweetAlert'
import type { Brands } from '../../types/brands'
import type { Types } from '../../types/types'
import type { Categories } from '../../types/categories'

export function AdminCategoriesPage() {
  const { data: brands = [] } = useAllBrands()
  const { data: types = [] } = useAllTypes()
  const { data: categories = [] } = useAllCategories()

  const updateBrand = useUpdateBrand()
  const deleteBrand = useDeleteBrand()
  const updateType = useUpdateType()
  const deleteType = useDeleteType()
  const updateCategory = useUpdateCategory()
  const deleteCategory = useDeleteCategory()

  const brandItems: ListItem[] = brands.map((b) => ({ _id: b._id, name: b.name }))
  const typeItems: ListItem[] = types.map((t) => ({ _id: t._id, name: t.name }))
  const categoryItems: ListItem[] = categories.map((c) => ({ _id: c._id, name: c.name, productCount: c.productCount }))

  const editBrand = (brand: ListItem) => {
    if (brand._id.trim() === '') {
      showAlert('Error', 'No puede registrar una marca vacía.', 'error')
      return
    }
    if (brand._id.trim() === brand.name.trim()) return
    apiClient.get<Brands>(`brands/${encodeURIComponent(brand._id)}`).then((r) => {
      if (r.data._id !== undefined) {
        showAlert('Atención', 'Esta marca ya está registrada.', 'info')
        return
      }
      showConfirmationAlert('Confirmación', '¿Está seguro que desea editar esta marca?', () => {
        updateBrand.mutate(
          { name: brand.name, newName: brand._id },
          { onSuccess: () => showAlert('Éxito', 'La marca fue editada correctamente.', 'success') }
        )
      }, () => window.location.reload())
    }).catch(() => {
      showConfirmationAlert('Confirmación', '¿Está seguro que desea editar esta marca?', () => {
        updateBrand.mutate(
          { name: brand.name, newName: brand._id },
          { onSuccess: () => showAlert('Éxito', 'La marca fue editada correctamente.', 'success') }
        )
      }, () => window.location.reload())
    })
  }

  const handleDeleteBrand = (brand: ListItem) => {
    showConfirmationAlert(
      'Confirmación',
      `¿Está seguro que desea eliminar la marca ${brand.name}? Asegúrese que no existan productos de esta marca.`,
      () => {
        deleteBrand.mutate(brand.name, {
          onSuccess: () => showAlert('Éxito', 'La marca fue eliminada correctamente.', 'success'),
        })
      },
      () => window.location.reload()
    )
  }

  const editType = (type: ListItem) => {
    if (type._id.trim() === '') {
      showAlert('Error', 'No puede registrar un tipo vacío.', 'error')
      return
    }
    if (type._id.trim() === type.name.trim()) return
    apiClient.get<Types>(`types/${encodeURIComponent(type._id)}`).then((r) => {
      if (r.data._id !== undefined) {
        showAlert('Atención', 'Este tipo ya está registrado.', 'info')
        return
      }
      showConfirmationAlert('Confirmación', '¿Está seguro que desea editar este tipo?', () => {
        updateType.mutate(
          { name: type.name, newName: type._id },
          { onSuccess: () => showAlert('Éxito', 'El tipo fue editado correctamente.', 'success') }
        )
      }, () => window.location.reload())
    }).catch(() => {
      showConfirmationAlert('Confirmación', '¿Está seguro que desea editar este tipo?', () => {
        updateType.mutate(
          { name: type.name, newName: type._id },
          { onSuccess: () => showAlert('Éxito', 'El tipo fue editado correctamente.', 'success') }
        )
      }, () => window.location.reload())
    })
  }

  const handleDeleteType = (type: ListItem) => {
    showConfirmationAlert(
      'Confirmación',
      `¿Está seguro que desea eliminar el tipo ${type.name}? Asegúrese que no existan productos de este tipo.`,
      () => {
        deleteType.mutate(type.name, {
          onSuccess: () => showAlert('Éxito', 'El tipo fue eliminado correctamente.', 'success'),
        })
      },
      () => window.location.reload()
    )
  }

  const editCategory = (category: ListItem) => {
    if (category._id.trim() === '') {
      showAlert('Error', 'No puede registrar una categoría vacía.', 'error')
      return
    }
    if (category._id.trim() === category.name.trim()) return
    apiClient.get<Categories>(`categories/${encodeURIComponent(category._id)}`).then((r) => {
      if (r.data._id !== undefined) {
        showAlert('Atención', 'Esta categoría ya está registrada.', 'info')
        return
      }
      showConfirmationAlert('Confirmación', '¿Está seguro que desea editar este tipo?', () => {
        updateCategory.mutate(
          { name: category.name, newName: category._id },
          { onSuccess: () => showAlert('Éxito', 'La categoría fue editada correctamente.', 'success') }
        )
      }, () => window.location.reload())
    }).catch(() => {
      showConfirmationAlert('Confirmación', '¿Está seguro que desea editar este tipo?', () => {
        updateCategory.mutate(
          { name: category.name, newName: category._id },
          { onSuccess: () => showAlert('Éxito', 'La categoría fue editada correctamente.', 'success') }
        )
      }, () => window.location.reload())
    })
  }

  const handleDeleteCategory = (category: ListItem) => {
    showConfirmationAlert(
      'Confirmación',
      `¿Está seguro que desea eliminar la categoría ${category.name}? Asegúrese que no existan productos de esta categoría.`,
      () => {
        deleteCategory.mutate(category.name, {
          onSuccess: () => showAlert('Éxito', 'La categoría fue eliminada correctamente.', 'success'),
        })
      },
      () => window.location.reload()
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Marcas</h2>
      <EditList items={brandItems} onEdit={editBrand} onDelete={handleDeleteBrand} />
      <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-2">Tipos</h2>
      <EditList items={typeItems} onEdit={editType} onDelete={handleDeleteType} />
      <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-2">Categorías</h2>
      <EditList items={categoryItems} onEdit={editCategory} onDelete={handleDeleteCategory} showCount />
    </div>
  )
}
