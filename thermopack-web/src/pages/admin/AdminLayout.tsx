import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { AdminNavbar } from '../../components/AdminNavbar'

export function AdminLayout() {
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoggedIn) navigate('/login', { replace: true })
  }, [isLoggedIn, navigate])

  if (!isLoggedIn) return null

  return (
    <div className="mb-5">
      <div className="mb-5">
        <AdminNavbar />
      </div>
      <Outlet />
    </div>
  )
}
