import { Outlet } from 'react-router-dom'
import { ClientNavbar } from '../components/ClientNavbar'
import { ClientFooter } from '../components/ClientFooter'
import { ButtonSocialMedia } from '../components/ButtonSocialMedia'

export function ClientLayout() {
  return (
    <div className="font-body flex min-h-screen flex-col">
      <ClientNavbar />
      <ButtonSocialMedia />
      <main className="min-w-0 w-full shrink-0 pb-12 sm:pb-16 lg:pb-20">
        <Outlet />
      </main>
      <div className="min-h-0 min-w-0 flex-1" aria-hidden />
      <ClientFooter />
    </div>
  )
}
