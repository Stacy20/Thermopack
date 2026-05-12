import { useEffect, useState } from 'react'
import { getTextData, getLogo, getVisionImages, getPresentationImages } from '../api/data'
import { Carousel } from '../components/Carousel'
import { formatDescription } from '../utils/text'

export function HomePage() {
  const [loading, setLoading] = useState(true)
  const [srcLogo, setSrcLogo] = useState('')
  const [slogan, setSlogan] = useState('')
  const [companyDescription, setCompanyDescription] = useState('')
  const [descriptionMission, setDescriptionMission] = useState('')
  const [descriptionVision, setDescriptionVision] = useState('')
  const [srcMission1, setSrcMission1] = useState('')
  const [srcMission2, setSrcMission2] = useState('')
  const [srcVision1, setSrcVision1] = useState('')
  const [srcVision2, setSrcVision2] = useState('')
  const [carouselImages, setCarouselImages] = useState<string[]>([])

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      try {
        const data = await getTextData()
        if (data && !cancelled) {
          setSlogan(String(data.slogan ?? ''))
          setCompanyDescription(String(data.description ?? ''))
          setDescriptionMission(String(data.mision ?? ''))
          setDescriptionVision(String(data.vision ?? ''))
        }
        const logo = await getLogo()
        if (logo && !cancelled) setSrcLogo(logo.logo ?? '')
        const visionImages = await getVisionImages()
        if (visionImages?.visionImages && !cancelled) {
          const vi = visionImages.visionImages
          setSrcMission1(vi[0] ?? '')
          setSrcMission2(vi[1] ?? '')
          setSrcVision1(vi[2] ?? '')
          setSrcVision2(vi[3] ?? '')
        }
        const presentationImages = await getPresentationImages()
        if (presentationImages?.presentationImages && !cancelled) {
          setCarouselImages(
            presentationImages.presentationImages.filter((s: string) => s !== '')
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [])

  const checkDataLoaded =
    srcLogo !== '' &&
    slogan !== '' &&
    companyDescription !== '' &&
    descriptionMission !== '' &&
    descriptionVision !== '' &&
    srcMission1 !== '' &&
    srcMission2 !== '' &&
    srcVision1 !== '' &&
    srcVision2 !== '' &&
    carouselImages.length > 0

  const showContent = checkDataLoaded && !loading

  return (
    <div className="row">
      {!showContent ? (
        <div className="d-flex justify-content-center align-items-center container-spinner flex-column">
          <div className="spinner-border spinner" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <h4 className="mt-5 me-3">Cargando...</h4>
        </div>
      ) : (
        <>
          <div className="mybackground col-12 mt-5">
            <div className="col-12 m-4 d-flex mb-0">
              <div className="row mb-5 mb-0 ms-4">
                <div className="col-6 col-lg-3 col-md-4 col-sm-10 p-0 ms-lg-5 mt-5">
                  <img src={srcLogo} alt="logo" height={200} width={240} className="rounded-circle mt-1 centered-image" />
                </div>
                <div className="col-11 col-lg-8 col-md-7 col-sm-11 p-0 mt-3">
                  <h1 className="m-1 text-light">{slogan}</h1>
                  <h4 className="mt-5 me-3 text-light" dangerouslySetInnerHTML={{ __html: formatDescription(companyDescription) }} />
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-center">
              <div className="col-9 col-lg-12 col-md-10 col-sm-9 mt-4">
                <Carousel images={carouselImages} />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="mt-5 d-flex mb-5 flex-column flex-lg-row flex-md-row">
              <div className="col-12 col-lg-6 col-md-5 col-sm-12 mt-5 ms-4">
                <h1 className="mt-5">Misión de la empresa</h1>
                <div dangerouslySetInnerHTML={{ __html: formatDescription(descriptionMission) }} />
              </div>
              <div className="col-12 col-lg-6 col-md-6 col-sm-12 mt-5 dots-container">
                <div className="row">
                  <div className="container centrar-img col-5 myborder me-0">
                    <img src={srcMission1} className="d-block w-100" alt="" />
                  </div>
                  <div className="container centrar-img col-5 mt-5 myborder">
                    <img src={srcMission2} className="d-block w-100" alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="mt-5 d-flex mb-5 flex-column flex-lg-row flex-md-row">
              <div className="col-12 col-lg-6 col-md-6 col-sm-12 mt-5 dots-container">
                <div className="row">
                  <div className="container centrar-img col-5 myborder me-0">
                    <img src={srcVision1} className="d-block w-100" alt="" />
                  </div>
                  <div className="container centrar-img col-5 mt-5 myborder">
                    <img src={srcVision2} className="d-block w-100" alt="" />
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-6 col-md-5 col-sm-12 mt-5 ms-4">
                <h1 className="mt-5">Visión de la empresa</h1>
                <div dangerouslySetInnerHTML={{ __html: formatDescription(descriptionVision) }} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
