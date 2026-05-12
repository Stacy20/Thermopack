import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useContact, useUpdateContact, useUpdateContactImages } from '../../hooks/useContact'
import { ConfigGallery, type GallerySlot } from '../../components/ConfigGallery'
import { useAuth } from '../../auth/AuthContext'
import { showAlert, showConfirmationAlert } from '../../lib/sweetAlert'

export function AdminConfigContactPage() {
  const navigate = useNavigate()
  const { isLoggedIn, userLoggedIn } = useAuth()
  const canEdit = userLoggedIn?.privileges?.[1] === 1
  const { data: contactList } = useContact()
  const updateContact = useUpdateContact()
  const updateContactImages = useUpdateContactImages()

  const [welcomeParagraph, setWelcomeParagraph] = useState('')
  const [ubicationText, setUbicationText] = useState('')
  const [ubicationGMLink, setUbicationGMLink] = useState('')
  const [ubicationWazeLink, setUbicationWazeLink] = useState('')
  const [telephoneNumbers, setTelephoneNumbers] = useState<string[]>([])
  const [email, setEmail] = useState('')
  const [whatsappLink, setWhatsappLink] = useState('')
  const [facebookLink, setFacebookLink] = useState('')
  const [instagramLink, setInstagramLink] = useState('')
  const [youtubeLink, setYoutubeLink] = useState('')
  const [imageSlots, setImageSlots] = useState<GallerySlot[]>([])

  const [savedWelcomeParagraph, setSavedWelcomeParagraph] = useState('')
  const [savedUbicationText, setSavedUbicationText] = useState('')
  const [savedUbicationGMLink, setSavedUbicationGMLink] = useState('')
  const [savedUbicationWazeLink, setSavedUbicationWazeLink] = useState('')
  const [savedTelephoneNumbers, setSavedTelephoneNumbers] = useState<string[]>([])
  const [savedEmail, setSavedEmail] = useState('')
  const [savedWhatsappLink, setSavedWhatsappLink] = useState('')
  const [savedFacebookLink, setSavedFacebookLink] = useState('')
  const [savedInstagramLink, setSavedInstagramLink] = useState('')
  const [savedYoutubeLink, setSavedYoutubeLink] = useState('')

  const [newNumber, setNewNumber] = useState('')
  const [validNumber, setValidNumber] = useState(true)
  const [validWhatsapp, setValidWhatsapp] = useState(true)
  const [emailValid, setEmailValid] = useState(true)

  useEffect(() => {
    if (!isLoggedIn) navigate('/login')
  }, [isLoggedIn, navigate])

  useEffect(() => {

    if (!contactList) return
    setWelcomeParagraph(contactList.welcomeParagraph)
    setSavedWelcomeParagraph(contactList.welcomeParagraph)
    setUbicationText(contactList.ubicationText)
    setSavedUbicationText(contactList.ubicationText)
    setUbicationGMLink(contactList.ubicationGMLink)
    setSavedUbicationGMLink(contactList.ubicationGMLink)
    setUbicationWazeLink(contactList.ubicationWazeLink)
    setSavedUbicationWazeLink(contactList.ubicationWazeLink)
    setTelephoneNumbers([...contactList.telephoneNumbers])
    setSavedTelephoneNumbers([...contactList.telephoneNumbers])
    setEmail(contactList.email)
    setSavedEmail(contactList.email)
    setWhatsappLink(contactList.whatsappLink)
    setSavedWhatsappLink(contactList.whatsappLink)
    setFacebookLink(contactList.facebookLink)
    setSavedFacebookLink(contactList.facebookLink)
    setInstagramLink(contactList.instagramLink)
    setSavedInstagramLink(contactList.instagramLink)
    setYoutubeLink(contactList.youtubeLink)
    setSavedYoutubeLink(contactList.youtubeLink)
    setImageSlots((contactList.images ?? []).map((url): GallerySlot => ({ kind: 'existing', url })))
  }, [contactList])

  const validatePhoneNumber = (phone: string): boolean =>
    phone.length === 11 && phone.startsWith('506') && /^\d+$/.test(phone.substring(3))

  const addNumber = () => {
    const ok = validatePhoneNumber(newNumber)
    setValidNumber(ok)
    if (!ok) return
    setTelephoneNumbers((prev) => {
      const next = [...prev]
      if (next.length < 3) next.push(newNumber)
      else {
        next[2] = next[1]
        next[1] = next[0]
        next[0] = newNumber
      }
      return next
    })
    setNewNumber('')
  }

  const deleteNumber = (index: number) => {
    setTelephoneNumbers((prev) => prev.filter((_, i) => i !== index))
  }

  const hasChangedContact = () =>
    welcomeParagraph !== savedWelcomeParagraph ||
    ubicationText !== savedUbicationText ||
    ubicationGMLink !== savedUbicationGMLink ||
    ubicationWazeLink !== savedUbicationWazeLink ||
    JSON.stringify(telephoneNumbers) !== JSON.stringify(savedTelephoneNumbers) ||
    email !== savedEmail ||
    whatsappLink !== savedWhatsappLink ||
    facebookLink !== savedFacebookLink ||
    instagramLink !== savedInstagramLink ||
    youtubeLink !== savedYoutubeLink

  const saveContact = () => {
    if (
      welcomeParagraph.trim().length < 5 ||
      ubicationText.trim().length < 5 ||
      ubicationGMLink.trim().length < 5 ||
      email.trim().length < 5 ||
      whatsappLink.trim().length < 11 ||
      facebookLink.trim().length < 5 ||
      instagramLink.trim().length < 5 ||
      youtubeLink.trim().length < 5
    ) {
      showAlert('Error', 'Todos los campos son obligatorios', 'error')
      return
    }
    if (!hasChangedContact()) {
      showAlert('Información', 'No se realizó ningún cambio, no hay nada que guardar', 'info')
      return
    }
    showConfirmationAlert('Confirmación', '¿Está seguro que desea realizar cambios?', () => {
      updateContact.mutate(
        {
          welcomeParagraph,
          ubicationText,
          ubicationGMLink,
          ubicationWazeLink,
          telephoneNumbers,
          email,
          whatsappLink,
          facebookLink,
          instagramLink,
          youtubeLink,
        },
        { onSuccess: () => showAlert('Éxito', 'Los datos se han guardado correctamente', 'success') }
      )
    })
  }

  const saveImages = () => {
    const savedUrls = (contactList?.[0]?.images ?? [])
    const currentUrls = imageSlots.map((s) => (s.kind === 'existing' ? s.url : s.kind === 'new' ? s.preview : ''))
    const changed = JSON.stringify(savedUrls) !== JSON.stringify(currentUrls)
    if (!changed) {
      showAlert('Información', 'No se realizó ningún cambio, no hay nada que guardar', 'info')
      return
    }
    if (imageSlots.some((s) => s.kind === 'empty')) {
      showAlert('Error', 'Todos las imagenes son obligatorias', 'error')
      return
    }
    const existingImages = imageSlots
      .filter((s) => s.kind === 'existing')
      .map((s) => (s as { kind: 'existing'; url: string }).url)
    const newImages = imageSlots
      .filter((s) => s.kind === 'new')
      .map((s) => (s as { kind: 'new'; file: File; preview: string }).file)
    updateContactImages.mutate(
      { newImages, existingImages },
      { onSuccess: () => showAlert('Éxito', 'Los datos se han guardado correctamente', 'success') }
    )
  }

  return (
    <div className="container">
      <div className="col-md-12 mt-4">
        <h2>Página de Contacto</h2>
        <hr />
        <div className="row mb-3">
          <div className="col-md-3">Párrafo de bienvenida</div>
          <div className="col-md-6">
            <textarea className="form-control" value={welcomeParagraph} onChange={(e) => setWelcomeParagraph(e.target.value)} />
            {welcomeParagraph.trim().length < 5 && <div className="text-danger">Debe tener más de 5 caracteres</div>}
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-3">Texto de la ubicación</div>
          <div className="col-md-6">
            <textarea className="form-control" value={ubicationText} onChange={(e) => setUbicationText(e.target.value)} />
            {ubicationText.trim().length < 5 && <div className="text-danger">Debe tener más de 5 caracteres</div>}
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-3">Enlace de Google Maps</div>
          <div className="col-md-6">
            <input type="text" className="form-control" value={ubicationGMLink} onChange={(e) => setUbicationGMLink(e.target.value)} />
            {ubicationGMLink.trim().length < 5 && <div className="text-danger">Debe tener más de 5 caracteres</div>}
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-3">Enlace de Waze</div>
          <div className="col-md-6">
            <input type="text" className="form-control" value={ubicationWazeLink} onChange={(e) => setUbicationWazeLink(e.target.value)} />
            {ubicationWazeLink.trim().length < 5 && <div className="text-danger">Debe tener más de 5 caracteres</div>}
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-3">Números de teléfono</div>
          <div className="col-md-6 d-flex align-items-center flex-wrap">
            <input
              type="text"
              className="form-control w-50"
              value={newNumber}
              onChange={(e) => {
                setNewNumber(e.target.value)
                setValidNumber(e.target.value.trim() === '' || validatePhoneNumber(e.target.value))
              }}
            />
            <button type="button" className="btn btn-outline-secondary ms-2" onClick={addNumber}>
              +
            </button>
            {!validNumber && newNumber.trim().length > 0 && (
              <div className="text-danger ms-2 w-100">
                Debe empezar con el código 506, no debe contener nigún carácter alfabético y tener una longitud total de 11 números.
              </div>
            )}
          </div>
        </div>
        <div className="row mb-3 justify-content-center">
          <div className="col-md-6">
            {telephoneNumbers.map((number, index) => (
              <ul key={index} className="d-flex mb-0 list-unstyled">
                <li className="me-3">{number}</li>
                <button type="button" className="btn btn-link" onClick={() => deleteNumber(index)}>
                  <i className="fas fa-trash-alt" />
                </button>
              </ul>
            ))}
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-3">Correo electrónico</div>
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setEmailValid(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(e.target.value))
              }}
            />
            {(!emailValid || email.trim().length === 0) && <div className="text-danger">Por favor, ingrese un correo electrónico válido.</div>}
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-3">Número de Whatsapp</div>
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              value={whatsappLink}
              onChange={(e) => {
                setWhatsappLink(e.target.value)
                setValidWhatsapp(validatePhoneNumber(e.target.value))
              }}
            />
            {(!validWhatsapp || whatsappLink.trim().length === 0) && (
              <div className="text-danger">
                Debe empezar con el código 506, no debe contener nigún carácter alfabético y tener una longitud total de 11 números.
              </div>
            )}
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-3">Enlace de Facebook</div>
          <div className="col-md-6">
            <input type="text" className="form-control" value={facebookLink} onChange={(e) => setFacebookLink(e.target.value)} />
            {facebookLink.trim().length < 5 && <div className="text-danger">Debe tener más de 5 caracteres</div>}
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-3">Enlace de Instagram</div>
          <div className="col-md-6">
            <input type="text" className="form-control" value={instagramLink} onChange={(e) => setInstagramLink(e.target.value)} />
            {instagramLink.trim().length < 5 && <div className="text-danger">Debe tener más de 5 caracteres</div>}
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-3">Enlace de Youtube</div>
          <div className="col-md-6">
            <input type="text" className="form-control" value={youtubeLink} onChange={(e) => setYoutubeLink(e.target.value)} />
            {youtubeLink.trim().length < 5 && <div className="text-danger">Debe tener más de 5 caracteres</div>}
          </div>
        </div>
        {canEdit && (
          <button type="button" className="btn btn-success mb-4" onClick={saveContact}>
            Guardar datos
          </button>
        )}

        <h3>Imágenes de contacto</h3>
        <ConfigGallery slots={imageSlots} identifier="c" onSlotsChange={(s) => setImageSlots(s)} />
        {canEdit && (
          <button type="button" className="btn btn-success" onClick={saveImages}>
            Guardar imágenes
          </button>
        )}
      </div>
    </div>
  )
}
