import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { AdminNavbar } from '../../components/AdminNavbar'

export function AdminLayout() {
  const { isLoggedIn, authReady } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!authReady) return
    if (!isLoggedIn) navigate('/login', { replace: true })
  }, [authReady, isLoggedIn, navigate])

  if (!authReady) return null
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
