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

export function AddProductPage() {
  const navigate = useNavigate()
  const { isLoggedIn, userCanAdd, authReady } = useAuth()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState(0)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [rating, setRating] = useState(5)
  const [listPrice, setListPrice] = useState('')
  const [featuresText, setFeaturesText] = useState('')
  const [selectedType, setSelectedType] = useState<Opt | null>(null)
  const [selectedBrand, setSelectedBrand] = useState<Opt | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<Opt | null>(null)
  const [selectedSubCategory, setSelectedSubCategory] = useState<Opt | null>(null)

  const { data: types = [] } = useAllTypes()
  const { data: brands = [] } = useAllBrands()
  const { data: categories = [] } = useAllCategories()
  const createType = useCreateType(); const createBrand = useCreateBrand(); const createCategory = useCreateCategory()
  const createProduct = useCreateProduct()

  const typeOptions: Opt[] = types.map((t) => ({ value: t._id ?? '', label: t.name }))
  const brandOptions: Opt[] = brands.map((b) => ({ value: b._id ?? '', label: b.name }))
  const categoryOptions: Opt[] = categories.map((c) => ({ value: c._id ?? '', label: c.name }))

  useEffect(() => {
    if (!authReady) return
    if (!isLoggedIn) navigate('/login')
    void userCanAdd().then((ok) => { if (!ok) navigate('/admin/config/home') })
  }, [authReady, isLoggedIn, navigate, userCanAdd])

  const ensureCreated = async (opt: Opt | null, fn: (n: string) => Promise<{ _id?: string }>): Promise<Opt | null> => {
    if (!opt) return null
    if (opt.value === opt.label) { const c = await fn(opt.label); if (c._id) return { value: c._id, label: opt.label } }
    return opt
  }

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setImageFiles((prev) => [...prev, ...files])
    files.forEach((f) => { const r = new FileReader(); r.onload = () => setImagePreviews((prev) => [...prev, String(r.result ?? '')]); r.readAsDataURL(f) })
  }

  const save = async () => {
    if (name.trim().length < 3 || description.trim().length < 5) { showAlert('Error', 'Todos los campos son obligatorios', 'error'); return }
    if (imageFiles.length < 1) { showAlert('Error', 'Seleccione al menos una imagen', 'error'); return }
    if (!selectedBrand?.value || !selectedType?.value || !selectedCategory?.value || !selectedSubCategory?.value) { showAlert('Error', 'Seleccione marca, tipo, categoría y subcategoría', 'error'); return }
    try {
      const ex = await apiClient.get<Products>(`products/${encodeURIComponent(name.trim())}`).then((r) => r.data).catch(() => null)
      if (ex?.name) { showAlert('Error', 'Ya existe un producto llamado ' + ex.name, 'error'); return }
      const brand = await ensureCreated(selectedBrand, (n) => createBrand.mutateAsync(n))
      const type = await ensureCreated(selectedType, (n) => createType.mutateAsync(n))
      const category = await ensureCreated(selectedCategory, (n) => createCategory.mutateAsync(n))
      const subCategory = await ensureCreated(selectedSubCategory, (n) => createCategory.mutateAsync(n))
      if (!brand?.value || !type?.value || !category?.value || !subCategory?.value) return
      const features = featuresText.split('\n').map((s) => s.trim()).filter(Boolean)
      const lp = listPrice.trim() === '' ? undefined : Number(listPrice)
      const listPriceNum = lp != null && !Number.isNaN(lp) && lp > 0 ? lp : undefined
      const ratingNum = Math.min(5, Math.max(0, Math.round(Number(rating))))
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
          rating: ratingNum,
          listPrice: listPriceNum,
          features,
        },
        { onSuccess: () => showAlert('Éxito', 'Producto creado correctamente', 'success') }
      )
    } catch { showAlert('Error', 'Ocurrió un error al guardar', 'error') }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold text-foreground mb-2">Agregar Producto</h2>
      <Separator className="mb-6" />

      <div className="space-y-5">
        <div className="space-y-2">
          <Label>Nombre</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
          {name.trim().length > 0 && name.trim().length < 3 && <p className="text-destructive text-xs">Mínimo 3 caracteres</p>}
        </div>
        <div className="space-y-2">
          <Label>Descripción</Label>
          <Textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
          {description.trim().length > 0 && description.trim().length < 5 && <p className="text-destructive text-xs">Mínimo 5 caracteres</p>}
        </div>
        <div className="space-y-2"><Label>Precio</Label><Input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} onKeyDown={(e) => { if (e.key === '-') e.preventDefault() }} /></div>
        <div className="space-y-2">
          <Label>Precio de lista (opcional)</Label>
          <Input
            type="number"
            min={0}
            placeholder="Para mostrar tachado y % de descuento (debe ser mayor al precio)"
            value={listPrice}
            onChange={(e) => setListPrice(e.target.value)}
            onKeyDown={(e) => { if (e.key === '-') e.preventDefault() }}
          />
        </div>
        <div className="space-y-2">
          <Label>Valoración (0–5 estrellas en la ficha)</Label>
          <Input type="number" min={0} max={5} step={1} value={rating} onChange={(e) => setRating(Number(e.target.value))} />
        </div>
        <div className="space-y-2">
          <Label>Beneficios / viñetas (una por línea)</Label>
          <Textarea rows={5} placeholder={'Ej.: Poderoso contra grasa incrustada\nBotella con plástico reciclado'} value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} />
        </div>
        <div className="space-y-2"><Label>Marca</Label><CreatableIdSelect options={brandOptions} value={selectedBrand} onChange={(v) => void ensureCreated(v, (n) => createBrand.mutateAsync(n)).then(setSelectedBrand)} aria-label="Marca" /></div>
        <div className="space-y-2"><Label>Tipo</Label><CreatableIdSelect options={typeOptions} value={selectedType} onChange={(v) => void ensureCreated(v, (n) => createType.mutateAsync(n)).then(setSelectedType)} aria-label="Tipo" /></div>
        <div className="space-y-2"><Label>Categoría</Label><CreatableIdSelect options={categoryOptions} value={selectedCategory} onChange={(v) => void ensureCreated(v, (n) => createCategory.mutateAsync(n)).then(setSelectedCategory)} aria-label="Categoría" /></div>
        <div className="space-y-2"><Label>Subcategoría</Label><CreatableIdSelect options={categoryOptions} value={selectedSubCategory} onChange={(v) => void ensureCreated(v, (n) => createCategory.mutateAsync(n)).then(setSelectedSubCategory)} aria-label="Subcategoría" /></div>

        <div className="space-y-2">
          <Label>Imágenes</Label>
          <div className="flex rounded-md border border-input overflow-hidden">
            <input type="file" multiple accept="image/*" className="flex-1 px-3 py-2 text-sm border-none outline-none min-w-0" id="addProdFiles" onChange={handleFiles} />
            <label htmlFor="addProdFiles" className="px-3 py-2 bg-muted border-l border-input text-sm text-muted-foreground cursor-pointer whitespace-nowrap hover:bg-secondary transition-colors">Seleccionar</label>
          </div>
          {imagePreviews.length > 0 && <div className="flex flex-wrap gap-2 mt-2">{imagePreviews.map((src, i) => <ProductImgThumb key={i} src={src} onRemove={() => { setImageFiles((p) => p.filter((_, j) => j !== i)); setImagePreviews((p) => p.filter((_, j) => j !== i)) }} />)}</div>}
        </div>
      </div>

      <Button className="mt-8 bg-green-600 hover:bg-green-700 text-white" onClick={() => void save()}>
        Guardar producto
      </Button>
    </div>
  )
}
