import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getData,
  updateMainPage,
  updateMisionImages,
  updatePresentationImages,
  updateProductsServices,
} from '../../api/data'
import { ConfigGallery } from '../../components/ConfigGallery'
import { useAuth } from '../../auth/AuthContext'
import { showAlert, showConfirmationAlert } from '../../lib/sweetAlert'

export function AdminConfigHomePage() {
  const navigate = useNavigate()
  const { isLoggedIn, userLoggedIn } = useAuth()

  const [eslogan, setEslogan] = useState('')
  const [description, setDescription] = useState('')
  const [mision, setMision] = useState('')
  const [vision, setVision] = useState('')
  const [logo, setLogo] = useState('')
  const [visionImages, setVisionImages] = useState<string[]>(['', '', '', ''])
  const [presentationImages, setPresentationImages] = useState<string[]>(['', '', '', ''])
  const [productosTitle, setProductosTitle] = useState('')
  const [productosText, setProductosText] = useState('')
  const [servicesTitle, setServicesTitle] = useState('')
  const [servicesText, setServicesText] = useState('')

  const [esloganPast, setEsloganPast] = useState('')
  const [descriptionPast, setDescriptionPast] = useState('')
  const [misionPast, setMisionPast] = useState('')
  const [visionPast, setVisionPast] = useState('')
  const [logoPast, setLogoPast] = useState('')
  const [visionImagesPast, setVisionImagesPast] = useState<string[]>([])
  const [presentationImagesPast, setPresentationImagesPast] = useState<string[]>([])
  const [productosTitlePast, setProductosTitlePast] = useState('')
  const [productosTextPast, setProductosTextPast] = useState('')
  const [servicesTitlePast, setServicesTitlePast] = useState('')
  const [servicesTextPast, setServicesTextPast] = useState('')

  useEffect(() => {
    if (!isLoggedIn) navigate('/login')
  }, [isLoggedIn, navigate])

  useEffect(() => {
    void getData().then((rows) => {
      const d = rows[0]
      if (!d) return
      setEslogan(d.slogan)
      setEsloganPast(d.slogan)
      setDescription(d.description)
      setDescriptionPast(d.description)
      setMision(d.mision)
      setMisionPast(d.mision)
      setVision(d.vision)
      setVisionPast(d.vision)
      setLogo(d.logo)
      setLogoPast(d.logo)
      setVisionImages([...(d.visionImages ?? [])])
      setVisionImagesPast([...(d.visionImages ?? [])])
      setPresentationImages([...(d.presentationImages ?? [])])
      setPresentationImagesPast([...(d.presentationImages ?? [])])
      setProductosTitle(d.productsTitle)
      setProductosTitlePast(d.productsTitle)
      setProductosText(d.productsParagraph)
      setProductosTextPast(d.productsParagraph)
      setServicesTitle(d.servicesTitle)
      setServicesTitlePast(d.servicesTitle)
      setServicesText(d.servicesParagraph)
      setServicesTextPast(d.servicesParagraph)
    })
  }, [])

  const handleLogoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      showAlert('Error', 'Debe seleccionar un archivo', 'error')
      return
    }
    const reader = new FileReader()
    reader.onload = () => setLogo(String(reader.result ?? ''))
    reader.readAsDataURL(file)
  }

  const hasChangedHome = () =>
    eslogan !== esloganPast ||
    description !== descriptionPast ||
    mision !== misionPast ||
    vision !== visionPast ||
    logo !== logoPast

  const saveMain = () => {
    if (
      !eslogan ||
      eslogan.trim().length < 5 ||
      !description ||
      description.trim().length < 5 ||
      !mision ||
      mision.trim().length < 5 ||
      !vision ||
      vision.trim().length < 5 ||
      !logo
    ) {
      showAlert('Error', 'Todos los campos son obligatorios', 'error')
      return
    }
    if (!hasChangedHome()) {
      showAlert('Información', 'No se realizó ningún cambio, no hay nada que guardar', 'info')
      return
    }
    showConfirmationAlert('Confirmación', '¿Está seguro que desea realizar cambios?', () => {
      void updateMainPage(eslogan, description, mision, vision, logo).then(() => {
        showAlert('Éxito', 'Los datos se han guardado correctamente', 'success')
      })
    })
  }

  const arraysAreEqualVision = (): boolean => {
    let flag = 0
    for (let i = 0; i < visionImagesPast.length; i++) {
      if (visionImagesPast[i] !== visionImages[i]) flag = 1
    }
    if (flag === 0) {
      showAlert('Información', 'No se realizó ningún cambio, no hay nada que guardar', 'info')
      return false
    }
    for (let i = 0; i < visionImages.length; i++) {
      if (visionImages[i] === '') {
        showAlert('Error', 'Todos las imagenes son obligatorias', 'error')
        return false
      }
    }
    return true
  }

  const saveVisionImages = () => {
    if (!arraysAreEqualVision()) return
    showConfirmationAlert('Confirmación', '¿Está seguro que desea realizar cambios?', () => {
      void updateMisionImages(visionImages).then(() => {
        showAlert('Éxito', 'Las imágenes se han guardado correctamente', 'success')
      })
    })
  }

  const arraysAreEqualPresentation = (): boolean => {
    let flag = 0
    for (let i = 0; i < presentationImagesPast.length; i++) {
      if (presentationImagesPast[i] !== presentationImages[i]) flag = 1
    }
    if (flag === 0) {
      showAlert('Información', 'No se realizó ningún cambio, no hay nada que guardar', 'info')
      return false
    }
    for (let i = 0; i < presentationImages.length; i++) {
      if (presentationImages[i] === '') {
        showAlert('Error', 'Todos las imagenes son obligatorias', 'error')
        return false
      }
    }
    return true
  }

  const savePresentationImages = () => {
    if (!arraysAreEqualPresentation()) return
    showConfirmationAlert('Confirmación', '¿Está seguro que desea realizar cambios?', () => {
      void updatePresentationImages(presentationImages).then(() => {
        showAlert('Éxito', 'Las imágenes se han guardado correctamente', 'success')
      })
    })
  }

  const hasChangedProductsServices = () =>
    productosTitle !== productosTitlePast ||
    productosText !== productosTextPast ||
    servicesTitle !== servicesTitlePast ||
    servicesText !== servicesTextPast

  const saveProductsServices = () => {
    if (
      !productosTitle ||
      productosTitle.trim().length < 5 ||
      !productosText ||
      productosText.trim().length < 5 ||
      !servicesTitle ||
      servicesTitle.trim().length < 5 ||
      !servicesText ||
      servicesText.trim().length < 5
    ) {
      showAlert('Error', 'Todos los campos son obligatorios', 'error')
      return
    }
    if (!hasChangedProductsServices()) {
      showAlert('Información', 'No se realizó ningún cambio, no hay nada que guardar', 'info')
      return
    }
    showConfirmationAlert('Confirmación', '¿Está seguro que desea realizar cambios?', () => {
      void updateProductsServices(productosTitle, productosText, servicesTitle, servicesText).then(() => {
        showAlert('Éxito', 'Los datos se han guardado correctamente', 'success')
      })
    })
  }

  const updateImages = (images: string[], identifier: string) => {
    if (identifier === '1') setVisionImages(images)
    if (identifier === '2') setPresentationImages(images)
  }

  const canEdit = userLoggedIn?.privileges?.[1] === 1

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
              <textarea className="form-control" value={eslogan} onChange={(e) => setEslogan(e.target.value)} />
              {eslogan.trim().length < 5 && <div className="text-danger">Debe tener al menos 5 caracteres</div>}
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
              {logo ? <img src={logo} alt="Logo" style={{ maxWidth: 300 }} /> : null}
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
          <ConfigGallery images={visionImages} identifier="1" onImagesChange={updateImages} />
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
          <ConfigGallery images={presentationImages} identifier="2" onImagesChange={updateImages} />
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
              <input type="text" className="form-control" value={productosTitle} onChange={(e) => setProductosTitle(e.target.value)} />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-3">
              <p className="text-md-end">Párrafo de Productos</p>
            </div>
            <div className="col-md-6">
              <textarea className="form-control" value={productosText} onChange={(e) => setProductosText(e.target.value)} />
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
              <textarea className="form-control" value={servicesText} onChange={(e) => setServicesText(e.target.value)} />
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
