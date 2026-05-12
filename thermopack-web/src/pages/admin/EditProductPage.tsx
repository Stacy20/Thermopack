import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getAllTypes, createType } from '../../api/typesApi'
import { getAllBrands, createBrand } from '../../api/brands'
import { getAllCategories, createCategory } from '../../api/categories'
import { getProductByName, updateProductByName } from '../../api/products'
import { CreatableIdSelect, type Opt } from '../../components/CreatableIdSelect'
import { useAuth } from '../../auth/AuthContext'
import { showAlert, showConfirmationAlert } from '../../lib/sweetAlert'

export function EditProductPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isLoggedIn, userCanEdit } = useAuth()

  const [originalName, setOriginalName] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState(0)
  const [images, setImages] = useState<string[]>([])

  const [descriptionPast, setDescriptionPast] = useState('')
  const [pricePast, setPricePast] = useState(0)
  const [typePast, setTypePast] = useState('')
  const [brandPast, setBrandPast] = useState('')
  const [categoryPast, setCategoryPast] = useState('')
  const [subCategoryPast, setSubCategoryPast] = useState('')
  const [imagesPast, setImagesPast] = useState<string[]>([])

  const [typeOptions, setTypeOptions] = useState<Opt[]>([])
  const [brandOptions, setBrandOptions] = useState<Opt[]>([])
  const [categoryOptions, setCategoryOptions] = useState<Opt[]>([])

  const [selectedType, setSelectedType] = useState<Opt | null>(null)
  const [selectedBrand, setSelectedBrand] = useState<Opt | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<Opt | null>(null)
  const [selectedSubCategory, setSelectedSubCategory] = useState<Opt | null>(null)

  useEffect(() => {
    if (!isLoggedIn) navigate('/login')
    void userCanEdit().then((ok) => {
      if (!ok) navigate('/admin/config/home')
    })
  }, [isLoggedIn, navigate, userCanEdit])

  useEffect(() => {
    const title = id ? decodeURIComponent(id) : ''
    if (!title) return
    const run = async () => {
      const types = await getAllTypes()
      const brands = await getAllBrands()
      const categories = await getAllCategories()
      const typeOpts = types.map((t) => ({ value: t._id, label: t.name }))
      const brandOpts = brands.map((b) => ({ value: b._id, label: b.name }))
      const catOpts = categories.map((c) => ({ value: c._id, label: c.name }))
      setTypeOptions(typeOpts)
      setBrandOptions(brandOpts)
      setCategoryOptions(catOpts)
      const product = await getProductByName(title)
      if (!product.name) return
      setOriginalName(product.name)
      setName(product.name)
      setDescription(product.description)
      setDescriptionPast(product.description)
      setPrice(product.price)
      setPricePast(product.price)
      setTypePast(product.typeId)
      setBrandPast(product.brandId)
      setCategoryPast(product.categoryId)
      setSubCategoryPast(product.subcategoryId)
      setImages([...product.images])
      setImagesPast([...product.images])
      const pick = (opts: Opt[], val: string) => ({ value: val, label: opts.find((o) => o.value === val)?.label ?? val })
      setSelectedType(pick(typeOpts, product.typeId))
      setSelectedBrand(pick(brandOpts, product.brandId))
      setSelectedCategory(pick(catOpts, product.categoryId))
      setSelectedSubCategory(pick(catOpts, product.subcategoryId))
    }
    void run()
  }, [id])

  const ensureCreated = async (opt: Opt | null, createFn: (name: string) => Promise<{ _id?: string }>): Promise<Opt | null> => {
    if (!opt) return null
    if (opt.value === opt.label) {
      const r = await createFn(opt.label)
      if (r._id) return { value: r._id, label: opt.label }
    }
    return opt
  }

  const arraysImagesChanged = () => {
    if (imagesPast.length !== images.length) return true
    for (let i = 0; i < imagesPast.length; i++) {
      if (imagesPast[i] !== images[i]) return true
    }
    return false
  }

  const hasChanged = () =>
    name !== originalName ||
    description !== descriptionPast ||
    price !== pricePast ||
    selectedType?.value !== typePast ||
    selectedBrand?.value !== brandPast ||
    selectedCategory?.value !== categoryPast ||
    selectedSubCategory?.value !== subCategoryPast ||
    arraysImagesChanged()

  const doUpdate = () => {
    if (!selectedBrand?.value || !selectedType?.value || !selectedCategory?.value || !selectedSubCategory?.value) {
      showAlert('Error', 'Seleccione marca, tipo, categoría y subcategoría', 'error')
      return
    }
    void getProductByName(name.trim()).then((product) => {
      if (name !== originalName && product && Object.keys(product).length !== 0) {
        showAlert('Error', 'Ya existe un producto llamado' + product.name, 'error')
        return
      }
      void updateProductByName(
        originalName,
        name.trim(),
        description.trim(),
        selectedBrand.value,
        selectedType.value,
        price,
        selectedCategory.value,
        selectedSubCategory.value,
        images
      ).then(() => {
        showAlert('Éxito', 'Los datos se han guardado correctamente', 'success')
      })
    })
  }

  const update = () => {
    if (!name || name.trim().length < 3 || !description || description.trim().length < 5) {
      showAlert('Error', 'Todos los campos son obligatorios', 'error')
      return
    }
    if (images.filter(Boolean).length < 1) {
      showAlert('Error', 'Debe seleccionar una o más imagenes', 'error')
      return
    }
    if (!hasChanged()) {
      showAlert('Información', 'No se realizó ningún cambio, no hay nada que guardar', 'info')
      return
    }
    showConfirmationAlert('Confirmación', '¿Está seguro que desea realizar cambios?', doUpdate)
  }

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader()
      reader.onload = () => setImages((prev) => [...prev, String(reader.result ?? '')])
      reader.readAsDataURL(files[i])
    }
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
              onKeyDown={(e) => {
                if (e.key === '-') e.preventDefault()
              }}
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-3">Marca</div>
          <div className="col-md-6">
            <CreatableIdSelect
              options={brandOptions}
              value={selectedBrand}
              onChange={(v) => void ensureCreated(v, createBrand).then(setSelectedBrand)}
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-3">Tipo</div>
          <div className="col-md-6">
            <CreatableIdSelect options={typeOptions} value={selectedType} onChange={(v) => void ensureCreated(v, createType).then(setSelectedType)} />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-3">Categoría</div>
          <div className="col-md-6">
            <CreatableIdSelect
              options={categoryOptions}
              value={selectedCategory}
              onChange={(v) => void ensureCreated(v, createCategory).then(setSelectedCategory)}
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-3">Subcategoría</div>
          <div className="col-md-6">
            <CreatableIdSelect
              options={categoryOptions}
              value={selectedSubCategory}
              onChange={(v) => void ensureCreated(v, createCategory).then(setSelectedSubCategory)}
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-3">Imágenes</div>
          <div className="col-md-6">
            <div className="input-group mb-3">
              <input type="file" multiple accept="image/*" className="form-control" id="editProdFiles" onChange={handleFiles} />
              <label className="input-group-text" htmlFor="editProdFiles">
                Agregar
              </label>
            </div>
            {images.map((im, i) =>
              im ? (
                <span key={i} className="me-2">
                  <img src={im} alt="" style={{ maxHeight: 50 }} />
                  <button type="button" className="btn btn-link" onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))}>
                    <i className="fas fa-trash-alt" />
                  </button>
                </span>
              ) : null
            )}
          </div>
        </div>
        <button type="button" className="btn btn-success" onClick={update}>
          Guardar cambios
        </button>
      </div>
    </div>
  )
}
