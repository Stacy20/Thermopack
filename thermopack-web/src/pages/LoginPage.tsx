import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import bcrypt from 'bcryptjs'
import emailjs from '@emailjs/browser'
import { useAuth } from '../auth/AuthContext'
import apiClient from '../api/client'
import { showAlert } from '../lib/sweetAlert'
import type { Users, DBResponse } from '../types/users'

function generateSecurePassword(length: number): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+='
  let password = ''
  for (let i = 0; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)]
  }
  return password
}

async function sendEmailWithPassword(email: string, password: string): Promise<void> {
  emailjs.init('r-AFDRCTXu8pq0Vfg')
  await emailjs.send('service_dffyfl6', 'template_zbgo64g', {
    contrasenha: password,
    to_email: email,
  })
}

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordFieldType, setPasswordFieldType] = useState<'password' | 'text'>('password')
  const [passwordIcon, setPasswordIcon] = useState('/assets/icons/visibility.svg')

  const submitUserLogin = () => {
    if (email === '') return
    void apiClient
      .get<Users>(`users/${encodeURIComponent(email)}`)
      .then((r) => r.data)
      .then((user) => {
        if (!user || Object.keys(user).length === 0) {
          showAlert('Error', 'El correo no se encuentra registrado', 'error')
          return
        }
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) {
            showAlert('Error', `Error al comparar contraseñas: ${String(err)}`, 'error')
            return
          }
          if (!result) {
            showAlert('Error', 'Contraseña equivocada', 'error')
            return
          }
          login(user)
          navigate('/admin/config/home')
        })
      })
      .catch(() => showAlert('Error', 'El correo no se encuentra registrado', 'error'))
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    submitUserLogin()
  }

  const togglePasswordVisibility = () => {
    if (passwordFieldType === 'password') {
      setPasswordFieldType('text')
      setPasswordIcon('/assets/icons/visibility_off.svg')
    } else {
      setPasswordFieldType('password')
      setPasswordIcon('/assets/icons/visibility.svg')
    }
  }

  const forgot = () => {
    if (email === '') {
      showAlert('Error', 'Debe ingresar un correo', 'error')
      return
    }
    void apiClient
      .get<Users>(`users/${encodeURIComponent(email)}`)
      .then((r) => r.data)
      .then(async (user) => {
        if (!user || Object.keys(user).length === 0) {
          showAlert('Error', 'El correo ingresado no se encuentra registrado', 'error')
          return
        }
        const passwordGenerated = generateSecurePassword(12)
        await sendEmailWithPassword(email, passwordGenerated)
        const hashed = bcrypt.hashSync(passwordGenerated, 10)
        await apiClient.put<DBResponse>(`users/${encodeURIComponent(email)}`, {
          newEmail: email,
          password: hashed,
          privileges: user.privileges,
        })
        showAlert('Información', 'Se le ha enviado a su correo la nueva contraseña', 'info')
      })
      .catch(() => showAlert('Error', 'El correo ingresado no se encuentra registrado', 'error'))
  }

  const inputClass =
    'w-full rounded-lg border border-slate-200/80 bg-[#e8eef5] px-3 py-2.5 text-neutral-900 placeholder:text-neutral-400 outline-none ring-[#1c53a8]/30 focus:border-[#1c53a8] focus:ring-2'

  return (
    <div className="min-h-dvh grid grid-cols-1 bg-gradient-to-t from-[#97bfe7] to-[#d6e7f8] md:grid-cols-12">
      <div className="md:col-span-8 flex flex-col items-center justify-center px-6 py-10 md:min-h-dvh md:py-6">
        <img
          src="/assets/images/ThermoPack_logo_no-bg.png"
          className="max-h-48 w-auto max-w-full object-contain md:max-h-none md:max-w-lg"
          alt="ThermoPack"
        />
      </div>

      <div className="md:col-span-4 flex flex-col justify-center bg-white px-6 py-10 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] md:min-h-dvh md:px-8 md:py-6 md:shadow-none">
        <h2 className="text-center mb-4 text-3xl font-semibold text-neutral-800 md:text-4xl">¡Bienvenido!</h2>

        <form className="mt-4 space-y-5" onSubmit={onSubmit}>
          <div>
            <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium text-neutral-700">
              Correo Electrónico
            </label>
            <input
              id="login-email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="Correo Electrónico"
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="login-password" className="mb-1.5 block text-sm font-medium text-neutral-700">
              Contraseña
            </label>
            <div className="flex items-stretch gap-1">
              <input
                id="login-password"
                type={passwordFieldType}
                name="password"
                autoComplete="current-password"
                placeholder="Contraseña"
                className={`${inputClass} flex-1 min-w-0`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="shrink-0 rounded-lg border border-slate-200/80 bg-neutral-50 px-2.5 transition-colors hover:bg-neutral-100"
                onClick={togglePasswordVisibility}
                aria-label={passwordFieldType === 'password' ? 'Mostrar contraseña' : 'Ocultar contraseña'}
              >
                <img src={passwordIcon} alt="" width={22} height={22} className="opacity-80" />
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-lg bg-[#1c53a8] py-3 text-lg font-medium text-white shadow-sm transition-colors hover:bg-[#164a96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1c53a8] focus-visible:ring-offset-2"
          >
            Ingresar
          </button>
        </form>

        <p className="mt-3 text-center">
          <button
            type="button"
            className="text-[#1c53a8] underline underline-offset-2 hover:text-[#164a96]"
            onClick={forgot}
          >
            Olvidé mi contraseña
          </button>
        </p>
      </div>
    </div>
  )
}
