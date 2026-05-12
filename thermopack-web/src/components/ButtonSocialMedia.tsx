import { useEffect, useState, useRef } from 'react'
import { getContactData } from '../api/contact'

export function ButtonSocialMedia() {
  const [open, setOpen] = useState(false)
  const [facebookLink, setFacebook] = useState('#')
  const [youtubeLink, setYoutube] = useState('#')
  const [whatsappLink, setWhatsapp] = useState('#')
  const [instagramLink, setInstagram] = useState('#')
  const btnsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    getContactData().then((c) => {
      if (c[0]) {
        setFacebook(c[0].facebookLink || '#')
        setYoutube(c[0].youtubeLink || '#')
        setWhatsapp(`https://wa.me/${c[0].whatsappLink}`)
        setInstagram(c[0].instagramLink || '#')
      }
    })
  }, [])

  useEffect(() => {
    if (!btnsRef.current) return
    btnsRef.current.style.visibility = open ? 'visible' : 'hidden'
    btnsRef.current.style.opacity = open ? '1' : '0'
  }, [open])

  return (
    <div className="position-fixed bottom-0 end-0 p-4" style={{ zIndex: 1040 }}>
      <div className="d-flex flex-column align-items-end gap-2">
        <div ref={btnsRef} className="d-flex flex-column gap-2" style={{ visibility: 'hidden', opacity: 0, transition: '0.2s' }}>
          <a href={facebookLink} target="_blank" rel="noreferrer" className="btn btn-primary rounded-circle">
            <i className="fab fa-facebook-f" />
          </a>
          <a href={youtubeLink} target="_blank" rel="noreferrer" className="btn btn-danger rounded-circle">
            <i className="fab fa-youtube" />
          </a>
          <a href={whatsappLink} target="_blank" rel="noreferrer" className="btn btn-success rounded-circle">
            <i className="fab fa-whatsapp" />
          </a>
          <a href={instagramLink} target="_blank" rel="noreferrer" className="btn btn-warning rounded-circle">
            <i className="fab fa-instagram" />
          </a>
        </div>
        <button
          type="button"
          className="btn btn-secondary rounded-circle p-3"
          aria-label="Redes sociales"
          onClick={() => setOpen((o) => !o)}
        >
          <i className={open ? 'fas fa-times' : 'fas fa-share-alt'} />
        </button>
      </div>
    </div>
  )
}
