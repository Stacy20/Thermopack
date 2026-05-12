import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="container py-5 text-center">
      <h1>404</h1>
      <p>Página no encontrada.</p>
      <Link to="/inicio">Volver al inicio</Link>
    </div>
  )
}
