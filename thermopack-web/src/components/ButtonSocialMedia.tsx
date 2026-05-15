import { useState } from 'react'
import { useContact } from '../hooks/useContact'

export function ButtonSocialMedia() {
  const { data: contactList } = useContact()
  const contact = (contactList as any)?.[0] ?? contactList
  const [open, setOpen] = useState(false)

  const facebookLink = contact?.facebookLink || '#'
  const youtubeLink = contact?.youtubeLink || '#'
  const instagramLink = contact?.instagramLink || '#'
  const whatsappLink = contact ? `https://wa.me/${contact.whatsappLink}` : '#'

  const items = [
    { label: 'WhatsApp', href: whatsappLink, bg: 'bg-[#25d366]', icon: '💬' },
    { label: 'Facebook', href: facebookLink, bg: 'bg-[#1877f2]', icon: '📘' },
    { label: 'Instagram', href: instagramLink, bg: 'ig-gradient', icon: '📸' },
    { label: 'YouTube', href: youtubeLink, bg: 'bg-[#ff0000]', icon: '▶️' },
  ]

  return (
    <div className="fixed bottom-8 right-6 z-50 flex flex-col items-end gap-3">
      {/* Item list */}
      <div className={`sf-items flex flex-col gap-2 items-end ${open ? 'open' : ''}`}>
        {items.map(({ label, href, bg, icon }) => (
          <a key={label} href={href} target="_blank" rel="noreferrer" className="flex items-center gap-2 no-underline">
            <span className="sf-item-label bg-gray-900 text-white text-xs font-medium px-3 py-1 rounded-md whitespace-nowrap">
              {label}
            </span>
            <div className={`w-[42px] h-[42px] ${bg} rounded-full flex items-center justify-center text-lg shadow-md hover:scale-110 transition-transform`}>
              {icon}
            </div>
          </a>
        ))}
      </div>

      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Redes sociales"
        className="w-[52px] h-[52px] bg-brand-green text-white rounded-full border-none cursor-pointer text-2xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
        style={{ boxShadow: '0 4px 20px rgba(34,197,94,.45)' }}
      >
        {open ? '✕' : '💬'}
      </button>
    </div>
  )
}
