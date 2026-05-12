import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getServiceByName, updateServiceByName } from '../../api/servicesApi'
import { useAuth } from '../../auth/AuthContext'
import { showAlert, showConfirmationAlert } from '../../lib/sweetAlert'

export function EditServicePage() {
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
  const [imagesPast, setImagesPast] = useState<string[]>([])

  useEffect(() => {
    if (!isLoggedIn) navigate('/login')
    void userCanEdit().then((ok) => {
      if (!ok) navigate('/admin/config/home')
    })
  }, [isLoggedIn, navigate, userCanEdit])

  useEffect(() => {
    const title = id ? decodeURIComponent(id) : ''
    if (!title) return
    void getServiceByName(title).then((service) => {
      if (!service.name) return
      setOriginalName(service.name)
      setName(service.name)
      setDescription(service.description)
      setDescriptionPast(service.description)
      setPrice(service.price)
      setPricePast(service.price)
      setImages([...service.images])
      setImagesPast([...service.images])
    })
  }, [id])

  const hasChanged = () =>
    name !== originalName || description !== descriptionPast || price !== pricePast || JSON.stringify(images) !== JSON.stringify(imagesPast)

  const doUpdate = () => {
    void getServiceByName(name).then((service) => {
      if (name !== originalName && service.name && Object.keys(service).length !== 0) {
        showAlert('Error', 'Ya existe un servicio llamado' + service.name, 'error')
        return
      }
      void updateServiceByName(originalName, name.trim(), description.trim(), price, images).then(() => {
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
          <div className="col-md-3">Imágenes</div>
          <div className="col-md-6">
            <div className="input-group mb-3">
              <input type="file" multiple accept="image/*" className="form-control" id="editSvcFiles" onChange={handleFiles} />
              <label className="input-group-text" htmlFor="editSvcFiles">
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
