import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAllTypes, useCreateType } from '../../hooks/useTypes'
import { useAllBrands, useCreateBrand } from '../../hooks/useBrands'
import { useAllCategories, useCreateCategory } from '../../hooks/useCategories'
import { useProductByName, useUpdateProduct } from '../../hooks/useProducts'
import apiClient from '../../api/client'
import { CreatableIdSelect, type Opt } from '../../components/CreatableIdSelect'
import { useAuth } from '../../auth/AuthContext'
import { showAlert, showConfirmationAlert } from '../../lib/sweetAlert'
import type { Products } from '../../types/products'

export function EditProductPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isLoggedIn, userCanEdit } = useAuth()

  const productName = id ? decodeURIComponent(id) : ''

  const { data: productData } = useProductByName(productName)
  const { data: types = [] } = useAllTypes()
  const { data: brands = [] } = useAllBrands()
  const { data: categories = [] } = useAllCategories()

  const createType = useCreateType()
  const createBrand = useCreateBrand()
  const createCategory = useCreateCategory()
  const updateProduct = useUpdateProduct()

  const [originalName, setOriginalName] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState(0)
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [newImageFiles, setNewImageFiles] = useState<File[]>([])
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([])

  const [savedDescription, setSavedDescription] = useState('')
  const [savedPrice, setSavedPrice] = useState(0)
  const [savedTypeId, setSavedTypeId] = useState('')
  const [savedBrandId, setSavedBrandId] = useState('')
  const [savedCategoryId, setSavedCategoryId] = useState('')
  const [savedSubcategoryId, setSavedSubcategoryId] = useState('')
  const [savedExistingImages, setSavedExistingImages] = useState<string[]>([])

  const [selectedType, setSelectedType] = useState<Opt | null>(null)
  const [selectedBrand, setSelectedBrand] = useState<Opt | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<Opt | null>(null)
  const [selectedSubCategory, setSelectedSubCategory] = useState<Opt | null>(null)

  const typeOptions: Opt[] = types.map((t) => ({ value: t._id ?? '', label: t.name }))
  const brandOptions: Opt[] = brands.map((b) => ({ value: b._id ?? '', label: b.name }))
  const categoryOptions: Opt[] = categories.map((c) => ({ value: c._id ?? '', label: c.name }))

  useEffect(() => {
    if (!isLoggedIn) navigate('/login')
    void userCanEdit().then((ok) => {
      if (!ok) navigate('/admin/config/home')
    })
  }, [isLoggedIn, navigate, userCanEdit])

  useEffect(() => {
    if (!productData?.name || !typeOptions.length) return
    const pick = (opts: Opt[], val: string): Opt => ({
      value: val,
      label: opts.find((o) => o.value === val)?.label ?? val,
    })
    setOriginalName(productData.name)
    setName(productData.name)
    setDescription(productData.description)
    setSavedDescription(productData.description)
    setPrice(productData.price)
    setSavedPrice(productData.price)
    setSavedTypeId(productData.typeId)
    setSavedBrandId(productData.brandId)
    setSavedCategoryId(productData.categoryId)
    setSavedSubcategoryId(productData.subcategoryId)
    setExistingImages([...productData.images])
    setSavedExistingImages([...productData.images])
    setSelectedType(pick(typeOptions, productData.typeId))
    setSelectedBrand(pick(brandOptions, productData.brandId))
    setSelectedCategory(pick(categoryOptions, productData.categoryId))
    setSelectedSubCategory(pick(categoryOptions, productData.subcategoryId))
  }, [productData, types, brands, categories])

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
    setNewImageFiles((prev) => [...prev, ...files])
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = () => setNewImagePreviews((prev) => [...prev, String(reader.result ?? '')])
      reader.readAsDataURL(file)
    })
  }

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index))
  }

  const removeNewImage = (index: number) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index))
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const hasChanged = () =>
    name !== originalName ||
    description !== savedDescription ||
    price !== savedPrice ||
    selectedType?.value !== savedTypeId ||
    selectedBrand?.value !== savedBrandId ||
    selectedCategory?.value !== savedCategoryId ||
    selectedSubCategory?.value !== savedSubcategoryId ||
    JSON.stringify(existingImages) !== JSON.stringify(savedExistingImages) ||
    newImageFiles.length > 0

  const doUpdate = async () => {
    if (!selectedBrand?.value || !selectedType?.value || !selectedCategory?.value || !selectedSubCategory?.value) {
      showAlert('Error', 'Seleccione marca, tipo, categoría y subcategoría', 'error')
      return
    }
    try {
      if (name !== originalName) {
        const existing = await apiClient
          .get<Products>(`products/${encodeURIComponent(name.trim())}`)
          .then((r) => r.data)
          .catch(() => null)
        if (existing?.name) {
          showAlert('Error', 'Ya existe un producto llamado ' + existing.name, 'error')
          return
        }
      }
      const brand = await ensureCreated(selectedBrand, (n) => createBrand.mutateAsync(n))
      const type = await ensureCreated(selectedType, (n) => createType.mutateAsync(n))
      const category = await ensureCreated(selectedCategory, (n) => createCategory.mutateAsync(n))
      const subCategory = await ensureCreated(selectedSubCategory, (n) => createCategory.mutateAsync(n))
      if (!brand?.value || !type?.value || !category?.value || !subCategory?.value) return
      updateProduct.mutate(
        {
          originalName,
          name: name.trim(),
          description: description.trim(),
          brandId: brand.value,
          typeId: type.value,
          price,
          categoryId: category.value,
          subcategoryId: subCategory.value,
          newImages: newImageFiles,
          existingImages,
        },
        { onSuccess: () => showAlert('Éxito', 'Los datos se han guardado correctamente', 'success') }
      )
    } catch {
      showAlert('Error', 'Ocurrió un error al guardar', 'error')
    }
  }

  const update = () => {
    if (name.trim().length < 3 || description.trim().length < 5) {
      showAlert('Error', 'Todos los campos son obligatorios', 'error')
      return
    }

    if (!hasChanged()) {
      showAlert('Información', 'No se realizó ningún cambio, no hay nada que guardar', 'info')
      return
    }
    showConfirmationAlert('Confirmación', '¿Está seguro que desea realizar cambios?', () => void doUpdate())
  }

  return (
    <div className="container">
      <div className="col-md-12 mt-4">
        <h2>Editar Producto</h2>
        <hr />
        <div className="row mb-3">
          <div className="col-md-3">Nombre</div>
          <div className="col-md-6">
            <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-3">Descripción</div>
          <div className="col-md-6">
            <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} />
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
            <CreatableIdSelect
              options={brandOptions}
              value={selectedBrand}
              onChange={(v) => void ensureCreated(v, (n) => createBrand.mutateAsync(n)).then(setSelectedBrand)}
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-3">Tipo</div>
          <div className="col-md-6">
            <CreatableIdSelect
              options={typeOptions}
              value={selectedType}
              onChange={(v) => void ensureCreated(v, (n) => createType.mutateAsync(n)).then(setSelectedType)}
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-3">Categoría</div>
          <div className="col-md-6">
            <CreatableIdSelect
              options={categoryOptions}
              value={selectedCategory}
              onChange={(v) => void ensureCreated(v, (n) => createCategory.mutateAsync(n)).then(setSelectedCategory)}
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-3">Subcategoría</div>
          <div className="col-md-6">
            <CreatableIdSelect
              options={categoryOptions}
              value={selectedSubCategory}
              onChange={(v) => void ensureCreated(v, (n) => createCategory.mutateAsync(n)).then(setSelectedSubCategory)}
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-3">Imágenes actuales</div>
          <div className="col-md-6">
            {existingImages.map((url, i) => (
              <span key={i} className="me-2">
                <img src={url} alt="" style={{ maxHeight: 50 }} />
                <button type="button" className="btn btn-link" onClick={() => removeExistingImage(i)}>
                  <i className="fas fa-trash-alt" />
                </button>
              </span>
            ))}
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-3">Agregar imágenes</div>
          <div className="col-md-6">
            <div className="input-group mb-3">
              <input type="file" multiple accept="image/*" className="form-control" id="editProdFiles" onChange={handleFiles} />
              <label className="input-group-text" htmlFor="editProdFiles">
                Agregar
              </label>
            </div>
            {newImagePreviews.map((preview, i) => (
              <span key={i} className="me-2">
                <img src={preview} alt="" style={{ maxHeight: 50 }} />
                <button type="button" className="btn btn-link" onClick={() => removeNewImage(i)}>
                  <i className="fas fa-trash-alt" />
                </button>
              </span>
            ))}
          </div>
        </div>
        <button type="button" className="btn btn-success" onClick={update}>
          Guardar cambios
        </button>
      </div>
    </div>
  )
}
