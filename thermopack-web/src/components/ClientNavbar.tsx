import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
// import { ShoppingCart } from 'lucide-react'

const navItems = [
  { to: '/inicio', label: 'Inicio' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/productos', label: 'Productos' },
  { to: '/servicios', label: 'Servicios' },
  { to: '/contactenos', label: 'Contacto' },
] as const

export function ClientNavbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="nav-blur fixed top-0 left-0 right-0 z-50 h-[70px] bg-white/95 border-b border-gray-200 flex items-center">
      <div className="max-w-5xl mx-auto w-full min-w-0 px-5 sm:px-8 grid grid-cols-[auto_1fr_auto] items-center gap-3 sm:gap-4 h-full">
        {/* Logo */}
        <Link to="/inicio" className="flex items-center gap-2 no-underline shrink-0" onClick={() => setMenuOpen(false)}>
          <div className="w-10 h-10 bg-brand-800 rounded-xl flex items-center justify-center overflow-hidden">
            <img
              src="/assets/LogoThermoPack.jpg"
              alt="ThermoPack"
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          </div>
          <span className="font-display font-bold text-brand-800 text-[1.05rem] leading-tight">
            Thermo<span className="text-brand-green">Pack</span>
          </span>
        </Link>

        {/* Desktop links — centered in the middle column */}
        <div className="hidden md:flex items-center justify-center gap-5 lg:gap-6 min-w-0">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                `text-[0.88rem] font-medium no-underline transition-colors duration-200 border-none bg-transparent cursor-pointer font-body whitespace-nowrap py-2 ${
                  isActive ? 'text-brand-500 font-semibold' : 'text-gray-700 hover:text-brand-500'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center justify-end gap-2 sm:gap-3 shrink-0">

          <NavLink
            to="/contactenos"
            end
            className={({ isActive }) =>
              `hidden md:inline-flex items-center justify-center rounded-full font-semibold text-[0.85rem] px-5 py-2.5 min-h-[42px] no-underline font-body transition-colors duration-200 border-none cursor-pointer whitespace-nowrap ${
                isActive ? 'bg-brand-500 text-white' : 'bg-brand-800 text-white hover:bg-brand-500'
              }`
            }
          >
            Contáctenos
          </NavLink>

          {/* Hamburger */}
          <button
            type="button"
            className="md:hidden bg-transparent border-none cursor-pointer p-2 text-brand-800"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Menú"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-[70px] left-0 right-0 bg-white border-b border-gray-200 shadow-lg md:hidden z-50">
          <div className="max-w-5xl mx-auto px-5 sm:px-8 flex flex-col py-4 gap-3">
            {navItems.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `text-sm font-medium no-underline py-2 border-b border-gray-100 ${
                    isActive ? 'text-brand-500 font-semibold' : 'text-gray-700'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
