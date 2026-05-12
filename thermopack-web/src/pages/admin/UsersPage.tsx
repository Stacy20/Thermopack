import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { UserTable } from './UserTable'

export function UsersPage() {
  const navigate = useNavigate()
  const { isLoggedIn, userCanCreateUsers } = useAuth()

  useEffect(() => {
    if (!isLoggedIn) navigate('/login')
    void userCanCreateUsers().then((ok) => {
      if (!ok) navigate('/admin/config/home')
    })
  }, [isLoggedIn, navigate, userCanCreateUsers])

  return (
    <div className="container py-3">
      <h2>Usuarios</h2>
      <UserTable />
    </div>
  )
}
