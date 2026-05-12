import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import bcrypt from 'bcryptjs'
import { useAuth } from '../auth/AuthContext'
import { getUserByEmail, forgotPassword } from '../api/users'
import { showAlert } from '../lib/sweetAlert'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordFieldType, setPasswordFieldType] = useState<'password' | 'text'>('password')
  const [passwordIcon, setPasswordIcon] = useState('/assets/icons/visibility.svg')

  const submitUserLogin = () => {
    if (email === '') return
    void getUserByEmail(email).then((user) => {
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
    void getUserByEmail(email).then((user) => {
      if (!user || Object.keys(user).length === 0) {
        showAlert('Error', 'El correo ingresado no se encuentra ingresado', 'error')
        return
      }
      void forgotPassword(email, user.privileges)
      showAlert('Información', 'Se le ha enviado a su correo la nueva contraseña', 'info')
    })
  }

  return (
    <div className="container py-5" style={{ maxWidth: 480 }}>
      <h2>Iniciar sesión</h2>
      <div className="mb-3">
        <label className="form-label">Correo</label>
        <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="mb-3">
        <label className="form-label">Contraseña</label>
        <div className="input-group">
          <input
            type={passwordFieldType}
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="button" className="btn btn-outline-secondary" onClick={togglePasswordVisibility}>
            <img src={passwordIcon} alt="" width={20} height={20} />
          </button>
        </div>
      </div>
      <button type="button" className="btn btn-primary me-2" onClick={submitUserLogin}>
        Entrar
      </button>
      <button type="button" className="btn btn-link" onClick={forgot}>
        Olvidé mi contraseña
      </button>
    </div>
  )
}
