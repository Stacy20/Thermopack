import { useParams } from 'react-router-dom'
import { useContact } from '../hooks/useContact'
import { useProductByName } from '../hooks/useProducts'
import { useServiceByName } from '../hooks/useServices'
import { GalleryLightbox } from '../components/GalleryLightbox'
import { formatColon, formatDescription } from '../utils/text'

export function DetailPage() {
  const { type, id } = useParams<{ type: string; id: string }>()
  const typeNum = parseInt(type ?? '1', 10)
  const name = id ? decodeURIComponent(id) : ''

  const { data: contactList } = useContact()
  const { data: product } = useProductByName(typeNum === 1 ? name : '')
  const { data: service } = useServiceByName(typeNum !== 1 ? name : '')

  const item = typeNum === 1 ? product : service
  const title = item?.name ?? 'Producto/Servicio'
  const description = item?.description ?? ''
  const price = item?.price ?? 0
  const images = item?.images ?? []

  const contact = contactList?.[0]
  const currentPageUrl = window.location.href
  const whatsappLink = contact
    ? `https://wa.me/${contact.whatsappLink}?text=${encodeURIComponent('Estoy interesado en lo siguiente:\n\n' + currentPageUrl)}`
    : ''

  return (
    <div className="container py-4">
      <h1>{title}</h1>
      <p className="lead">{formatColon(price)}</p>
      <div dangerouslySetInnerHTML={{ __html: formatDescription(description) }} />
      <div className="mt-4">
        <GalleryLightbox images={images} />
      </div>
      {whatsappLink && (
        <button type="button" className="btn btn-success mt-3" onClick={() => window.open(whatsappLink, '_blank')}>
          Consultar por WhatsApp
        </button>
      )}
    </div>
  )
}
