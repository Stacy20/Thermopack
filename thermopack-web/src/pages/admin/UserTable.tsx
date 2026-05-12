import { useEffect, useState, useCallback } from 'react'
import { createUser, deleteUserByEmail, getAllUsers, updateUserByEmail } from '../../api/users'
import { showAlert, showConfirmationAlert } from '../../lib/sweetAlert'

export type UsersTableRow = {
  userEmail: string
  privAddItems: boolean
  privEditItems: boolean
  privDelItems: boolean
  privCreateUsers: boolean
  editable: boolean
}

function yn(v: boolean) {
  return v ? 'Sí' : 'No'
}

export function UserTable() {
  const [users, setUsers] = useState<UsersTableRow[]>([])
  const [selectedUser, setSelectedUser] = useState<UsersTableRow | null>(null)
  const [email, setEmail] = useState('')
  const [privileges, setPrivileges] = useState([false, false, false, false])
  const [checkedPriv, setCheckedPriv] = useState([false, false, false, false])

  const load = useCallback(() => {
    void getAllUsers().then((list) => {
      setUsers(
        list.map((u) => ({
          userEmail: u.email,
          privAddItems: u.privileges[0] === 1,
          privEditItems: u.privileges[1] === 1,
          privDelItems: u.privileges[2] === 1,
          privCreateUsers: u.privileges[3] === 1,
          editable: false,
        }))
      )
    })
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)

  const reloadForm = () => {
    setEmail('')
    setPrivileges([false, false, false, false])
    setCheckedPriv([false, false, false, false])
    load()
  }

  const addUser = () => {
    for (const u of users) {
      if (u.userEmail === email || !isEmail(email)) {
        showAlert('Error', 'Ya existe un usuario con el mismo correo, por favor cambiarlo', 'error')
        return
      }
    }
    const privilegesAsNumbers = privileges.map((p) => (p ? 1 : 0))
    void createUser(email, privilegesAsNumbers).then((user) => {
      if (user.email === email) {
        showAlert('Éxito', 'Los datos se han guardado correctamente', 'success')
        reloadForm()
      }
    })
  }

  const existSuperAdminWithout = (user: UsersTableRow): boolean => {
    const index = users.indexOf(user)
    const others = [...users.slice(0, index), ...users.slice(index + 1)]
    for (const item of others) {
      if (item.privCreateUsers && item.privAddItems && item.privDelItems && item.privEditItems) {
        return true
      }
    }
    showAlert('Error', 'Debe existir un usuario super administrador', 'error')
    return false
  }

  const saveUser = (user: UsersTableRow, index: number) => {
    for (let i = 0; i < users.length; i++) {
      if (!isEmail(user.userEmail) || (users[i].userEmail === user.userEmail && i !== index)) {
        showAlert('Error', 'El email  esta repetido o es invalido', 'error')
        return
      }
    }
    if (!existSuperAdminWithout(user)) {
      if (!user.privAddItems || !user.privCreateUsers || !user.privDelItems || !user.privEditItems) {
        showAlert('Error', 'Para realizar cambios ocupa ser usuario super administrador', 'error')
        return
      }
    }
    showConfirmationAlert('Confirmación', '¿Está seguro que desea realizar cambios?', () => {
      void getAllUsers().then((all) => {
        const dbUser = all[index]
        if (!dbUser) return
        const privilegesAsNumbers = [
          user.privAddItems ? 1 : 0,
          user.privEditItems ? 1 : 0,
          user.privDelItems ? 1 : 0,
          user.privCreateUsers ? 1 : 0,
        ]
        void updateUserByEmail(dbUser.email, user.userEmail, dbUser.password, privilegesAsNumbers).then((response) => {
          if (response.message === 'Successfully modified') {
            setUsers((prev) =>
              prev.map((u) => (u === user ? { ...u, editable: false } : u))
            )
            setSelectedUser(null)
            showAlert('Éxito', 'El usuario se ha actualizado correctamente', 'success')
            window.location.reload()
          } else {
            showAlert('Error', 'No se puedo actualizar correctamente', 'error')
          }
        })
      })
    })
  }

  const deleteUser = (user: UsersTableRow) => {
    setSelectedUser(null)
    if (!existSuperAdminWithout(user)) return
    void deleteUserByEmail(user.userEmail).then((response) => {
      if (response.message === 'Successfully deleted') {
        showAlert('Éxito', 'El usuario se ha eliminado correctamente', 'success')
        setUsers((prev) => prev.filter((u) => u !== user))
      } else {
        showAlert('Error', 'No se ha podido eliminar correctamente el usuario', 'error')
      }
    })
  }

  const resetUser = (user: UsersTableRow, index: number) => {
    user.editable = false
    setSelectedUser(null)
    void getAllUsers().then((all) => {
      const db = all[index]
      if (!db) return
      user.userEmail = db.email
      user.privAddItems = db.privileges[0] === 1
      user.privEditItems = db.privileges[1] === 1
      user.privDelItems = db.privileges[2] === 1
      user.privCreateUsers = db.privileges[3] === 1
      setUsers([...users])
    })
  }

  const togglePriv = (idx: number) => {
    setPrivileges((p) => {
      const n = [...p]
      n[idx] = !n[idx]
      return n
    })
    setCheckedPriv((p) => {
      const n = [...p]
      n[idx] = !n[idx]
      return n
    })
  }

  return (
    <table className="table mx-auto mx-5" id="users-table">
      <thead>
        <tr>
          <th>Correo</th>
          <th>Agregar items</th>
          <th>Editar items</th>
          <th>Eliminar items</th>
          <th>Crear Usuarios</th>
          <th />
        </tr>
      </thead>
      <tbody>
        <tr className="align-middle">
          <td>
            <input type="text" className="border-0 bg-transparent" value={email} placeholder="Agregar un correo" onChange={(e) => setEmail(e.target.value)} />
          </td>
          {[0, 1, 2, 3].map((idx) => (
            <td key={idx}>
              <span className={`badge py-2 px-3 w-100 ${checkedPriv[idx] ? 'text-bg-success' : 'text-bg-danger'}`}>
                <input type="checkbox" checked={checkedPriv[idx]} onChange={() => togglePriv(idx)} />
                <label className="form-check-label ms-2">{yn(checkedPriv[idx])}</label>
              </span>
            </td>
          ))}
          <td className="w-25">
            <button
              type="button"
              className="btn btn-info text-light"
              onClick={() => {
                setSelectedUser(null)
                addUser()
              }}
            >
              <img src="/assets/icons/remove_person_icon.svg" alt="" className="me-1" />
              Agregar
            </button>
          </td>
        </tr>
        {users.map((user, index) => (
          <tr
            key={user.userEmail}
            className={'align-middle' + (user === selectedUser ? ' table-primary' : '')}
            onClick={() => setSelectedUser(user)}
          >
            <td>
              <input
                type="text"
                className="border-0 bg-transparent"
                style={{ width: `${Math.max(user.userEmail.length, 12)}ch` }}
                value={user.userEmail}
                disabled={!user.editable}
                onChange={(e) => {
                  const v = e.target.value
                  setUsers((prev) => prev.map((u) => (u === user ? { ...u, userEmail: v } : u)))
                }}
                onClick={(e) => e.stopPropagation()}
              />
            </td>
            {(['privAddItems', 'privEditItems', 'privDelItems', 'privCreateUsers'] as const).map((field) => (
              <td key={field}>
                <span className={`badge py-2 px-3 w-100 ${user[field] ? 'text-bg-success' : 'text-bg-danger'}`}>
                  <input
                    type="checkbox"
                    disabled={!user.editable}
                    checked={user[field]}
                    onChange={(e) => {
                      e.stopPropagation()
                      setUsers((prev) =>
                        prev.map((u) => (u === user ? { ...u, [field]: !u[field] } : u))
                      )
                    }}
                  />
                  <label className="form-check-label ms-2">{yn(user[field])}</label>
                </span>
              </td>
            ))}
            <td className="w-25">
              {selectedUser === user && !user.editable && (
                <>
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    onClick={(e) => {
                      e.stopPropagation()
                      setUsers((prev) =>
                        prev.map((u) => (u === user ? { ...u, editable: true } : u))
                      )
                    }}
                  >
                    <img src="/assets/icons/edit_note_icon.svg" alt="" className="me-1" />
                    Editar
                  </button>
                  <button type="button" className="btn btn-danger" onClick={(e) => { e.stopPropagation(); deleteUser(user) }}>
                    <img src="/assets/icons/remove_person_icon.svg" alt="" className="me-1" />
                    Eliminar
                  </button>
                </>
              )}
              {selectedUser === user && user.editable && (
                <>
                  <button type="button" className="btn btn-info text-light me-2" onClick={(e) => { e.stopPropagation(); saveUser(user, index) }}>
                    <img src="/assets/icons/check_circle_icon.svg" alt="" className="me-1" />
                    Guardar
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={(e) => { e.stopPropagation(); resetUser(user, index) }}>
                    <img src="/assets/icons/cancel_close_icon.svg" alt="" className="me-1" />
                    Cancelar
                  </button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
