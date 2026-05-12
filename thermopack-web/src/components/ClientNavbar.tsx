import { NavLink, Link } from 'react-router-dom'

export function ClientNavbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#1c53a8' }}>
      <div className="container-fluid m-0">
        <Link className="navbar-brand" to="/inicio" style={{ color: '#f7f7f7' }}>
          <img
            src="/assets/LogoThermoPack.jpg"
            alt="ThermoPack"
            height={50}
            width={70}
            className="rounded-circle mt-1 centered-image"
            onError={(e) => {
              ;(e.target as HTMLImageElement).style.display = 'none'
            }}
          />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/inicio" end>
                Inicio
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/productos" end>
                Productos
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/servicios" end>
                Servicios
              </NavLink>
            </li>
          </ul>
          <NavLink to="/contactenos" end>
            {({ isActive }) => (
              <button type="button" className={'my-custom-button' + (isActive ? ' border border-dark' : '')}>
                Contáctenos
              </button>
            )}
          </NavLink>
        </div>
      </div>
    </nav>
  )
}
