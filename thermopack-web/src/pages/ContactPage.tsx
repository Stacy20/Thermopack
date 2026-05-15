import { useState } from 'react'
import { useContact } from '../hooks/useContact'
import { formatDescription } from '../utils/text'

export function ContactPage() {
  const { data: contactList } = useContact()
  const contact = (contactList as any)?.[0] ?? contactList

  const [form, setForm] = useState({ name: '', company: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const whatsappBase = contact ? `https://wa.me/${contact.whatsappLink}` : '#'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!contact) return
    const text = `Hola ThermoPack!\n\nNombre: ${form.name}\nEmpresa: ${form.company}\nAsunto: ${form.subject}\n\nMensaje:\n${form.message}`
    window.open(`${whatsappBase}?text=${encodeURIComponent(text)}`, '_blank')
    setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

  const images: string[] = contact?.images ?? []
  const phones: string[] = contact?.telephoneNumbers ?? []

  const infoCards = [
    {
      icon: '📍',
      label: 'Ubicación',
      content: (
        <div className="text-[0.88rem] text-gray-700">
          <p className="mb-1">{contact?.ubicationText || 'Costa Rica'}</p>
          <div className="flex gap-3">
            {contact?.ubicationGMLink && (
              <a href={contact.ubicationGMLink} target="_blank" rel="noreferrer" className="text-brand-600 no-underline hover:underline text-[0.82rem]">
                Google Maps
              </a>
            )}
            {contact?.ubicationWazeLink && (
              <a href={contact.ubicationWazeLink} target="_blank" rel="noreferrer" className="text-brand-600 no-underline hover:underline text-[0.82rem]">
                Waze
              </a>
            )}
          </div>
        </div>
      ),
    },
    {
      icon: '📞',
      label: 'Teléfonos',
      content: (
        <div className="flex flex-col gap-1">
          {phones.length > 0 ? phones.map((p, i) => (
            <a key={i} href={`tel:${p}`} className="text-[0.88rem] text-gray-700 no-underline hover:text-brand-600">{p}</a>
          )) : <span className="text-[0.88rem] text-gray-400">No disponible</span>}
        </div>
      ),
    },
    {
      icon: '✉️',
      label: 'Correo',
      content: contact?.email ? (
        <a href={`mailto:${contact.email}`} className="text-[0.88rem] text-brand-600 no-underline hover:underline">{contact.email}</a>
      ) : <span className="text-[0.88rem] text-gray-400">No disponible</span>,
    },
    {
      icon: '💬',
      label: 'WhatsApp',
      content: (
        <a
          href={contact ? `${whatsappBase}?text=${encodeURIComponent('¿Cómo puedo adquirir productos o servicios de ustedes?')}` : '#'}
          target="_blank"
          rel="noreferrer"
          className="text-[0.88rem] text-brand-600 no-underline hover:underline"
        >
          Escríbenos ahora
        </a>
      ),
    },
  ]

  return (
    <div className="pt-[70px] w-full min-w-0 overflow-x-hidden">
      {/* Hero */}
      <div className="hero-gradient wave-bottom relative isolate overflow-hidden pb-28 pt-14 text-center sm:pb-32 sm:pt-16 lg:pb-36">
        <div className="max-w-5xl mx-auto w-full min-w-0 px-5 sm:px-8 relative z-10">
          <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.35rem] font-extrabold text-white mb-4 leading-tight">
            Contáctenos
          </h1>
          {contact?.welcomeParagraph?.trim() ? (
            <div
              className="relative z-10 mx-auto max-w-2xl min-w-0 wrap-break-word text-[0.95rem] leading-relaxed text-white/85 text-balance [&_a]:text-blue-200 [&_a]:underline"
              dangerouslySetInnerHTML={{ __html: formatDescription(contact.welcomeParagraph) }}
            />
          ) : (
            <p className="relative z-10 mx-auto max-w-2xl min-w-0 wrap-break-word text-[0.95rem] leading-relaxed text-white/85 text-balance">
              Estamos listos para atenderle. Escríbanos por cualquiera de nuestros canales.
            </p>
          )}
        </div>
      </div>

      {/* Main */}
      <div className="max-w-5xl mx-auto w-full min-w-0 px-5 sm:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-12">
          {/* Left — info */}
          <div>
            <h2 className="font-display text-2xl font-extrabold text-gray-900 mb-6">Información de contacto</h2>

            {/* Hero image */}
            {images[0] && (
              <div className="rounded-2xl overflow-hidden mb-6 h-48">
                <img src={images[0]} alt="ThermoPack" className="w-full h-full object-cover" />
              </div>
            )}

            <div className="flex flex-col gap-3">
              {infoCards.map(({ icon, label, content }) => (
                <div
                  key={label}
                  className="bg-white border border-gray-200 rounded-2xl p-4 flex items-start gap-4 hover:border-brand-300 hover:shadow-sm transition-all"
                >
                  <div className="w-11 h-11 bg-brand-50 rounded-xl flex items-center justify-center text-xl shrink-0">
                    {icon}
                  </div>
                  <div>
                    <div className="text-[0.72rem] font-bold text-brand-500 uppercase tracking-wider mb-1">{label}</div>
                    {content}
                  </div>
                </div>
              ))}
            </div>

            {/* Extra images */}
            {(images[1] || images[2]) && (
              <div className="grid grid-cols-2 gap-3 mt-6">
                {images[1] && (
                  <div className="rounded-2xl overflow-hidden h-32">
                    <img src={images[1]} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                {images[2] && (
                  <div className="rounded-2xl overflow-hidden h-32">
                    <img src={images[2]} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right — form */}
          <div className="bg-white border border-gray-200 rounded-3xl p-10 shadow-sm">
            <h2 className="font-display text-2xl font-extrabold text-gray-900 mb-6">Envíenos un mensaje</h2>
            <div className="h-px bg-gray-100 mb-6" />

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.8rem] font-semibold text-gray-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Juan Pérez"
                    className="w-full px-4 py-3 rounded-xl border-[1.5px] border-gray-200 bg-gray-50 text-[0.88rem] text-gray-900 outline-none transition-all focus:border-brand-400 focus:bg-white font-body"
                  />
                </div>
                <div>
                  <label className="block text-[0.8rem] font-semibold text-gray-700 mb-1">Empresa</label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                    placeholder="Mi Empresa S.A."
                    className="w-full px-4 py-3 rounded-xl border-[1.5px] border-gray-200 bg-gray-50 text-[0.88rem] text-gray-900 outline-none transition-all focus:border-brand-400 focus:bg-white font-body"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[0.8rem] font-semibold text-gray-700 mb-1">Asunto</label>
                <input
                  type="text"
                  required
                  value={form.subject}
                  onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                  placeholder="Consulta sobre productos"
                  className="w-full px-4 py-3 rounded-xl border-[1.5px] border-gray-200 bg-gray-50 text-[0.88rem] text-gray-900 outline-none transition-all focus:border-brand-400 focus:bg-white font-body"
                />
              </div>

              <div>
                <label className="block text-[0.8rem] font-semibold text-gray-700 mb-1">Mensaje</label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  placeholder="Describa su consulta o requerimiento..."
                  className="w-full px-4 py-3 rounded-xl border-[1.5px] border-gray-200 bg-gray-50 text-[0.88rem] text-gray-900 outline-none transition-all focus:border-brand-400 focus:bg-white resize-y font-body"
                />
              </div>

              <button
                type="submit"
                className={`w-full py-4 rounded-full border-none font-body font-bold text-[0.95rem] cursor-pointer transition-all mt-1 ${
                  sent ? 'bg-brand-green text-white' : 'bg-brand-800 text-white hover:bg-brand-500 hover:-translate-y-0.5'
                }`}
              >
                {sent ? '✓ Mensaje enviado por WhatsApp' : '📨 Enviar por WhatsApp'}
              </button>
            </form>
          </div>
        </div>

        {/* Social section */}
        <div className="mt-16 bg-gray-50 border-t border-gray-200 rounded-3xl py-10 text-center">
          <h2 className="font-display text-2xl font-extrabold text-gray-900 mb-2">Síguenos en redes</h2>
          <p className="text-[0.9rem] text-gray-500 mb-8">Estamos activos en todas las plataformas</p>
          <div className="flex gap-4 justify-center flex-wrap">
            {[
              { label: 'WhatsApp', icon: '💬', href: whatsappBase },
              { label: 'Facebook', icon: '📘', href: contact?.facebookLink || '#' },
              { label: 'Instagram', icon: '📸', href: contact?.instagramLink || '#' },
              { label: 'YouTube', icon: '▶️', href: contact?.youtubeLink || '#' },
            ].map(({ label, icon, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="bg-white border border-gray-200 rounded-2xl px-8 py-5 flex items-center gap-3 no-underline hover:-translate-y-1 hover:shadow-lg transition-all min-w-[150px] justify-center"
              >
                <span className="text-2xl">{icon}</span>
                <span className="text-[0.85rem] font-semibold text-gray-900">{label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
