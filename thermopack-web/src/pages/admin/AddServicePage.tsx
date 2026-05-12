import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateService } from '../../hooks/useServices'
import apiClient from '../../api/client'
import { useAuth } from '../../auth/AuthContext'
import { showAlert } from '../../lib/sweetAlert'
import type { Services } from '../../types/services'

export function AddServicePage() {
  const navigate = useNavigate()
  const { isLoggedIn, userCanAdd } = useAuth()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState(0)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  const createService = useCreateService()

  useEffect(() => {
    if (!isLoggedIn) navigate('/login')
    void userCanAdd().then((ok) => {
      if (!ok) navigate('/admin/config/home')
    })
  }, [isLoggedIn, navigate, userCanAdd])

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

  const insert = async () => {
    if (name.trim().length < 3 || description.trim().length < 5) {
      showAlert('Error', 'Todos los campos son obligatorios', 'error')
      return
    }
    if (imageFiles.length < 1) {
      showAlert('Error', 'Debe seleccionar una o más imagenes', 'error')
      return
    }
    try {
      const existing = await apiClient
        .get<Services>(`services/${encodeURIComponent(name.trim())}`)
        .then((r) => r.data)
        .catch(() => null)
      if (existing?.name) {
        showAlert('Error', 'Ya existe un servicio llamado ' + existing.name, 'error')
        return
      }
      createService.mutate(
        { name: name.trim(), description: description.trim(), price, newImages: imageFiles },
        { onSuccess: () => showAlert('Éxito', 'Los datos se han guardado correctamente', 'success') }
      )
    } catch {
      showAlert('Error', 'Ocurrió un error al guardar', 'error')
    }
  }

  return (
    <div className="container">
      <div className="col-md-12 mt-4">
        <h2>Agregar Servicio</h2>
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
          <div className="col-md-3">Imágenes</div>
          <div className="col-md-6">
            <div className="input-group mb-3">
              <input type="file" multiple accept="image/*" className="form-control" id="addSvcFiles" onChange={handleFiles} />
              <label className="input-group-text" htmlFor="addSvcFiles">
                Seleccionar archivo
              </label>
            </div>
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
        <button type="button" className="btn btn-success" onClick={() => void insert()}>
          Guardar
        </button>
      </div>
    </div>
  )
}
