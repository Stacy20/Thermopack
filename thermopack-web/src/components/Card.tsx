import { useAuth } from '../auth/AuthContext'
import { useNavigate } from 'react-router-dom'
import { showAlert, showConfirmationAlert } from '../lib/sweetAlert'
import { deleteProductByName } from '../api/products'
import { deleteServiceByName } from '../api/servicesApi'
import { useQueryClient } from '@tanstack/react-query'

type Props = {
  title: string
  id: string
  src: string
  text: string
  type: number
  permissions: number
}

export function Card({ title, id, src, text, type, permissions }: Props) {
  const navigate = useNavigate()
  const { userLoggedIn } = useAuth()
  const qc = useQueryClient()

  const gotoVerMas = () => {
    navigate(`/detalles/${type}/${encodeURIComponent(title)}`)
  }

  const gotoEditProduct = () => {
    if (type === 1) navigate(`/admin/products/edit/${encodeURIComponent(title)}`)
    if (type === 2) navigate(`/admin/services/edit/${encodeURIComponent(title)}`)
  }

  const deleteItem = () => {
    const isProduct = type === 1
    showConfirmationAlert(
      'Confirmación',
      isProduct ? '¿Está seguro que desea eliminar el producto?' : '¿Está seguro que desea eliminar el servicio?',
      () => {
        const p = isProduct
          ? deleteProductByName(title)
          : deleteServiceByName(title)
        void p.then(() => {
          void showAlert('Éxito', isProduct ? 'El producto se ha eliminado correctamente' : 'El servicio se ha eliminado correctamente', 'success')
          void qc.invalidateQueries()
          window.location.reload()
        })
      }
    )
  }

  const canEdit = userLoggedIn?.privileges?.[1] === 1
  const canDel = userLoggedIn?.privileges?.[2] === 1

  return (
    <div className="card">
      <div className="d-flex justify-content-center">
        <div className="centrar-img">
          <img src={src || ''} className="card-img-top" alt="" />
        </div>
      </div>
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{text}</p>
        {permissions === 0 ? (
          <div>
            <button type="button" className="btn btn-link p-0 float-end" onClick={gotoVerMas}>
              Ver más
            </button>
            <span className="small text-muted">{id}</span>
          </div>
        ) : (
          <div className="d-flex justify-content-between">
            {canEdit && (
              <button type="button" className="btn mt-4" style={{ backgroundColor: '#37C132', color: '#ffff' }} onClick={gotoEditProduct}>
                Editar
              </button>
            )}
            {canDel && (
              <button type="button" className="btn mt-4" style={{ backgroundColor: '#CE0303', color: '#ffff' }} onClick={deleteItem}>
                Eliminar
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
