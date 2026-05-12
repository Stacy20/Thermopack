import { Outlet } from 'react-router-dom'
import { ClientNavbar } from '../components/ClientNavbar'
import { ClientFooter } from '../components/ClientFooter'
import { ButtonSocialMedia } from '../components/ButtonSocialMedia'

export function ClientLayout() {
  return (
    <div className="mb-5">
      <div className="mb-5">
        <ClientNavbar />
      </div>
      <div className="mb-5">
        <ButtonSocialMedia />
        <Outlet />
      </div>
      <div className="mt-5">
        <ClientFooter />
      </div>
    </div>
  )
}
