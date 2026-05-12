import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAllTypes, useCreateType } from '../../hooks/useTypes'
import { useAllBrands, useCreateBrand } from '../../hooks/useBrands'
import { useAllCategories, useCreateCategory } from '../../hooks/useCategories'
import { useCreateProduct } from '../../hooks/useProducts'
import apiClient from '../../api/client'
import { CreatableIdSelect, type Opt } from '../../components/CreatableIdSelect'
import { useAuth } from '../../auth/AuthContext'
import { showAlert } from '../../lib/sweetAlert'
import type { Products } from '../../types/products'

export function AddProductPage() {
  const navigate = useNavigate()
  const { isLoggedIn, userCanAdd } = useAuth()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState(0)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  const [selectedType, setSelectedType] = useState<Opt | null>(null)
  const [selectedBrand, setSelectedBrand] = useState<Opt | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<Opt | null>(null)
  const [selectedSubCategory, setSelectedSubCategory] = useState<Opt | null>(null)

  const { data: types = [] } = useAllTypes()
  const { data: brands = [] } = useAllBrands()
  const { data: categories = [] } = useAllCategories()
  const createType = useCreateType()
  const createBrand = useCreateBrand()
  const createCategory = useCreateCategory()
  const createProduct = useCreateProduct()

  const typeOptions: Opt[] = types.map((t) => ({ value: t._id ?? '', label: t.name }))
  const brandOptions: Opt[] = brands.map((b) => ({ value: b._id ?? '', label: b.name }))
  const categoryOptions: Opt[] = categories.map((c) => ({ value: c._id ?? '', label: c.name }))

  useEffect(() => {
    if (!isLoggedIn) navigate('/login')
    void userCanAdd().then((ok) => {
      if (!ok) navigate('/admin/config/home')
    })
  }, [isLoggedIn, navigate, userCanAdd])

  // Función para asegurar que se crea un tipo, marca, categoría o subcategoría si no existe
  const ensureCreated = async (
    opt: Opt | null,
    mutateAsync: (name: string) => Promise<{ _id?: string }>
  ): Promise<Opt | null> => {
    if (!opt) return null
    if (opt.value === opt.label) {
      const created = await mutateAsync(opt.label)
      if (created._id) return { value: created._id, label: opt.label }
    }
    return opt
  }

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setImageFiles((prev) => [...prev, ...files])
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = () => setImagePreviews((prev) => [...prev, String(reader.result ?? '')])
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const save = async () => {
    if (name.trim().length < 3 || description.trim().length < 5) {
      showAlert('Error', 'Todos los campos son obligatorios', 'error')
      return
    }
    if (imageFiles.length < 1) {
      showAlert('Error', 'Debe seleccionar una o más imagenes', 'error')
      return
    }
    if (!selectedBrand?.value || !selectedType?.value || !selectedCategory?.value || !selectedSubCategory?.value) {
      showAlert('Error', 'Seleccione marca, tipo, categoría y subcategoría', 'error')
      return
    }
    try {
      const existing = await apiClient.get<Products>(`products/${encodeURIComponent(name.trim())}`).then((r) => r.data).catch(() => null)
      if (existing?.name) {
        showAlert('Error', 'Ya existe un producto llamado ' + existing.name, 'error')
        return
      }
      const brand = await ensureCreated(selectedBrand, (n) => createBrand.mutateAsync(n))
      const type = await ensureCreated(selectedType, (n) => createType.mutateAsync(n))
      const category = await ensureCreated(selectedCategory, (n) => createCategory.mutateAsync(n))
      const subCategory = await ensureCreated(selectedSubCategory, (n) => createCategory.mutateAsync(n))
      if (!brand?.value || !type?.value || !category?.value || !subCategory?.value) return
      createProduct.mutate(
        {
          name: name.trim(),
          description: description.trim(),
          brandId: brand.value,
          typeId: type.value,
          price,
          categoryId: category.value,
          subcategoryId: subCategory.value,
          newImages: imageFiles,
        },
        { onSuccess: () => showAlert('Éxito', 'Los datos se han guardado correctamente', 'success') }
      )
    } catch {
      showAlert('Error', 'Ocurrió un error al guardar', 'error')
    }
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12 mt-4">
          <h2>Agregar Producto</h2>
          <hr />
          <div className="row mb-3">
            <div className="col-md-3">Nombre</div>
            <div className="col-md-6">
              <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
              {name.trim().length < 3 && <div className="text-danger">Debe tener al menos 3 caracteres</div>}
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-3">Descripción</div>
            <div className="col-md-6">
              <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} />
              {description.trim().length < 5 && <div className="text-danger">Debe tener al menos 5 caracteres</div>}
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-3">Precio</div>
            <div className="col-md-6">
              <input
                type="number"
                className="form-control"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                onKeyDown={(e) => { if (e.key === '-') e.preventDefault() }}
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-3">Marca</div>
            <div className="col-md-6">
              <CreatableIdSelect options={brandOptions} value={selectedBrand} onChange={(v) => void ensureCreated(v, (n) => createBrand.mutateAsync(n)).then(setSelectedBrand)} aria-label="Marca" />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-3">Tipo</div>
            <div className="col-md-6">
              <CreatableIdSelect options={typeOptions} value={selectedType} onChange={(v) => void ensureCreated(v, (n) => createType.mutateAsync(n)).then(setSelectedType)} aria-label="Tipo" />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-3">Categoría</div>
            <div className="col-md-6">
              <CreatableIdSelect options={categoryOptions} value={selectedCategory} onChange={(v) => void ensureCreated(v, (n) => createCategory.mutateAsync(n)).then(setSelectedCategory)} aria-label="Categoría" />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-3">Subcategoría</div>
            <div className="col-md-6">
              <CreatableIdSelect options={categoryOptions} value={selectedSubCategory} onChange={(v) => void ensureCreated(v, (n) => createCategory.mutateAsync(n)).then(setSelectedSubCategory)} aria-label="Subcategoría" />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-3">Imágenes</div>
            <div className="col-md-6">
              <div className="input-group mb-3">
                <input type="file" multiple accept="image/*" className="form-control" id="inputFile" onChange={handleFiles} />
                <label className="input-group-text" htmlFor="inputFile">
                  Seleccionar archivo
                </label>
              </div>
              <div>
                {imagePreviews.map((preview, i) => (
                  <span key={i} className="me-2">
                    <img src={preview} alt="" style={{ maxHeight: 50 }} />
                    <button type="button" className="btn btn-link" onClick={() => removeImage(i)}>
                      <i className="fas fa-trash-alt" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
          <button type="button" className="btn btn-success" onClick={() => void save()}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  )
}
