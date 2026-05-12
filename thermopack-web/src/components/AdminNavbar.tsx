import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export function AdminNavbar() {
  const { logout, userLoggedIn } = useAuth()
  const navigate = useNavigate()

  const doLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#1c53a8' }}>
      <div className="container-fluid m-0">
        <Link className="navbar-brand" to="/admin/config/home" style={{ color: '#f7f7f7' }}>
          <img
            src="/assets/LogoThermoPack.jpg"
            alt="ThermoPack"
            height={50}
            width={85}
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
          data-bs-target="#adminNavbar"
          aria-controls="adminNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="adminNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link link-light" to="/admin/config/home" end>
                Inicio
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link link-light" to="/admin/config/contact" end>
                Contactos
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link link-light" to="/admin/products" end>
                Administrar Productos
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link link-light" to="/admin/services" end>
                Administrar Servicios
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link link-light" to="/admin/categories" end>
                Marcas y Categorías
              </NavLink>
            </li>
            {userLoggedIn?.privileges?.[3] === 1 && (
              <li className="nav-item">
                <NavLink className="nav-link link-light" to="/admin/users" end>
                  Crear usuarios
                </NavLink>
              </li>
            )}
          </ul>
        </div>
        <button type="button" className="btn btn-outline-light" onClick={doLogout}>
          <img src="/assets/icons/logout.svg" alt="" className="me-1" />
          Cerrar Sesión
        </button>
      </div>
    </nav>
  )
}
