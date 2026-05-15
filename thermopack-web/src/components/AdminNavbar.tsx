import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { Button } from './ui/button'

export function AdminNavbar() {
  const { logout, userLoggedIn } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const doLogout = () => {
    logout()
    navigate('/login')
  }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    'px-3 py-2 rounded-lg text-sm font-medium transition-colors ' +
    (isActive ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white')

  const links = [
    { to: '/admin/config/home', label: 'Inicio' },
    { to: '/admin/config/contact', label: 'Contactos' },
    { to: '/admin/config/nosotros', label: 'Nosotros' },
    { to: '/admin/products', label: 'Administrar Productos' },
    { to: '/admin/services', label: 'Administrar Servicios' },
    { to: '/admin/categories', label: 'Marcas y Categorías' },
    ...(userLoggedIn?.privileges?.[3] === 1 ? [{ to: '/admin/users', label: 'Crear usuarios' }] : []),
  ]

  return (
    <nav className="bg-[#1c53a8] shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/admin/config/home" className="flex-shrink-0">
            <img
              src="/assets/LogoThermoPack.jpg"
              alt="ThermoPack"
              className="h-12 w-20 rounded-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-1 flex-1 ml-6">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end className={navLinkClass}>
                {l.label}
              </NavLink>
            ))}
          </div>

          {/* Logout + mobile toggle */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={doLogout}
              className="hidden sm:inline-flex border-white/40 text-white bg-transparent hover:bg-white/10 hover:text-white"
            >
              <img src="/assets/icons/logout.svg" alt="" className="w-4 h-4" />
              Cerrar Sesión
            </Button>
            {/* Mobile hamburger */}
            <button
              type="button"
              className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors cursor-pointer border-none bg-transparent"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menú"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/20 bg-[#1c53a8] px-4 pb-4 pt-2 flex flex-col gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end
              className={navLinkClass}
              onClick={() => setMobileOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={doLogout}
            className="mt-2 border-white/40 text-white bg-transparent hover:bg-white/10 hover:text-white"
          >
            <img src="/assets/icons/logout.svg" alt="" className="w-4 h-4" />
            Cerrar Sesión
          </Button>
        </div>
      )}
    </nav>
  )
}
