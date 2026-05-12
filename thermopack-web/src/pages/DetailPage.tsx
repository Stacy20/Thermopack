import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getContactData } from '../api/contact'
import { getProductByName } from '../api/products'
import { getServiceByName } from '../api/servicesApi'
import { GalleryLightbox } from '../components/GalleryLightbox'
import { formatColon, formatDescription } from '../utils/text'

export function DetailPage() {
  const { type, id } = useParams<{ type: string; id: string }>()
  const typeNum = parseInt(type ?? '1', 10)
  const name = id ? decodeURIComponent(id) : ''

  const [title, setTitle] = useState('Producto/Servicio')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState(0)
  const [images, setImages] = useState<string[]>([])
  const [whatsappLink, setWhatsapp] = useState('')

  useEffect(() => {
    void getContactData().then((contact) => {
      if (!contact[0]) return
      const currentPageUrl = window.location.href
      setWhatsapp(
        `https://wa.me/${contact[0].whatsappLink}?text=${encodeURIComponent('Estoy interesado en lo siguiente:\n\n' + currentPageUrl)}`
      )
    })
  }, [])

  useEffect(() => {
    if (!name) return
    if (typeNum === 1) {
      void getProductByName(name).then((product) => {
        if (!product.name) return
        setTitle(product.name)
        setDescription(product.description)
        setPrice(product.price)
        setImages(product.images ?? [])
      })
    } else {
      void getServiceByName(name).then((service) => {
        if (!service.name) return
        setTitle(service.name)
        setDescription(service.description)
        setPrice(service.price)
        setImages(service.images ?? [])
      })
    }
  }, [name, typeNum])

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
