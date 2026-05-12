import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllTypes, createType } from '../../api/typesApi'
import { getAllBrands, createBrand } from '../../api/brands'
import { getAllCategories, createCategory } from '../../api/categories'
import { createProduct, getProductByName } from '../../api/products'
import { CreatableIdSelect, type Opt } from '../../components/CreatableIdSelect'
import { useAuth } from '../../auth/AuthContext'
import { showAlert } from '../../lib/sweetAlert'

export function AddProductPage() {
  const navigate = useNavigate()
  const { isLoggedIn, userCanAdd } = useAuth()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState(0)
  const [images, setImages] = useState<string[]>([])

  const [typeOptions, setTypeOptions] = useState<Opt[]>([])
  const [brandOptions, setBrandOptions] = useState<Opt[]>([])
  const [categoryOptions, setCategoryOptions] = useState<Opt[]>([])

  const [selectedType, setSelectedType] = useState<Opt | null>(null)
  const [selectedBrand, setSelectedBrand] = useState<Opt | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<Opt | null>(null)
  const [selectedSubCategory, setSelectedSubCategory] = useState<Opt | null>(null)

  useEffect(() => {
    if (!isLoggedIn) navigate('/login')
    void userCanAdd().then((ok) => {
      if (!ok) navigate('/admin/config/home')
    })
  }, [isLoggedIn, navigate, userCanAdd])

  useEffect(() => {
    void getAllTypes().then((types) => setTypeOptions(types.map((t) => ({ value: t._id, label: t.name }))))
    void getAllBrands().then((b) => setBrandOptions(b.map((x) => ({ value: x._id, label: x.name }))))
    void getAllCategories().then((c) => setCategoryOptions(c.map((x) => ({ value: x._id, label: x.name }))))
  }, [])

  const ensureCreated = async (opt: Opt | null, createFn: (name: string) => Promise<{ _id?: string }>): Promise<Opt | null> => {
    if (!opt) return null
    if (opt.value === opt.label) {
      const r = await createFn(opt.label)
      if (r._id) return { value: r._id, label: opt.label }
    }
    return opt
  }

  const onTypeChange = async (opt: Opt | null) => {
    setSelectedType(await ensureCreated(opt, createType))
  }
  const onBrandChange = async (opt: Opt | null) => {
    setSelectedBrand(await ensureCreated(opt, createBrand))
  }
  const onCategoryChange = async (opt: Opt | null) => {
    setSelectedCategory(await ensureCreated(opt, createCategory))
  }
  const onSubCategoryChange = async (opt: Opt | null) => {
    setSelectedSubCategory(await ensureCreated(opt, createCategory))
  }

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const reader = new FileReader()
      reader.onload = () => setImages((prev) => [...prev, String(reader.result ?? '')])
      reader.readAsDataURL(file)
    }
  }

  const save = () => {
    if (!name || name.trim().length < 3 || !description || description.trim().length < 5) {
      showAlert('Error', 'Todos los campos son obligatorios', 'error')
      return
    }
    if (images.filter(Boolean).length < 1) {
      showAlert('Error', 'Debe seleccionar una o más imagenes', 'error')
      return
    }
    if (!selectedBrand?.value || !selectedType?.value || !selectedCategory?.value || !selectedSubCategory?.value) {
      showAlert('Error', 'Seleccione marca, tipo, categoría y subcategoría', 'error')
      return
    }
    void getProductByName(name.trim()).then((product) => {
      if (product && Object.keys(product).length !== 0) {
        showAlert('Error', 'Ya existe un producto llamado ' + product.name, 'error')
        return
      }
      void createProduct(
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
                onKeyDown={(e) => {
                  if (e.key === '-') e.preventDefault()
                }}
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-3">Marca</div>
            <div className="col-md-6">
              <CreatableIdSelect options={brandOptions} value={selectedBrand} onChange={(v) => void onBrandChange(v)} aria-label="Marca" />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-3">Tipo</div>
            <div className="col-md-6">
              <CreatableIdSelect options={typeOptions} value={selectedType} onChange={(v) => void onTypeChange(v)} aria-label="Tipo" />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-3">Categoría</div>
            <div className="col-md-6">
              <CreatableIdSelect options={categoryOptions} value={selectedCategory} onChange={(v) => void onCategoryChange(v)} aria-label="Categoría" />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-3">Subcategoría</div>
            <div className="col-md-6">
              <CreatableIdSelect options={categoryOptions} value={selectedSubCategory} onChange={(v) => void onSubCategoryChange(v)} aria-label="Subcategoría" />
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
                {images.map((image, i) =>
                  image ? (
                    <span key={i} className="me-2">
                      <img src={image} alt="" style={{ maxHeight: 50 }} />
                      <button type="button" className="btn btn-link" onClick={() => setImages((prev) => prev.map((x, j) => (j === i ? '' : x)))}>
                        <i className="fas fa-trash-alt" />
                      </button>
                    </span>
                  ) : null
                )}
              </div>
            </div>
          </div>
          <button type="button" className="btn btn-success" onClick={save}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  )
}
