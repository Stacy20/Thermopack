import { useTextData, useLogo, useVisionImages, usePresentationImages } from '../hooks/useData'
import { Carousel } from '../components/Carousel'
import { formatDescription } from '../utils/text'

export function HomePage() {
  const { data: textData } = useTextData()
  const { data: logoData } = useLogo()
  const { data: visionData } = useVisionImages()
  const { data: presentationData } = usePresentationImages()
  console.log(textData)
  const slogan = String(textData?.slogan ?? '')
  const companyDescription = String(textData?.description ?? '')
  const descriptionMission = String(textData?.mision ?? '')
  const descriptionVision = String(textData?.vision ?? '')
  const srcLogo = logoData?.logo ?? ''
  const visionImages = visionData?.visionImages ?? []
  const carouselImages = (presentationData?.presentationImages ?? []).filter(Boolean)

  const isLoaded =
    slogan !== '' &&
    companyDescription !== '' &&
    descriptionMission !== '' &&
    descriptionVision !== '' &&
    srcLogo !== ''
  console.log(isLoaded)
  return (
    <div className="row">
      {isLoaded ? (
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
                    <img src={visionImages[0]} className="d-block w-100" alt="" />
                  </div>
                  <div className="container centrar-img col-5 mt-5 myborder">
                    <img src={visionImages[1]} className="d-block w-100" alt="" />
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
                    <img src={visionImages[2]} className="d-block w-100" alt="" />
                  </div>
                  <div className="container centrar-img col-5 mt-5 myborder">
                    <img src={visionImages[3]} className="d-block w-100" alt="" />
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
