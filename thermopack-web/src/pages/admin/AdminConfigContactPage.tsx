import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getContactData, updateContactData, updateContactImages } from '../../api/contact'
import { ConfigGallery } from '../../components/ConfigGallery'
import { useAuth } from '../../auth/AuthContext'
import { showAlert, showConfirmationAlert } from '../../lib/sweetAlert'

export function AdminConfigContactPage() {
  const navigate = useNavigate()
  const { isLoggedIn, userLoggedIn } = useAuth()

  const [welcomeParagraph, setWelcome] = useState('')
  const [ubicationText, setUbicationText] = useState('')
  const [ubicationGMLink, setGm] = useState('')
  const [ubicationWazeLink, setWaze] = useState('')
  const [telephoneNumbers, setPhones] = useState<string[]>([])
  const [email, setEmail] = useState('')
  const [whatsappLink, setWhatsapp] = useState('')
  const [facebookLink, setFacebook] = useState('')
  const [instagramLink, setInstagram] = useState('')
  const [youtubeLink, setYoutube] = useState('')
  const [images, setImages] = useState<string[]>(['', '', '', ''])

  const [welcomeParagraphPast, setWelcomePast] = useState('')
  const [ubicationTextPast, setUbicationTextPast] = useState('')
  const [ubicationGMLinkPast, setGmPast] = useState('')
  const [ubicationWazeLinkPast, setWazePast] = useState('')
  const [telephoneNumbersPast, setPhonesPast] = useState<string[]>([])
  const [emailPast, setEmailPast] = useState('')
  const [whatsappLinkPast, setWhatsappPast] = useState('')
  const [facebookLinkPast, setFacebookPast] = useState('')
  const [instagramLinkPast, setInstagramPast] = useState('')
  const [youtubeLinkPast, setYoutubePast] = useState('')
  const [imagesPast, setImagesPast] = useState<string[]>([])

  const [newNumber, setNewNumber] = useState('')
  const [validNumber, setValidNumber] = useState(true)
  const [validWhatsapp, setValidWhatsapp] = useState(true)
  const [emailValid, setEmailValid] = useState(true)

  useEffect(() => {
    if (!isLoggedIn) navigate('/login')
  }, [isLoggedIn, navigate])

  useEffect(() => {
    void getContactData().then((c) => {
      if (!c[0]) return
      const x = c[0]
      setWelcome(x.welcomeParagraph)
      setUbicationText(x.ubicationText)
      setGm(x.ubicationGMLink)
      setWaze(x.ubicationWazeLink)
      setPhones([...x.telephoneNumbers])
      setEmail(x.email)
      setWhatsapp(x.whatsappLink)
      setFacebook(x.facebookLink)
      setInstagram(x.instagramLink)
      setYoutube(x.youtubeLink)
      setImages([...(x.images ?? [])])
      setWelcomePast(x.welcomeParagraph)
      setUbicationTextPast(x.ubicationText)
      setGmPast(x.ubicationGMLink)
      setWazePast(x.ubicationWazeLink)
      setPhonesPast([...x.telephoneNumbers])
      setEmailPast(x.email)
      setWhatsappPast(x.whatsappLink)
      setFacebookPast(x.facebookLink)
      setInstagramPast(x.instagramLink)
      setYoutubePast(x.youtubeLink)
      setImagesPast([...(x.images ?? [])])
    })
  }, [])

  const validatePhoneNumber = (phoneNumber: string): boolean => {
    if (phoneNumber.length !== 11) return false
    if (!phoneNumber.startsWith('506')) return false
    return /^\d+$/.test(phoneNumber.substring(3))
  }

  const validateNumber = () => {
    setValidNumber(newNumber.trim() === '' || validatePhoneNumber(newNumber))
  }

  const validateWhatsApp = () => {
    setValidWhatsapp(validatePhoneNumber(whatsappLink))
  }

  const validateEmailField = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    setEmailValid(emailRegex.test(email))
  }

  const addNumber = () => {
    const ok = validatePhoneNumber(newNumber)
    setValidNumber(ok)
    if (ok) {
      setPhones((prev) => {
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
  }

  const deleteNumber = (index: number) => {
    setPhones((prev) => prev.filter((_, i) => i !== index))
  }

  const hasChangedHome = () =>
    welcomeParagraph !== welcomeParagraphPast ||
    ubicationText !== ubicationTextPast ||
    ubicationGMLink !== ubicationGMLinkPast ||
    ubicationWazeLink !== ubicationWazeLinkPast ||
    JSON.stringify(telephoneNumbers) !== JSON.stringify(telephoneNumbersPast) ||
    email !== emailPast ||
    whatsappLink !== whatsappLinkPast ||
    facebookLink !== facebookLinkPast ||
    instagramLink !== instagramLinkPast ||
    youtubeLink !== youtubeLinkPast

  const save = () => {
    if (
      !welcomeParagraph ||
      welcomeParagraph.trim().length < 5 ||
      !ubicationText ||
      ubicationText.trim().length < 5 ||
      !ubicationGMLink ||
      ubicationGMLink.trim().length < 5 ||
      !email ||
      email.trim().length < 5 ||
      !whatsappLink ||
      whatsappLink.trim().length < 11 ||
      !facebookLink ||
      facebookLink.trim().length < 5 ||
      !instagramLink ||
      instagramLink.trim().length < 5 ||
      !youtubeLink ||
      youtubeLink.trim().length < 5
    ) {
      showAlert('Error', 'Todos los campos son obligatorios', 'error')
      return
    }
    if (!hasChangedHome()) {
      showAlert('Información', 'No se realizó ningún cambio, no hay nada que guardar', 'info')
      return
    }
    showConfirmationAlert('Confirmación', '¿Está seguro que desea realizar cambios?', () => {
      void updateContactData(
        welcomeParagraph,
        ubicationText,
        ubicationGMLink,
        ubicationWazeLink,
        telephoneNumbers,
        email,
        whatsappLink,
        facebookLink,
        instagramLink,
        youtubeLink
      ).then(() => showAlert('Éxito', 'Los datos se han guardado correctamente', 'success'))
    })
  }

  const arraysAreEqual = (): boolean => {
    let flag = 0
    for (let i = 0; i < imagesPast.length; i++) {
      if (imagesPast[i] !== images[i]) flag = 1
    }
    if (flag === 0) {
      showAlert('Información', 'No se realizó ningún cambio, no hay nada que guardar', 'info')
      return false
    }
    for (let i = 0; i < images.length; i++) {
      if (images[i] === '') {
        showAlert('Error', 'Todos las imagenes son obligatorias', 'error')
        return false
      }
    }
    return true
  }

  const saveImages = () => {
    if (!arraysAreEqual()) return
    void updateContactImages(images).then(() => showAlert('Éxito', 'Los datos se han guardado correctamente', 'success'))
  }

  const canEdit = userLoggedIn?.privileges?.[1] === 1

  return (
    <div className="container">
      <div className="col-md-12 mt-4">
        <h2>Página de Contacto</h2>
        <hr />
        <div className="row mb-3">
          <div className="col-md-3">Párrafo de bienvenida</div>
          <div className="col-md-6">
            <textarea className="form-control" value={welcomeParagraph} onChange={(e) => setWelcome(e.target.value)} />
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
            <input type="text" className="form-control" value={ubicationGMLink} onChange={(e) => setGm(e.target.value)} />
            {ubicationGMLink.trim().length < 5 && <div className="text-danger">Debe tener más de 5 caracteres</div>}
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-3">Enlace de Waze</div>
          <div className="col-md-6">
            <input type="text" className="form-control" value={ubicationWazeLink} onChange={(e) => setWaze(e.target.value)} />
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
                validateNumber()
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
                validateEmailField()
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
                setWhatsapp(e.target.value)
                validateWhatsApp()
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
            <input type="text" className="form-control" value={facebookLink} onChange={(e) => setFacebook(e.target.value)} />
            {facebookLink.trim().length < 5 && <div className="text-danger">Debe tener más de 5 caracteres</div>}
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-3">Enlace de Instagram</div>
          <div className="col-md-6">
            <input type="text" className="form-control" value={instagramLink} onChange={(e) => setInstagram(e.target.value)} />
            {instagramLink.trim().length < 5 && <div className="text-danger">Debe tener más de 5 caracteres</div>}
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-3">Enlace de Youtube</div>
          <div className="col-md-6">
            <input type="text" className="form-control" value={youtubeLink} onChange={(e) => setYoutube(e.target.value)} />
            {youtubeLink.trim().length < 5 && <div className="text-danger">Debe tener más de 5 caracteres</div>}
          </div>
        </div>
        {canEdit && (
          <button type="button" className="btn btn-success mb-4" onClick={save}>
            Guardar datos
          </button>
        )}

        <h3>Imágenes de contacto</h3>
        <ConfigGallery images={images} identifier="c" onImagesChange={(imgs) => setImages(imgs)} />
        {canEdit && (
          <button type="button" className="btn btn-success" onClick={saveImages}>
            Guardar imágenes
          </button>
        )}
      </div>
    </div>
  )
}
