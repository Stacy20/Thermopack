import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useContact, useUpdateContact, useUpdateContactImages } from '../../hooks/useContact'
import { ConfigGallery, type GallerySlot } from '../../components/ConfigGallery'
import { CONTACT_PAGE_IMAGE_SLOT_COUNT, CONTACT_PAGE_IMAGE_SLOT_LABELS } from '../../constants/adminConfigGallery'
import { gallerySlotsDirtyAgainstUrls, padUrlList, urlsToGallerySlots } from '../../lib/gallerySlots'
import { useAuth } from '../../auth/AuthContext'
import { showAlert, showConfirmationAlert } from '../../lib/sweetAlert'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Separator } from '../../components/ui/separator'

function ContactConfigFormRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-3 mb-5 items-start">
      <Label className="md:text-right pt-2 text-muted-foreground">{label}</Label>
      <div>{children}</div>
    </div>
  )
}

export function AdminConfigContactPage() {
  const navigate = useNavigate()
  const { isLoggedIn, userLoggedIn, authReady } = useAuth()
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
  const [imageSlots, setImageSlots] = useState<GallerySlot[]>(() =>
    urlsToGallerySlots(undefined, CONTACT_PAGE_IMAGE_SLOT_COUNT)
  )

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
    if (!authReady) return
    if (!isLoggedIn) navigate('/login')
  }, [authReady, isLoggedIn, navigate])

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
    setImageSlots(urlsToGallerySlots(contactList.images, CONTACT_PAGE_IMAGE_SLOT_COUNT))
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
    const baseline = padUrlList(contactList?.images, CONTACT_PAGE_IMAGE_SLOT_COUNT)
    if (!gallerySlotsDirtyAgainstUrls(imageSlots, baseline)) {
      showAlert('Información', 'No se realizó ningún cambio, no hay nada que guardar', 'info')
      return
    }
    if (imageSlots.some((s) => s.kind === 'empty')) {
      showAlert('Error', 'Todas las imágenes son obligatorias', 'error')
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

  const phoneHint = 'Debe empezar con el código 506, sin caracteres alfabéticos, longitud total de 11 dígitos.'

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold text-foreground mb-2">Página de Contacto</h2>
      <Separator className="mb-6" />

      <ContactConfigFormRow label="Párrafo de bienvenida">
        <Textarea rows={3} value={welcomeParagraph} onChange={(e) => setWelcomeParagraph(e.target.value)} />
        {welcomeParagraph.trim().length < 5 && <p className="text-destructive text-xs mt-1">Mínimo 5 caracteres</p>}
      </ContactConfigFormRow>
      <ContactConfigFormRow label="Texto de ubicación">
        <Textarea rows={3} value={ubicationText} onChange={(e) => setUbicationText(e.target.value)} />
        {ubicationText.trim().length < 5 && <p className="text-destructive text-xs mt-1">Mínimo 5 caracteres</p>}
      </ContactConfigFormRow>
      <ContactConfigFormRow label="Enlace Google Maps">
        <Input value={ubicationGMLink} onChange={(e) => setUbicationGMLink(e.target.value)} />
        {ubicationGMLink.trim().length < 5 && <p className="text-destructive text-xs mt-1">Mínimo 5 caracteres</p>}
      </ContactConfigFormRow>
      <ContactConfigFormRow label="Enlace Waze">
        <Input value={ubicationWazeLink} onChange={(e) => setUbicationWazeLink(e.target.value)} />
      </ContactConfigFormRow>

      <ContactConfigFormRow label="Teléfonos">
        <div>
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="506XXXXXXXX"
              value={newNumber}
              onChange={(e) => { setNewNumber(e.target.value); setValidNumber(e.target.value.trim() === '' || validatePhoneNumber(e.target.value)) }}
            />
            <Button variant="outline" onClick={addNumber}>+</Button>
          </div>
          {!validNumber && newNumber.trim().length > 0 && <p className="text-destructive text-xs mt-1">{phoneHint}</p>}
          <ul className="flex flex-col gap-1 mt-2">
            {telephoneNumbers.map((number, index) => (
              <li key={index} className="flex items-center gap-3 text-sm">
                <span className="text-foreground">{number}</span>
                <button type="button" onClick={() => deleteNumber(index)} className="text-destructive text-xs border-none bg-transparent cursor-pointer underline">Eliminar</button>
              </li>
            ))}
          </ul>
        </div>
      </ContactConfigFormRow>

      <ContactConfigFormRow label="Correo electrónico">
        <Input value={email} onChange={(e) => { setEmail(e.target.value); setEmailValid(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(e.target.value)) }} />
        {(!emailValid || email.trim().length === 0) && <p className="text-destructive text-xs mt-1">Correo inválido</p>}
      </ContactConfigFormRow>
      <ContactConfigFormRow label="Número de WhatsApp">
        <Input placeholder="506XXXXXXXX" value={whatsappLink} onChange={(e) => { setWhatsappLink(e.target.value); setValidWhatsapp(validatePhoneNumber(e.target.value)) }} />
        {(!validWhatsapp || whatsappLink.trim().length === 0) && <p className="text-destructive text-xs mt-1">{phoneHint}</p>}
      </ContactConfigFormRow>
      <ContactConfigFormRow label="Enlace de Facebook">
        <Input value={facebookLink} onChange={(e) => setFacebookLink(e.target.value)} />
        {facebookLink.trim().length < 5 && <p className="text-destructive text-xs mt-1">Mínimo 5 caracteres</p>}
      </ContactConfigFormRow>
      <ContactConfigFormRow label="Enlace de Instagram">
        <Input value={instagramLink} onChange={(e) => setInstagramLink(e.target.value)} />
        {instagramLink.trim().length < 5 && <p className="text-destructive text-xs mt-1">Mínimo 5 caracteres</p>}
      </ContactConfigFormRow>
      <ContactConfigFormRow label="Enlace de YouTube">
        <Input value={youtubeLink} onChange={(e) => setYoutubeLink(e.target.value)} />
        {youtubeLink.trim().length < 5 && <p className="text-destructive text-xs mt-1">Mínimo 5 caracteres</p>}
      </ContactConfigFormRow>

      {canEdit && <Button className="mt-2 mb-10 bg-green-600 hover:bg-green-700 text-white" onClick={saveContact}>Guardar datos</Button>}

      <ConfigGallery
        title="Imágenes de contacto"
        description="Cada ranura corresponde a una imagen en la página de contacto. Use Subir para elegir archivo desde su equipo."
        className="mt-4"
        slots={imageSlots}
        identifier="c"
        slotLabels={CONTACT_PAGE_IMAGE_SLOT_LABELS}
        onSlotsChange={setImageSlots}
      />
      {canEdit && <Button className="mt-4 mb-8 bg-green-600 hover:bg-green-700 text-white" onClick={saveImages}>Guardar imágenes</Button>}
    </div>
  )
}
