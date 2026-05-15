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
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Separator } from '../../components/ui/separator'

function ProductImgThumb({ src, onRemove }: { src: string; onRemove: () => void }) {
  return (
    <div className="relative">
      <img src={src} alt="" className="h-16 w-16 object-cover rounded-md border border-border" />
      <button
        type="button"
        onClick={onRemove}
        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-destructive text-destructive-foreground rounded-full text-xs flex items-center justify-center border-none cursor-pointer"
      >
        ✕
      </button>
    </div>
  )
}

export function EditProductPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isLoggedIn, userCanEdit, authReady } = useAuth()
  const productName = id ? decodeURIComponent(id) : ''

  const { data: productData } = useProductByName(productName)
  const { data: types = [] } = useAllTypes()
  const { data: brands = [] } = useAllBrands()
  const { data: categories = [] } = useAllCategories()
  const createType = useCreateType(); const createBrand = useCreateBrand(); const createCategory = useCreateCategory()
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
  const [rating, setRating] = useState(5)
  const [savedRating, setSavedRating] = useState(5)
  const [listPrice, setListPrice] = useState('')
  const [savedListPrice, setSavedListPrice] = useState('')
  const [featuresText, setFeaturesText] = useState('')
  const [savedFeaturesText, setSavedFeaturesText] = useState('')
  const [selectedType, setSelectedType] = useState<Opt | null>(null)
  const [selectedBrand, setSelectedBrand] = useState<Opt | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<Opt | null>(null)
  const [selectedSubCategory, setSelectedSubCategory] = useState<Opt | null>(null)

  const typeOptions: Opt[] = types.map((t) => ({ value: t._id ?? '', label: t.name }))
  const brandOptions: Opt[] = brands.map((b) => ({ value: b._id ?? '', label: b.name }))
  const categoryOptions: Opt[] = categories.map((c) => ({ value: c._id ?? '', label: c.name }))

  useEffect(() => {
    if (!authReady) return
    if (!isLoggedIn) navigate('/login')
    void userCanEdit().then((ok) => { if (!ok) navigate('/admin/config/home') })
  }, [authReady, isLoggedIn, navigate, userCanEdit])

  useEffect(() => {
    if (!productData?.name || !typeOptions.length) return
    const pick = (opts: Opt[], val: string): Opt => ({ value: val, label: opts.find((o) => o.value === val)?.label ?? val })
    setOriginalName(productData.name); setName(productData.name)
    setDescription(productData.description); setSavedDescription(productData.description)
    setPrice(productData.price); setSavedPrice(productData.price)
    setSavedTypeId(productData.typeId); setSavedBrandId(productData.brandId)
    setSavedCategoryId(productData.categoryId); setSavedSubcategoryId(productData.subcategoryId)
    setExistingImages([...productData.images]); setSavedExistingImages([...productData.images])
    setSelectedType(pick(typeOptions, productData.typeId))
    setSelectedBrand(pick(brandOptions, productData.brandId))
    setSelectedCategory(pick(categoryOptions, productData.categoryId))
    setSelectedSubCategory(pick(categoryOptions, productData.subcategoryId))
    const lp = productData.listPrice != null && productData.listPrice > 0 ? String(productData.listPrice) : ''
    setListPrice(lp)
    setSavedListPrice(lp)
    const r = productData.rating != null ? Math.min(5, Math.max(0, Math.round(Number(productData.rating)))) : 5
    setRating(r)
    setSavedRating(r)
    const ft = (productData.features ?? []).join('\n')
    setFeaturesText(ft)
    setSavedFeaturesText(ft)
  }, [productData, types, brands, categories])

  const ensureCreated = async (opt: Opt | null, fn: (n: string) => Promise<{ _id?: string }>): Promise<Opt | null> => {
    if (!opt) return null
    if (opt.value === opt.label) { const c = await fn(opt.label); if (c._id) return { value: c._id, label: opt.label } }
    return opt
  }

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setNewImageFiles((prev) => [...prev, ...files])
    files.forEach((f) => { const r = new FileReader(); r.onload = () => setNewImagePreviews((prev) => [...prev, String(r.result ?? '')]); r.readAsDataURL(f) })
  }

  const hasChanged = () =>
    name !== originalName || description !== savedDescription || price !== savedPrice ||
    listPrice !== savedListPrice || rating !== savedRating || featuresText !== savedFeaturesText ||
    selectedType?.value !== savedTypeId || selectedBrand?.value !== savedBrandId ||
    selectedCategory?.value !== savedCategoryId || selectedSubCategory?.value !== savedSubcategoryId ||
    JSON.stringify(existingImages) !== JSON.stringify(savedExistingImages) || newImageFiles.length > 0

  const doUpdate = async () => {
    if (!selectedBrand?.value || !selectedType?.value || !selectedCategory?.value || !selectedSubCategory?.value) { showAlert('Error', 'Seleccione marca, tipo, categoría y subcategoría', 'error'); return }
    try {
      if (name !== originalName) {
        const ex = await apiClient.get<Products>(`products/${encodeURIComponent(name.trim())}`).then((r) => r.data).catch(() => null)
        if (ex?.name) { showAlert('Error', 'Ya existe un producto llamado ' + ex.name, 'error'); return }
      }
      const brand = await ensureCreated(selectedBrand, (n) => createBrand.mutateAsync(n))
      const type = await ensureCreated(selectedType, (n) => createType.mutateAsync(n))
      const category = await ensureCreated(selectedCategory, (n) => createCategory.mutateAsync(n))
      const subCategory = await ensureCreated(selectedSubCategory, (n) => createCategory.mutateAsync(n))
      if (!brand?.value || !type?.value || !category?.value || !subCategory?.value) return
      const features = featuresText.split('\n').map((s) => s.trim()).filter(Boolean)
      const lp = listPrice.trim() === '' ? undefined : Number(listPrice)
      const listPriceNum = lp != null && !Number.isNaN(lp) && lp > 0 ? lp : undefined
      const ratingNum = Math.min(5, Math.max(0, Math.round(Number(rating))))
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
          rating: ratingNum,
          listPrice: listPriceNum,
          features,
        },
        { onSuccess: () => showAlert('Éxito', 'Cambios guardados', 'success') }
      )
    } catch { showAlert('Error', 'Ocurrió un error al guardar', 'error') }
  }

  const update = () => {
    if (name.trim().length < 3 || description.trim().length < 5) { showAlert('Error', 'Todos los campos son obligatorios', 'error'); return }
    if (!hasChanged()) { showAlert('Información', 'Sin cambios para guardar', 'info'); return }
    showConfirmationAlert('Confirmación', '¿Está seguro?', () => void doUpdate())
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold text-foreground mb-2">Editar Producto</h2>
      <Separator className="mb-6" />

      <div className="space-y-5">
        <div className="space-y-2"><Label>Nombre</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
        <div className="space-y-2"><Label>Descripción</Label><Textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} /></div>
        <div className="space-y-2"><Label>Precio</Label><Input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} onKeyDown={(e) => { if (e.key === '-') e.preventDefault() }} /></div>
        <div className="space-y-2">
          <Label>Precio de lista (opcional)</Label>
          <Input
            type="number"
            min={0}
            placeholder="Tachado y % si es mayor al precio"
            value={listPrice}
            onChange={(e) => setListPrice(e.target.value)}
            onKeyDown={(e) => { if (e.key === '-') e.preventDefault() }}
          />
        </div>
        <div className="space-y-2">
          <Label>Valoración (0–5)</Label>
          <Input type="number" min={0} max={5} step={1} value={rating} onChange={(e) => setRating(Number(e.target.value))} />
        </div>
        <div className="space-y-2">
          <Label>Beneficios / viñetas (una por línea)</Label>
          <Textarea rows={5} value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} />
        </div>
        <div className="space-y-2"><Label>Marca</Label><CreatableIdSelect options={brandOptions} value={selectedBrand} onChange={(v) => void ensureCreated(v, (n) => createBrand.mutateAsync(n)).then(setSelectedBrand)} /></div>
        <div className="space-y-2"><Label>Tipo</Label><CreatableIdSelect options={typeOptions} value={selectedType} onChange={(v) => void ensureCreated(v, (n) => createType.mutateAsync(n)).then(setSelectedType)} /></div>
        <div className="space-y-2"><Label>Categoría</Label><CreatableIdSelect options={categoryOptions} value={selectedCategory} onChange={(v) => void ensureCreated(v, (n) => createCategory.mutateAsync(n)).then(setSelectedCategory)} /></div>
        <div className="space-y-2"><Label>Subcategoría</Label><CreatableIdSelect options={categoryOptions} value={selectedSubCategory} onChange={(v) => void ensureCreated(v, (n) => createCategory.mutateAsync(n)).then(setSelectedSubCategory)} /></div>

        {existingImages.length > 0 && (
          <div className="space-y-2">
            <Label>Imágenes actuales</Label>
            <div className="flex flex-wrap gap-2">{existingImages.map((url, i) => <ProductImgThumb key={i} src={url} onRemove={() => setExistingImages((p) => p.filter((_, j) => j !== i))} />)}</div>
          </div>
        )}
        <div className="space-y-2">
          <Label>Agregar imágenes</Label>
          <div className="flex rounded-md border border-input overflow-hidden">
            <input type="file" multiple accept="image/*" className="flex-1 px-3 py-2 text-sm border-none outline-none min-w-0" id="editProdFiles" onChange={handleFiles} />
            <label htmlFor="editProdFiles" className="px-3 py-2 bg-muted border-l border-input text-sm text-muted-foreground cursor-pointer whitespace-nowrap hover:bg-secondary transition-colors">Agregar</label>
          </div>
          {newImagePreviews.length > 0 && <div className="flex flex-wrap gap-2 mt-2">{newImagePreviews.map((src, i) => <ProductImgThumb key={i} src={src} onRemove={() => { setNewImageFiles((p) => p.filter((_, j) => j !== i)); setNewImagePreviews((p) => p.filter((_, j) => j !== i)) }} />)}</div>}
        </div>
      </div>

      <Button className="mt-8 bg-green-600 hover:bg-green-700 text-white" onClick={update}>
        Guardar cambios
      </Button>
    </div>
  )
}
