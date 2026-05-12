import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useServiceByName, useUpdateService } from '../../hooks/useServices'
import apiClient from '../../api/client'
import { useAuth } from '../../auth/AuthContext'
import { showAlert, showConfirmationAlert } from '../../lib/sweetAlert'
import type { Services } from '../../types/services'

export function EditServicePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isLoggedIn, userCanEdit } = useAuth()

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
    if (!isLoggedIn) navigate('/login')
    void userCanEdit().then((ok) => {
      if (!ok) navigate('/admin/config/home')
    })
  }, [isLoggedIn, navigate, userCanEdit])

  useEffect(() => {
    if (!serviceData?.name) return
    setOriginalName(serviceData.name)
    setName(serviceData.name)
    setDescription(serviceData.description)
    setSavedDescription(serviceData.description)
    setPrice(serviceData.price)
    setSavedPrice(serviceData.price)
    setExistingImages([...serviceData.images])
    setSavedExistingImages([...serviceData.images])
  }, [serviceData])

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
    JSON.stringify(existingImages) !== JSON.stringify(savedExistingImages) ||
    newImageFiles.length > 0

  const doUpdate = async () => {
    try {
      if (name !== originalName) {
        const existing = await apiClient
          .get<Services>(`services/${encodeURIComponent(name.trim())}`)
          .then((r) => r.data)
          .catch(() => null)
        if (existing?.name) {
          showAlert('Error', 'Ya existe un servicio llamado ' + existing.name, 'error')
          return
        }
      }
      updateService.mutate(
        {
          originalName,
          name: name.trim(),
          description: description.trim(),
          price,
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
    if (existingImages.length + newImageFiles.length < 1) {
      showAlert('Error', 'Debe seleccionar una o más imagenes', 'error')
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
        <h2>Editar Servicio</h2>
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
            <input type="number" className="form-control" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
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
              <input type="file" multiple accept="image/*" className="form-control" id="editSvcFiles" onChange={handleFiles} />
              <label className="input-group-text" htmlFor="editSvcFiles">
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
