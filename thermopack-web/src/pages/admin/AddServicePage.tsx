import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateService } from '../../hooks/useServices'
import apiClient from '../../api/client'
import { useAuth } from '../../auth/AuthContext'
import { showAlert } from '../../lib/sweetAlert'
import type { Services } from '../../types/services'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Separator } from '../../components/ui/separator'

export function AddServicePage() {
  const navigate = useNavigate()
  const { isLoggedIn, userCanAdd, authReady } = useAuth()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState(0)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const createService = useCreateService()

  useEffect(() => {
    if (!authReady) return
    if (!isLoggedIn) navigate('/login')
    void userCanAdd().then((ok) => { if (!ok) navigate('/admin/config/home') })
  }, [authReady, isLoggedIn, navigate, userCanAdd])

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setImageFiles((prev) => [...prev, ...files])
    files.forEach((f) => { const r = new FileReader(); r.onload = () => setImagePreviews((prev) => [...prev, String(r.result ?? '')]); r.readAsDataURL(f) })
  }

  const insert = async () => {
    if (name.trim().length < 3 || description.trim().length < 5) { showAlert('Error', 'Todos los campos son obligatorios', 'error'); return }
    if (imageFiles.length < 1) { showAlert('Error', 'Debe seleccionar una o más imágenes', 'error'); return }
    try {
      const ex = await apiClient.get<Services>(`services/${encodeURIComponent(name.trim())}`).then((r) => r.data).catch(() => null)
      if (ex?.name) { showAlert('Error', 'Ya existe un servicio llamado ' + ex.name, 'error'); return }
      createService.mutate({ name: name.trim(), description: description.trim(), price, newImages: imageFiles }, { onSuccess: () => showAlert('Éxito', 'Servicio creado correctamente', 'success') })
    } catch { showAlert('Error', 'Ocurrió un error al guardar', 'error') }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold text-foreground mb-2">Agregar Servicio</h2>
      <Separator className="mb-6" />

      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="svc-name">Nombre</Label>
          <Input id="svc-name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="svc-desc">Descripción</Label>
          <Textarea id="svc-desc" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="svc-price">Precio</Label>
          <Input id="svc-price" type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
        </div>
        <div className="space-y-2">
          <Label>Imágenes</Label>
          <div className="flex rounded-md border border-input overflow-hidden">
            <input type="file" multiple accept="image/*" className="flex-1 px-3 py-2 text-sm border-none outline-none min-w-0" id="addSvcFiles" onChange={handleFiles} />
            <label htmlFor="addSvcFiles" className="px-3 py-2 bg-muted border-l border-input text-sm text-muted-foreground cursor-pointer whitespace-nowrap hover:bg-secondary transition-colors">
              Seleccionar
            </label>
          </div>
          {imagePreviews.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {imagePreviews.map((src, i) => (
                <div key={i} className="relative">
                  <img src={src} alt="" className="h-16 w-16 object-cover rounded-md border border-border" />
                  <button onClick={() => { setImageFiles((p) => p.filter((_, j) => j !== i)); setImagePreviews((p) => p.filter((_, j) => j !== i)) }}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-destructive text-destructive-foreground rounded-full text-xs flex items-center justify-center border-none cursor-pointer">✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Button className="mt-8 bg-green-600 hover:bg-green-700 text-white" onClick={() => void insert()}>
        Guardar servicio
      </Button>
    </div>
  )
}
