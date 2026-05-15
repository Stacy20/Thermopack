import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData, useUpdateMainPage, useUpdateVisionImages, useUpdatePresentationImages, useUpdateProductsServices } from '../../hooks/useData'
import type { ServicesPageConfig } from '../../types/data'
import { mergeServicesPageConfig } from '../../lib/mergeServicesPage'
import { ConfigGallery, type GallerySlot } from '../../components/ConfigGallery'
import {
  HOME_PRESENTATION_IMAGE_SLOT_COUNT,
  HOME_PRESENTATION_IMAGE_SLOT_LABELS,
  HOME_VISION_IMAGE_SLOT_COUNT,
  HOME_VISION_MISSION_SLOT_LABELS,
  HOME_VISION_VISION_SLOT_LABELS,
} from '../../constants/adminConfigGallery'
import {
  SERVICE_CARD_GRADIENT_SLOT_INDICES,
  SERVICE_PROCESS_STEP_INDICES,
} from '../../constants/servicesPageLayout'
import { urlsToGallerySlots } from '../../lib/gallerySlots'
import { useAuth } from '../../auth/AuthContext'
import { showAlert, showConfirmationAlert } from '../../lib/sweetAlert'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Separator } from '../../components/ui/separator'
import { HomeHeroConfigForm } from './HomeHeroConfigForm'

function HomeConfigFormRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-3 mb-5 items-start">
      <Label className="md:text-right pt-2 text-muted-foreground">{label}</Label>
      <div>{children}</div>
    </div>
  )
}

function cloneServicesPageConfig(cfg: ServicesPageConfig): ServicesPageConfig {
  return JSON.parse(JSON.stringify(cfg)) as ServicesPageConfig
}

