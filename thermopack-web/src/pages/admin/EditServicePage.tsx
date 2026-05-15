import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useServiceByName, useUpdateService } from '../../hooks/useServices'
import apiClient from '../../api/client'
import { useAuth } from '../../auth/AuthContext'
import { showAlert, showConfirmationAlert } from '../../lib/sweetAlert'
import type { Services } from '../../types/services'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Separator } from '../../components/ui/separator'

export function EditServicePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isLoggedIn, userCanEdit, authReady } = useAuth()
  const serviceName = id ? decodeURIComponent(id) : ''
  const { data: serviceData } = useServiceByName(serviceName)
  const updateService = useUpdateService()

  const [originalName, setOriginalName] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState(0)
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [newImageFiles, setNewImageFiles] = useState<File[]>([])
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([])
  const [savedDescription, setSavedDescription] = useState('')
  const [savedPrice, setSavedPrice] = useState(0)
  const [savedExistingImages, setSavedExistingImages] = useState<string[]>([])

  useEffect(() => {
    if (!authReady) return
    if (!isLoggedIn) navigate('/login')
    void userCanEdit().then((ok) => { if (!ok) navigate('/admin/config/home') })
  }, [authReady, isLoggedIn, navigate, userCanEdit])

  useEffect(() => {
    if (!serviceData?.name) return
    setOriginalName(serviceData.name); setName(serviceData.name)
    setDescription(serviceData.description); setSavedDescription(serviceData.description)
    setPrice(serviceData.price); setSavedPrice(serviceData.price)
    setExistingImages([...serviceData.images]); setSavedExistingImages([...serviceData.images])
  }, [serviceData])

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setNewImageFiles((prev) => [...prev, ...files])
    files.forEach((f) => { const r = new FileReader(); r.onload = () => setNewImagePreviews((prev) => [...prev, String(r.result ?? '')]); r.readAsDataURL(f) })
  }

  const hasChanged = () => name !== originalName || description !== savedDescription || price !== savedPrice || JSON.stringify(existingImages) !== JSON.stringify(savedExistingImages) || newImageFiles.length > 0

  const doUpdate = async () => {
    try {
      if (name !== originalName) {
        const ex = await apiClient.get<Services>(`services/${encodeURIComponent(name.trim())}`).then((r) => r.data).catch(() => null)
        if (ex?.name) { showAlert('Error', 'Ya existe un servicio llamado ' + ex.name, 'error'); return }
      }
      updateService.mutate({ originalName, name: name.trim(), description: description.trim(), price, newImages: newImageFiles, existingImages }, { onSuccess: () => showAlert('Éxito', 'Cambios guardados', 'success') })
    } catch { showAlert('Error', 'Ocurrió un error al guardar', 'error') }
  }

  const update = () => {
    if (name.trim().length < 3 || description.trim().length < 5) { showAlert('Error', 'Todos los campos son obligatorios', 'error'); return }
    if (existingImages.length + newImageFiles.length < 1) { showAlert('Error', 'Debe tener al menos una imagen', 'error'); return }
    if (!hasChanged()) { showAlert('Información', 'No se realizó ningún cambio', 'info'); return }
    showConfirmationAlert('Confirmación', '¿Está seguro?', () => void doUpdate())
  }

  const ImgThumb = ({ src, onRemove }: { src: string; onRemove: () => void }) => (
    <div className="relative">
      <img src={src} alt="" className="h-16 w-16 object-cover rounded-md border border-border" />
      <button onClick={onRemove} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-destructive text-destructive-foreground rounded-full text-xs flex items-center justify-center border-none cursor-pointer">✕</button>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold text-foreground mb-2">Editar Servicio</h2>
      <Separator className="mb-6" />

      <div className="space-y-5">
        <div className="space-y-2"><Label>Nombre</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
        <div className="space-y-2"><Label>Descripción</Label><Textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} /></div>
        <div className="space-y-2"><Label>Precio</Label><Input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} /></div>

        {existingImages.length > 0 && (
          <div className="space-y-2">
            <Label>Imágenes actuales</Label>
            <div className="flex flex-wrap gap-2">
              {existingImages.map((url, i) => <ImgThumb key={i} src={url} onRemove={() => setExistingImages((prev) => prev.filter((_, j) => j !== i))} />)}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label>Agregar imágenes</Label>
          <div className="flex rounded-md border border-input overflow-hidden">
            <input type="file" multiple accept="image/*" className="flex-1 px-3 py-2 text-sm border-none outline-none min-w-0" id="editSvcFiles" onChange={handleFiles} />
            <label htmlFor="editSvcFiles" className="px-3 py-2 bg-muted border-l border-input text-sm text-muted-foreground cursor-pointer whitespace-nowrap hover:bg-secondary transition-colors">Agregar</label>
          </div>
          {newImagePreviews.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {newImagePreviews.map((src, i) => <ImgThumb key={i} src={src} onRemove={() => { setNewImageFiles((p) => p.filter((_, j) => j !== i)); setNewImagePreviews((p) => p.filter((_, j) => j !== i)) }} />)}
            </div>
          )}
        </div>
      </div>

      <Button className="mt-8 bg-green-600 hover:bg-green-700 text-white" onClick={update}>
        Guardar cambios
      </Button>
    </div>
  )
}
