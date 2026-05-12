import { useContact } from '../hooks/useContact'

export function ClientFooter() {
  const { data: contactList } = useContact()
  const contact = contactList?.[0]

  const youtubeLink = contact?.youtubeLink || '#'
  const facebookLink = contact?.facebookLink || '#'
  const instagramLink = contact?.instagramLink || '#'
  const whatsappLink = contact ? `https://wa.me/${contact.whatsappLink}` : '#'

  return (
    <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
      <div className="col-md-4 d-flex align-items-center">
        <span className="mb-3 mb-md-0 text-muted">&copy; 2024 Company, ThermoPack</span>
      </div>
      <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
        <li className="ms-0">
          <a href={youtubeLink} target="_blank" rel="noreferrer" className="btn text-danger">
            <i className="fab fa-youtube" />
          </a>
        </li>
        <li className="ms-0">
          <a href={facebookLink} target="_blank" rel="noreferrer" className="btn text-primary">
            <i className="fab fa-facebook-f" />
          </a>
        </li>
        <li className="ms-0">
          <a href={whatsappLink} target="_blank" rel="noreferrer" className="btn text-success">
            <i className="fab fa-whatsapp" />
          </a>
        </li>
        <li className="ms-0">
          <a href={instagramLink} target="_blank" rel="noreferrer" className="btn text-danger">
            <i className="fab fa-instagram" />
          </a>
        </li>
      </ul>
    </footer>
  )
}
