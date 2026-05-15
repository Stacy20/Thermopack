import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { UserTable } from './UserTable'

export function UsersPage() {
  const navigate = useNavigate()
  const { isLoggedIn, userCanCreateUsers, authReady } = useAuth()

  useEffect(() => {
    if (!authReady) return
    if (!isLoggedIn) navigate('/login')
    void userCanCreateUsers().then((ok) => {
      if (!ok) navigate('/admin/config/home')
    })
  }, [authReady, isLoggedIn, navigate, userCanCreateUsers])

  return (
    <div className="max-w-5xl mx-auto px-6 py-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Usuarios</h2>
      <UserTable />
    </div>
  )
}
