import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createService, getServiceByName } from '../../api/servicesApi'
import { useAuth } from '../../auth/AuthContext'
import { showAlert } from '../../lib/sweetAlert'

export function AddServicePage() {
  const navigate = useNavigate()
  const { isLoggedIn, userCanAdd } = useAuth()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState(0)
  const [images, setImages] = useState<string[]>([])

  useEffect(() => {
    if (!isLoggedIn) navigate('/login')
    void userCanAdd().then((ok) => {
      if (!ok) navigate('/admin/config/home')
    })
  }, [isLoggedIn, navigate, userCanAdd])

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader()
      reader.onload = () => setImages((prev) => [...prev, String(reader.result ?? '')])
      reader.readAsDataURL(files[i])
    }
  }

  const insert = () => {
    if (!name || name.trim().length < 3 || !description || description.trim().length < 5) {
      showAlert('Error', 'Todos los campos son obligatorios', 'error')
      return
    }
    if (images.filter(Boolean).length < 1) {
      showAlert('Error', 'Debe seleccionar una o más imagenes', 'error')
      return
    }
    void getServiceByName(name).then((service) => {
      if (name !== service.name && service.name && Object.keys(service).length !== 0) {
        showAlert('Error', 'Ya existe un servicio llamado' + service.name, 'error')
        return
      }
      void createService(name, description, price, images).then(() => {
        showAlert('Éxito', 'Los datos se han guardado correctamente', 'success')
      })
    })
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
        <button type="button" className="btn btn-success" onClick={insert}>
          Guardar
        </button>
      </div>
    </div>
  )
}
