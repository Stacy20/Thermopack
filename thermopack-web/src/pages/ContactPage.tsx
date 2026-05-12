import { useContact } from '../hooks/useContact'
import { formatDescription } from '../utils/text'

const FALLBACK_DESCRIPTION =
  'Envíenos sus consultas a través de cualquiera de nuestros medios de comuniación y le atenderemos con todo gusto a la mayor brevedad posible.'

export function ContactPage() {
  const { data: contactList } = useContact()
  const contact = contactList?.[0]

  const mensajeWhatsApp = '¿Cómo puedo adquirir productos o servicios de ustedes?'
  const whatsappLink = contact
    ? `https://wa.me/${contact.whatsappLink}?text=${encodeURIComponent(mensajeWhatsApp)}`
    : '#'

  const images = contact?.images ?? ['', '', '', '']

  return (
    <div className="container d-flex justify-content-center align-items-center">
      <div className="row">
        <div className="mybackground col-12 mt-5">
          <div className="col-12 m-4 d-flex">
            <div className="row mb-5">
              <div className="col-12 col-lg-5 col-md-4 col-sm-10 p-0 d-flex justify-content-center align-items-center">
                {images[0] === '' ? (
                  <div className="spinner-border text-light" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                ) : (
                  <img src={images[0]} alt="ThermoPack" height={200} width={240} className="rounded-circle mt-1 centered-image" />
                )}
              </div>
              <div className="col-12 col-sm-10 col-lg-7 col-md-10 mt-3">
                <h1 className="text-light">Contáctenos</h1>
                <div
                  className="h4 mt-5 me-3 mb-3 text-light"
                  dangerouslySetInnerHTML={{ __html: formatDescription(contact?.welcomeParagraph || FALLBACK_DESCRIPTION) }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="mt-5 d-flex mb-5 flex-column flex-lg-row flex-md-row">
            <div className="col-12 col-lg-6 col-md-5 col-sm-12 mt-5 ms-4">
              <ul className="list-unstyled ms-5">
                <li className="m-2 h5">
                  <i className="fas fa-location-dot" /> Ubicación exacta
                </li>
                <ul className="list-unstyled">
                  <li>
                    <a href={contact?.ubicationGMLink ?? '#'} target="_blank" rel="noreferrer">
                      Maps
                    </a>
                  </li>
                  <li>
                    <a href={contact?.ubicationWazeLink ?? '#'} target="_blank" rel="noreferrer">
                      Waze
                    </a>
                  </li>
                  <li>{contact?.ubicationText}</li>
                </ul>
                <li className="m-2 h5">
                  <i className="fas fa-phone" /> Números de teléfono
                </li>
                <ul className="list-unstyled">
                  {(contact?.telephoneNumbers ?? []).map((n, i) => (
                    <li key={i}>{n}</li>
                  ))}
                </ul>
                <li className="m-2 h5">
                  <i className="fa-solid fa-envelope" /> Correo electrónico
                </li>
                <ul className="mb-3 list-unstyled">{contact?.email}</ul>
                <span className="m-2 h5">
                  <i className="fa-solid fa-share-from-square" aria-hidden="true" /> Redes Sociales
                </span>
                <ul className="list-unstyled">
                  <li>
                    <a href={whatsappLink} target="_blank" rel="noreferrer">
                      Whatsapp
                    </a>
                  </li>
                  <li>
                    <a href={contact?.facebookLink ?? '#'} target="_blank" rel="noreferrer">
                      Facebook
                    </a>
                  </li>
                  <li>
                    <a href={contact?.youtubeLink ?? '#'} target="_blank" rel="noreferrer">
                      Youtube
                    </a>
                  </li>
                  <li>
                    <a href={contact?.instagramLink ?? '#'} target="_blank" rel="noreferrer">
                      Instagram
                    </a>
                  </li>
                </ul>
              </ul>
            </div>
            <div className="col-12 col-lg-6 col-md-6 col-sm-12 mt-5 dots-container">
              <div className="row">
                <div className="container col-5 me-0">
                  {images[1] !== '' && <img src={images[1]} className="d-block w-100" alt="" />}
                </div>
                <div className="container col-5 mt-5">
                  {images[2] !== '' && <img src={images[2]} className="d-block w-100" alt="" />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
