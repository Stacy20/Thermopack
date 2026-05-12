import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData, useUpdateMainPage, useUpdateVisionImages, useUpdatePresentationImages, useUpdateProductsServices } from '../../hooks/useData'
import { ConfigGallery, type GallerySlot } from '../../components/ConfigGallery'
import { useAuth } from '../../auth/AuthContext'
import { showAlert, showConfirmationAlert } from '../../lib/sweetAlert'

export function AdminConfigHomePage() {
  const navigate = useNavigate()
  const { isLoggedIn, userLoggedIn } = useAuth()
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
  const [visionSlots, setVisionSlots] = useState<GallerySlot[]>([])
  const [presentationSlots, setPresentationSlots] = useState<GallerySlot[]>([])
  const [productsTitle, setProductsTitle] = useState('')
  const [productsParagraph, setProductsParagraph] = useState('')
  const [servicesTitle, setServicesTitle] = useState('')
  const [servicesParagraph, setServicesParagraph] = useState('')

  const [sloganSaved, setSloganSaved] = useState('')
  const [descriptionSaved, setDescriptionSaved] = useState('')
  const [misionSaved, setMisionSaved] = useState('')
  const [visionSaved, setVisionSaved] = useState('')
  const [productsTitleSaved, setProductsTitleSaved] = useState('')
  const [productsParagraphSaved, setProductsParagraphSaved] = useState('')
  const [servicesTitleSaved, setServicesTitleSaved] = useState('')
  const [servicesParagraphSaved, setServicesParagraphSaved] = useState('')

  useEffect(() => {
    if (!isLoggedIn) navigate('/login')
  }, [isLoggedIn, navigate])

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
    setLogoUrl(siteData.logo ?? '')
    setVisionSlots((siteData.visionImages ?? []).map((url): GallerySlot => ({ kind: 'existing', url })))
    setPresentationSlots((siteData.presentationImages ?? []).map((url): GallerySlot => ({ kind: 'existing', url })))
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
        { slogan, description, mision, vision, logo: logoFile ?? undefined },
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
      showAlert('Error', 'Todos las imagenes son obligatorias', 'error')
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
      showAlert('Error', 'Todos las imagenes son obligatorias', 'error')
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
    servicesParagraph !== servicesParagraphSaved

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
        { productsTitle, productsParagraph, servicesTitle, servicesParagraph },
        { onSuccess: () => showAlert('Éxito', 'Los datos se han guardado correctamente', 'success') }
      )
    })
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12 mt-4">
          <h2>Página de Inicio</h2>
          <hr />
          <div className="row mb-3">
            <div className="col-md-3">
              <p className="text-md-end">Eslogan</p>
            </div>
            <div className="col-md-6">
              <textarea className="form-control" value={slogan} onChange={(e) => setSlogan(e.target.value)} />
              {/* {slogan.trim().length < 5 && <div className="text-danger">Debe tener al menos 5 caracteres</div>} */}
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-3">
              <p className="text-md-end">Descripción de la empresa</p>
            </div>
            <div className="col-md-6">
              <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} />
              {description.trim().length < 5 && <div className="text-danger">Debe tener al menos 5 caracteres</div>}
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-3">
              <p className="text-md-end">Misión de la empresa</p>
            </div>
            <div className="col-md-6">
              <textarea className="form-control" value={mision} onChange={(e) => setMision(e.target.value)} />
              {mision.trim().length < 5 && <div className="text-danger">Debe tener al menos 5 caracteres</div>}
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-3">
              <p className="text-md-end">Visión de la empresa</p>
            </div>
            <div className="col-md-6">
              <textarea className="form-control" value={vision} onChange={(e) => setVision(e.target.value)} />
              {vision.trim().length < 5 && <div className="text-danger">Debe tener al menos 5 caracteres</div>}
            </div>
          </div>
          <div className="row mb-4">
            <div className="col-md-3">
              <p className="text-md-end">Logo de la empresa</p>
            </div>
            <div className="col-md-6">
              <div className="input-group mb-3">
                <input type="file" className="form-control" id="inputFileLogo" accept="image/*" onChange={handleLogoFile} />
                <label className="input-group-text" htmlFor="inputFileLogo">
                  Seleccionar archivo
                </label>
              </div>
              {logoUrl ? <img src={logoUrl} alt="Logo" style={{ maxWidth: 300 }} /> : null}
            </div>
          </div>
          <div className="row mb-4">
            <div className="offset-md-3 col-md-6">
              {canEdit && (
                <button type="button" className="btn btn-success me-4" onClick={saveMain}>
                  Guardar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-12">
          <h2>Imágenes</h2>
          <hr />
          <h4>Misión y Visión</h4>
          <p>Seleccione una imagen para cambiarla.</p>
          <ConfigGallery slots={visionSlots} identifier="1" onSlotsChange={setVisionSlots} />
          <div className="row my-4">
            <div className="col-md-6">
              {canEdit && (
                <button type="button" className="btn btn-success me-4" onClick={saveVisionImages}>
                  Guardar
                </button>
              )}
            </div>
          </div>
          <h4 className="mt-4">Presentación</h4>
          <p>Seleccione una imagen para cambiarla o borrarla.</p>
          <ConfigGallery slots={presentationSlots} identifier="2" onSlotsChange={setPresentationSlots} />
          <div className="row my-4">
            <div className="col-md-6">
              {canEdit && (
                <button type="button" className="btn btn-success me-4" onClick={savePresentationImages}>
                  Guardar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row my-4">
        <div className="col-md-12">
          <h2>Páginas de Productos y Servicios</h2>
          <hr />
          <div className="row mb-3">
            <div className="col-md-3">
              <p className="text-md-end">Título de Productos</p>
            </div>
            <div className="col-md-6">
              <input type="text" className="form-control" value={productsTitle} onChange={(e) => setProductsTitle(e.target.value)} />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-3">
              <p className="text-md-end">Párrafo de Productos</p>
            </div>
            <div className="col-md-6">
              <textarea className="form-control" value={productsParagraph} onChange={(e) => setProductsParagraph(e.target.value)} />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-3">
              <p className="text-md-end">Título de Servicios</p>
            </div>
            <div className="col-md-6">
              <input type="text" className="form-control" value={servicesTitle} onChange={(e) => setServicesTitle(e.target.value)} />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-3">
              <p className="text-md-end">Párrafo de Servicios</p>
            </div>
            <div className="col-md-6">
              <textarea className="form-control" value={servicesParagraph} onChange={(e) => setServicesParagraph(e.target.value)} />
            </div>
          </div>
          <div className="row mb-4">
            <div className="offset-md-3 col-md-6">
              {canEdit && (
                <button type="button" className="btn btn-success me-4" onClick={saveProductsServices}>
                  Guardar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
