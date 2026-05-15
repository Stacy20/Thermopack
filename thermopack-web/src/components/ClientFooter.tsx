import { useNavigate } from 'react-router-dom'
import { useContact } from '../hooks/useContact'
import { useTextData } from '../hooks/useData'
import { useAllCategories } from '../hooks/useCategories'
import { useCatalogStore } from '../stores/catalogStore'

export function ClientFooter() {
  const navigate = useNavigate()
  const setCategoryFilter = useCatalogStore((s) => s.setCategoryFilter)
  const { data: contact } = useContact()
  const { data: textData } = useTextData()
  const { data: categories = [] } = useAllCategories()

  const footerTagline = textData?.footerAbout?.trim()

  const phones: string[] = contact?.telephoneNumbers ?? []
  const email: string = contact?.email ?? ''
  const whatsappLink = contact ? `https://wa.me/${contact.whatsappLink}` : '#'

  const goToProductsWithCategory = (categoryId: string) => {
    setCategoryFilter(categoryId)
    navigate('/productos')
  }

  return (
    <footer className="mt-10 flex justify-center bg-gray-900 pb-6 pt-5 text-white/65 sm:mt-12 sm:pt-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col justify-center gap-10 px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 ">
          {/* Brand */}
          <div>
            <div className="font-display font-bold text-xl text-white mb-3">
              Thermo<span className="text-brand-green">Pack</span>
            </div>
            <p className="text-sm leading-7 mb-5">{footerTagline}</p>
          </div>

          {/* Empresa */}
          <div>
            <h5 className="font-display font-bold text-sm text-white uppercase tracking-wider mb-4">Empresa</h5>
            <ul className="list-none flex flex-col gap-2 p-0 m-0">
              {[
                { label: 'Quiénes somos', path: '/nosotros' },
                { label: 'Misión y visión', path: '/nosotros' },
                { label: 'Servicios', path: '/servicios' },
                { label: 'Contacto', path: '/contactenos' },
              ].map(({ label, path }) => (
                <li key={label}>
                  <button
                    type="button"
                    onClick={() => navigate(path)}
                    className="text-[0.82rem] text-white/55 bg-transparent border-none cursor-pointer p-0 font-body hover:text-white transition-colors"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Categorías */}
          <div>
            <h5 className="font-display font-bold text-sm text-white uppercase tracking-wider mb-4">Categorías</h5>
            <ul className="list-none flex flex-col gap-2 p-0 m-0">
              {categories.length === 0 ? (
                <li className="text-[0.82rem] text-white/40">Cargando…</li>
              ) : (
                categories.map((cat) => (
                  <li key={cat._id}>
                    <button
                      type="button"
                      onClick={() => cat._id && goToProductsWithCategory(cat._id)}
                      className="text-[0.82rem] text-white/55 bg-transparent border-none cursor-pointer p-0 font-body hover:text-white transition-colors text-left"
                    >
                      {cat.name}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h5 className="font-display font-bold text-sm text-white uppercase tracking-wider mb-4">Contacto</h5>
            <ul className="list-none flex flex-col gap-2 p-0 m-0">
              {email && (
                <li>
                  <a href={`mailto:${email}`} className="text-[0.82rem] text-white/55 no-underline hover:text-white transition-colors">
                    {email}
                  </a>
                </li>
              )}
              {phones.map((phone, phoneIndex) => (
                <li key={phoneIndex}>
                  <a href={`tel:${phone}`} className="text-[0.82rem] text-white/55 no-underline hover:text-white transition-colors">
                    {phone}
                  </a>
                </li>
              ))}
              <li>
                <a href={whatsappLink} target="_blank" rel="noreferrer" className="text-[0.82rem] text-white/55 no-underline hover:text-white transition-colors">
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-2 border-t border-white/10 pt-6 sm:flex-row">
          <span className="text-[0.78rem] text-white/30">© 2024 ThermoPack. Todos los derechos reservados.</span>
          <span className="text-[0.78rem] text-white/30">Simplificamos tu vida 🌿</span>
        </div>
      </div>
    </footer>
  )
}
