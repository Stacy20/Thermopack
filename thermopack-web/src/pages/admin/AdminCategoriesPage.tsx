import { useEffect, useState } from 'react'
import { getAllBrands, getBrandByName, updateBrandByName, deleteBrandByName } from '../../api/brands'
import { getAllTypes, getTypeByName, updateTypeByName, deleteTypeByName } from '../../api/typesApi'
import { getAllCategories, getCategoryByName, updateCategoryByName, deleteCategoryByName } from '../../api/categories'
import { EditList, type ListItem } from '../../components/EditList'
import { showAlert, showConfirmationAlert } from '../../lib/sweetAlert'
import type { Brands } from '../../types/brands'
import type { Types } from '../../types/types'
import type { Categories } from '../../types/categories'

export function AdminCategoriesPage() {
  const [brands, setBrands] = useState<Brands[]>([])
  const [types, setTypes] = useState<Types[]>([])
  const [categories, setCategories] = useState<Categories[]>([])

  useEffect(() => {
    void getAllBrands().then(setBrands)
    void getAllTypes().then(setTypes)
    void getAllCategories().then(setCategories)
  }, [])

  const brandItems: ListItem[] = brands.map((b) => ({ _id: b._id, name: b.name }))
  const typeItems: ListItem[] = types.map((t) => ({ _id: t._id, name: t.name }))
  const categoryItems: ListItem[] = categories.map((c) => ({ _id: c._id, name: c.name }))

  const editBrand = (brand: ListItem) => {
    void getBrandByName(brand._id).then((response) => {
      if (response._id !== undefined) {
        showAlert('Atención', 'Esta marca ya está registrada.', 'info')
        return
      }
      if (brand._id.trim() === '') {
        showAlert('Error', 'No puede registrar una marca vacía.', 'error')
        return
      }
      showConfirmationAlert('Confirmación', '¿Está seguro que desea editar esta marca?', () => {
        void updateBrandByName(brand.name, brand._id).then(() => {
          showAlert('Éxito', 'La marca fue editada correctamente.', 'success')
          void getAllBrands().then(setBrands)
        })
      }, () => window.location.reload())
    })
  }

  const deleteBrand = (brand: ListItem) => {
    showConfirmationAlert(
      'Confirmación',
      `¿Está seguro que desea eliminar la marca ${brand.name}? Asegúrese que no existan productos de esta marca.`,
      () => {
        void deleteBrandByName(brand.name).then(() => {
          showAlert('Éxito', 'La marca fue eliminada correctamente.', 'success')
          void getAllBrands().then(setBrands)
        })
      },
      () => window.location.reload()
    )
  }

  const editType = (type: ListItem) => {
    void getTypeByName(type._id).then((response) => {
      if (response._id !== undefined) {
        showAlert('Atención', 'Este tipo ya está registrado.', 'info')
        return
      }
      if (type._id.trim() === '') {
        showAlert('Error', 'No puede registrar un tipo vacío.', 'error')
        return
      }
      showConfirmationAlert('Confirmación', '¿Está seguro que desea editar este tipo?', () => {
        void updateTypeByName(type.name, type._id).then(() => {
          showAlert('Éxito', 'El tipo fue editado correctamente.', 'success')
          void getAllTypes().then(setTypes)
        })
      }, () => window.location.reload())
    })
  }

  const deleteType = (type: ListItem) => {
    showConfirmationAlert(
      'Confirmación',
      `¿Está seguro que desea eliminar el tipo ${type.name}? Asegúrese que no existan productos de este tipo.`,
      () => {
        void deleteTypeByName(type.name).then(() => {
          showAlert('Éxito', 'El tipo fue eliminado correctamente.', 'success')
          void getAllTypes().then(setTypes)
        })
      },
      () => window.location.reload()
    )
  }

  const editCategory = (category: ListItem) => {
    void getCategoryByName(category._id).then((response) => {
      if (response._id !== undefined) {
        showAlert('Atención', 'Esta categoría ya está registrada.', 'info')
        return
      }
      if (category._id.trim() === '') {
        showAlert('Error', 'No puede registrar una categoría vacía.', 'error')
        return
      }
      showConfirmationAlert('Confirmación', '¿Está seguro que desea editar este tipo?', () => {
        void updateCategoryByName(category.name, category._id).then(() => {
          showAlert('Éxito', 'La categoría fue editada correctamente.', 'success')
          void getAllCategories().then(setCategories)
        })
      }, () => window.location.reload())
    })
  }

  const deleteCategory = (category: ListItem) => {
    showConfirmationAlert(
      'Confirmación',
      `¿Está seguro que desea eliminar la categoría ${category.name}? Asegúrese que no existan productos de esta categoría.`,
      () => {
        void deleteCategoryByName(category.name).then(() => {
          showAlert('Éxito', 'La categoría fue eliminada correctamente.', 'success')
          void getAllCategories().then(setCategories)
        })
      },
      () => window.location.reload()
    )
  }

  return (
    <div className="container py-3">
      <h2>Marcas</h2>
      <EditList items={brandItems} onEdit={editBrand} onDelete={deleteBrand} />
      <h2 className="mt-5">Tipos</h2>
      <EditList items={typeItems} onEdit={editType} onDelete={deleteType} />
      <h2 className="mt-5">Categorías</h2>
      <EditList items={categoryItems} onEdit={editCategory} onDelete={deleteCategory} />
    </div>
  )
}