export function AdminConfigHomePage() {
  const navigate = useNavigate()
  const { isLoggedIn, userLoggedIn, authReady } = useAuth()
  const canEdit = userLoggedIn?.privileges?.[1] === 1

  const { data: siteData } = useData()
  const updateMainPage = useUpdateMainPage()
  const updateVisionImages = useUpdateVisionImages()
  const updatePresentationImages = useUpdatePresentationImages()
  const updateProductsServices = useUpdateProductsServices()

  const [slogan, setSlogan] = useState('')
  const [description, setDescription] = useState('')
  const [mision, setMision] = useState('')
  const [vision, setVision] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [visionSlots, setVisionSlots] = useState<GallerySlot[]>(() =>
    urlsToGallerySlots(undefined, HOME_VISION_IMAGE_SLOT_COUNT)
  )
  const [presentationSlots, setPresentationSlots] = useState<GallerySlot[]>(() =>
    urlsToGallerySlots(undefined, HOME_PRESENTATION_IMAGE_SLOT_COUNT)
  )
  const [productsTitle, setProductsTitle] = useState('')
  const [productsParagraph, setProductsParagraph] = useState('')
  const [servicesTitle, setServicesTitle] = useState('')
  const [servicesParagraph, setServicesParagraph] = useState('')

  const [footerAbout, setFooterAbout] = useState('')
  const [footerAboutSaved, setFooterAboutSaved] = useState('')
  const [servicesPageDraft, setServicesPageDraft] = useState<ServicesPageConfig>(() => mergeServicesPageConfig(undefined))
  const [servicesPageSaved, setServicesPageSaved] = useState<ServicesPageConfig>(() => mergeServicesPageConfig(undefined))

  const [sloganSaved, setSloganSaved] = useState('')
  const [descriptionSaved, setDescriptionSaved] = useState('')
  const [misionSaved, setMisionSaved] = useState('')
  const [visionSaved, setVisionSaved] = useState('')
  const [productsTitleSaved, setProductsTitleSaved] = useState('')
  const [productsParagraphSaved, setProductsParagraphSaved] = useState('')
  const [servicesTitleSaved, setServicesTitleSaved] = useState('')
  const [servicesParagraphSaved, setServicesParagraphSaved] = useState('')

  useEffect(() => {
    if (!authReady) return
    if (!isLoggedIn) navigate('/login')
  }, [authReady, isLoggedIn, navigate])

  useEffect(() => {
    if (!siteData) return
    setSlogan(siteData.slogan)
    setSloganSaved(siteData.slogan)
    setDescription(siteData.description)
    setDescriptionSaved(siteData.description)
    setMision(siteData.mision)
    setMisionSaved(siteData.mision)
    setVision(siteData.vision)
    setVisionSaved(siteData.vision)
    setFooterAbout(siteData.footerAbout ?? '')
    setFooterAboutSaved(siteData.footerAbout ?? '')
    const mergedServicesPage = mergeServicesPageConfig(siteData.servicesPage)
    setServicesPageDraft(cloneServicesPageConfig(mergedServicesPage))
    setServicesPageSaved(cloneServicesPageConfig(mergedServicesPage))
    setLogoUrl(siteData.logo ?? '')
    setVisionSlots(urlsToGallerySlots(siteData.visionImages, HOME_VISION_IMAGE_SLOT_COUNT))
    setPresentationSlots(urlsToGallerySlots(siteData.presentationImages, HOME_PRESENTATION_IMAGE_SLOT_COUNT))
    setProductsTitle(siteData.productsTitle)
    setProductsTitleSaved(siteData.productsTitle)
    setProductsParagraph(siteData.productsParagraph)
    setProductsParagraphSaved(siteData.productsParagraph)
    setServicesTitle(siteData.servicesTitle)
    setServicesTitleSaved(siteData.servicesTitle)
    setServicesParagraph(siteData.servicesParagraph)
    setServicesParagraphSaved(siteData.servicesParagraph)
  }, [siteData])

  const handleLogoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      showAlert('Error', 'Debe seleccionar un archivo', 'error')
      return
    }
    setLogoFile(file)
    setLogoUrl(URL.createObjectURL(file))
  }

  const hasChangedMain = () =>
    slogan !== sloganSaved ||
    description !== descriptionSaved ||
    mision !== misionSaved ||
    vision !== visionSaved ||
    footerAbout !== footerAboutSaved ||
    logoFile !== null

  const saveMain = () => {
    if (
      slogan.trim().length < 5 ||
      description.trim().length < 5 ||
      mision.trim().length < 5 ||
      vision.trim().length < 5
    ) {
      showAlert('Error', 'Todos los campos son obligatorios', 'error')
      return
    }
    if (!hasChangedMain()) {
      showAlert('Información', 'No se realizó ningún cambio, no hay nada que guardar', 'info')
      return
    }
    showConfirmationAlert('Confirmación', '¿Está seguro que desea realizar cambios?', () => {
      updateMainPage.mutate(
        { slogan, description, mision, vision, footerAbout, logo: logoFile ?? undefined },
        {
          onSuccess: () => {
            setLogoFile(null)
            showAlert('Éxito', 'Los datos se han guardado correctamente', 'success')
          },
        }
      )
    })
  }

  const saveVisionImages = () => {
    if (visionSlots.some((s) => s.kind === 'empty')) {
      showAlert('Error', 'Todas las imágenes son obligatorias', 'error')
      return
    }
    showConfirmationAlert('Confirmación', '¿Está seguro que desea realizar cambios?', () => {
      const existingImages = visionSlots
        .filter((s) => s.kind === 'existing')
        .map((s) => (s as { kind: 'existing'; url: string }).url)
      const newImages = visionSlots
        .filter((s) => s.kind === 'new')
        .map((s) => (s as { kind: 'new'; file: File; preview: string }).file)
      updateVisionImages.mutate(
        { newImages, existingImages },
        { onSuccess: () => showAlert('Éxito', 'Las imágenes se han guardado correctamente', 'success') }
      )
    })
  }

  const savePresentationImages = () => {
    if (presentationSlots.some((s) => s.kind === 'empty')) {
      showAlert('Error', 'Todas las imágenes son obligatorias', 'error')
      return
    }
    showConfirmationAlert('Confirmación', '¿Está seguro que desea realizar cambios?', () => {
      const existingImages = presentationSlots
        .filter((s) => s.kind === 'existing')
        .map((s) => (s as { kind: 'existing'; url: string }).url)
      const newImages = presentationSlots
        .filter((s) => s.kind === 'new')
        .map((s) => (s as { kind: 'new'; file: File; preview: string }).file)
      updatePresentationImages.mutate(
        { newImages, existingImages },
        { onSuccess: () => showAlert('Éxito', 'Las imágenes se han guardado correctamente', 'success') }
      )
    })
  }

  const hasChangedProductsServices = () =>
    productsTitle !== productsTitleSaved ||
    productsParagraph !== productsParagraphSaved ||
    servicesTitle !== servicesTitleSaved ||
    servicesParagraph !== servicesParagraphSaved ||
    JSON.stringify(servicesPageDraft) !== JSON.stringify(servicesPageSaved)

  const saveProductsServices = () => {
    if (
      productsTitle.trim().length < 5 ||
      productsParagraph.trim().length < 5 ||
      servicesTitle.trim().length < 5 ||
      servicesParagraph.trim().length < 5
    ) {
      showAlert('Error', 'Todos los campos son obligatorios', 'error')
      return
    }
    if (!hasChangedProductsServices()) {
      showAlert('Información', 'No se realizó ningún cambio, no hay nada que guardar', 'info')
      return
    }
    showConfirmationAlert('Confirmación', '¿Está seguro que desea realizar cambios?', () => {
      updateProductsServices.mutate(
        {
          productsTitle,
          productsParagraph,
          servicesTitle,
          servicesParagraph,
          servicesPage: servicesPageDraft,
        },
        {
          onSuccess: () => {
            setServicesPageSaved(cloneServicesPageConfig(servicesPageDraft))
            showAlert('Éxito', 'Los datos se han guardado correctamente', 'success')
          },
        }
      )
    })
  }

  const patchVisionSlots = (sliceStartIndex: number, updatedSegment: GallerySlot[]) => {
    setVisionSlots((previousSlots) => {
      const paddedSlots = [...previousSlots]
      while (paddedSlots.length < HOME_VISION_IMAGE_SLOT_COUNT) paddedSlots.push({ kind: 'empty' })
      const mergedSlots = paddedSlots.slice(0, HOME_VISION_IMAGE_SLOT_COUNT)
      updatedSegment.forEach((slot, segmentIndex) => {
        const absoluteIndex = sliceStartIndex + segmentIndex
        if (absoluteIndex < mergedSlots.length) mergedSlots[absoluteIndex] = slot
      })
      return mergedSlots
    })
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      {/* ── Página de Inicio ── */}
      <h2 className="text-2xl font-bold text-foreground mb-2">Página de Inicio</h2>
      <Separator className="mb-6" />

      <HomeConfigFormRow label="Eslogan">
        <Textarea rows={3} value={slogan} onChange={(e) => setSlogan(e.target.value)} />
      </HomeConfigFormRow>
      <HomeConfigFormRow label="Descripción">
        <Textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
        {description.trim().length < 5 && <p className="text-destructive text-xs mt-1">Mínimo 5 caracteres</p>}
      </HomeConfigFormRow>
      <HomeConfigFormRow label="Misión">
        <Textarea rows={4} value={mision} onChange={(e) => setMision(e.target.value)} />
        {mision.trim().length < 5 && <p className="text-destructive text-xs mt-1">Mínimo 5 caracteres</p>}
      </HomeConfigFormRow>
      <HomeConfigFormRow label="Visión">
        <Textarea rows={4} value={vision} onChange={(e) => setVision(e.target.value)} />
        {vision.trim().length < 5 && <p className="text-destructive text-xs mt-1">Mínimo 5 caracteres</p>}
      </HomeConfigFormRow>
      <HomeConfigFormRow label="Texto del pie (footer público)">
        <Textarea
          rows={3}
          value={footerAbout}
          onChange={(e) => setFooterAbout(e.target.value)}
          placeholder="Si lo deja vacío, se usará el texto por defecto del sitio."
        />
      </HomeConfigFormRow>
      <HomeConfigFormRow label="Logo">
        <div className="flex rounded-md border border-input overflow-hidden mb-3">
          <input type="file" className="flex-1 px-3 py-2 text-sm border-none outline-none min-w-0" id="inputFileLogo" accept="image/*" onChange={handleLogoFile} />
          <label htmlFor="inputFileLogo" className="px-3 py-2 bg-muted border-l border-input text-sm text-muted-foreground cursor-pointer whitespace-nowrap hover:bg-secondary">
            Seleccionar
          </label>
        </div>
        {logoUrl && <img src={logoUrl} alt="Logo" className="max-w-xs rounded-lg border border-border" />}
      </HomeConfigFormRow>
      {canEdit && <Button className="mt-2 mb-10 bg-green-600 hover:bg-green-700 text-white" onClick={saveMain}>Guardar</Button>}

      <HomeHeroConfigForm siteData={siteData} canEdit={!!canEdit} />

      {/* ── Imágenes ── */}
      <h2 className="text-2xl font-bold text-foreground mb-2">Imágenes</h2>
      <Separator className="mb-6" />

      <h3 className="text-lg font-semibold text-foreground mb-2">Misión y Visión (página de inicio)</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Las dos primeras posiciones corresponden a <strong className="text-foreground">Misión</strong> y las dos siguientes a{' '}
        <strong className="text-foreground">Visión</strong> en el home (orden heredado del sitio anterior).
      </p>
      <ConfigGallery
        title="Misión"
        description="Seleccione archivo por cada ranura. Estas imágenes son las del bloque de misión en la página de inicio."
        slots={visionSlots.slice(0, HOME_VISION_MISSION_SLOT_LABELS.length)}
        identifier="1-mision"
        slotLabels={HOME_VISION_MISSION_SLOT_LABELS}
        onSlotsChange={(partial) => patchVisionSlots(0, partial)}
      />
      <ConfigGallery
        className="mt-8"
        title="Visión"
        description="Imágenes del bloque de visión en la página de inicio."
        slots={visionSlots.slice(HOME_VISION_MISSION_SLOT_LABELS.length, HOME_VISION_IMAGE_SLOT_COUNT)}
        identifier="1-vision"
        slotLabels={HOME_VISION_VISION_SLOT_LABELS}
        onSlotsChange={(partial) => patchVisionSlots(HOME_VISION_MISSION_SLOT_LABELS.length, partial)}
      />
      {canEdit && <Button className="mt-4 mb-8 bg-green-600 hover:bg-green-700 text-white" onClick={saveVisionImages}>Guardar imágenes</Button>}

      <ConfigGallery
        title="Presentación"
        description="Seleccione una imagen por ranura para el carrusel o bloque de presentación en la página de inicio."
        slots={presentationSlots}
        identifier="2"
        slotLabels={HOME_PRESENTATION_IMAGE_SLOT_LABELS}
        onSlotsChange={setPresentationSlots}
      />
      {canEdit && <Button className="mt-4 mb-10 bg-green-600 hover:bg-green-700 text-white" onClick={savePresentationImages}>Guardar imágenes</Button>}

      {/* ── Productos y Servicios ── */}
      <h2 className="text-2xl font-bold text-foreground mb-2">Páginas de Productos y Servicios</h2>
      <Separator className="mb-6" />

      <HomeConfigFormRow label="Título de Productos"><Input value={productsTitle} onChange={(e) => setProductsTitle(e.target.value)} /></HomeConfigFormRow>
      <HomeConfigFormRow label="Párrafo de Productos"><Textarea rows={3} value={productsParagraph} onChange={(e) => setProductsParagraph(e.target.value)} /></HomeConfigFormRow>
      <HomeConfigFormRow label="Título de Servicios"><Input value={servicesTitle} onChange={(e) => setServicesTitle(e.target.value)} /></HomeConfigFormRow>
      <HomeConfigFormRow label="Párrafo de Servicios"><Textarea rows={3} value={servicesParagraph} onChange={(e) => setServicesParagraph(e.target.value)} /></HomeConfigFormRow>

      <h3 className="text-lg font-semibold text-foreground mt-8 mb-2">Servicios — degradados y pasos (página pública)</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Degradados en CSS (p. ej. <code className="text-xs">linear-gradient(135deg,#0a1f5c,#1d3bb8)</code>) para las tarjetas; y los cuatro pasos de “¿Cómo trabajamos?”.
      </p>
      {SERVICE_CARD_GRADIENT_SLOT_INDICES.map((gradientSlotIndex) => (
        <HomeConfigFormRow key={gradientSlotIndex} label={`Degradado tarjeta ${gradientSlotIndex + 1}`}>
          <Input
            value={servicesPageDraft.cardGradients[gradientSlotIndex] ?? ''}
            onChange={(e) =>
              setServicesPageDraft((previous) => {
                const cardGradients = [...previous.cardGradients]
                cardGradients[gradientSlotIndex] = e.target.value
                return { ...previous, cardGradients }
              })
            }
          />
        </HomeConfigFormRow>
      ))}
      {SERVICE_PROCESS_STEP_INDICES.map((processStepIndex) => (
        <div key={processStepIndex} className="border border-border rounded-lg p-4 mb-4 space-y-3">
          <p className="text-sm font-medium text-foreground">Paso {processStepIndex + 1}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Etiqueta (número)</Label>
              <Input
                value={servicesPageDraft.processSteps[processStepIndex]?.step ?? ''}
                onChange={(e) =>
                  setServicesPageDraft((previous) => ({
                    ...previous,
                    processSteps: previous.processSteps.map((row, rowIndex) =>
                      rowIndex === processStepIndex ? { ...row, step: e.target.value } : row
                    ),
                  }))
                }
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Título</Label>
              <Input
                value={servicesPageDraft.processSteps[processStepIndex]?.title ?? ''}
                onChange={(e) =>
                  setServicesPageDraft((previous) => ({
                    ...previous,
                    processSteps: previous.processSteps.map((row, rowIndex) =>
                      rowIndex === processStepIndex ? { ...row, title: e.target.value } : row
                    ),
                  }))
                }
              />
            </div>
            <div className="sm:col-span-1">
              <Label className="text-xs text-muted-foreground">Descripción</Label>
              <Textarea
                rows={2}
                value={servicesPageDraft.processSteps[processStepIndex]?.desc ?? ''}
                onChange={(e) =>
                  setServicesPageDraft((previous) => ({
                    ...previous,
                    processSteps: previous.processSteps.map((row, rowIndex) =>
                      rowIndex === processStepIndex ? { ...row, desc: e.target.value } : row
                    ),
                  }))
                }
              />
            </div>
          </div>
        </div>
      ))}

      {canEdit && <Button className="mt-2 mb-8 bg-green-600 hover:bg-green-700 text-white" onClick={saveProductsServices}>Guardar</Button>}
    </div>
  )
}
