import { useState } from 'react'
import { useAllUsers, useCreateUser, useUpdateUser, useDeleteUser } from '../../hooks/useUsers'
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

function toTableRow(user: { email: string; privileges: number[]; password: string }): UsersTableRow {
  return {
    userEmail: user.email,
    privAddItems: user.privileges[0] === 1,
    privEditItems: user.privileges[1] === 1,
    privDelItems: user.privileges[2] === 1,
    privCreateUsers: user.privileges[3] === 1,
    editable: false,
  }
}

export function UserTable() {
  const { data: usersData = [], refetch } = useAllUsers()
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()
  const deleteUser = useDeleteUser()

  const [rows, setRows] = useState<UsersTableRow[]>([])
  const [selectedUser, setSelectedUser] = useState<UsersTableRow | null>(null)
  const [newEmail, setNewEmail] = useState('')
  const [newPrivileges, setNewPrivileges] = useState([false, false, false, false])

  const dbUsers = usersData as Array<{ email: string; privileges: number[]; password: string }>

  if (rows.length === 0 && dbUsers.length > 0) {
    setRows(dbUsers.map(toTableRow))
  }

  const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)

  const existSuperAdminWithout = (user: UsersTableRow): boolean => {
    const others = rows.filter((u) => u !== user)
    const hasSuperAdmin = others.some(
      (u) => u.privCreateUsers && u.privAddItems && u.privDelItems && u.privEditItems
    )
    if (!hasSuperAdmin) {
      showAlert('Error', 'Debe existir un usuario super administrador', 'error')
    }
    return hasSuperAdmin
  }

  const addUser = () => {
    if (rows.some((u) => u.userEmail === newEmail) || !isEmail(newEmail)) {
      showAlert('Error', 'Ya existe un usuario con el mismo correo, por favor cambiarlo', 'error')
      return
    }
    const privileges = newPrivileges.map((p) => (p ? 1 : 0))
    createUser.mutate(
      { email: newEmail, privileges },
      {
        onSuccess: (user) => {
          if ((user as { email?: string }).email === newEmail) {
            showAlert('Éxito', 'Los datos se han guardado correctamente', 'success')
            setNewEmail('')
            setNewPrivileges([false, false, false, false])
            void refetch().then((result) => {
              if (result.data) setRows((result.data as typeof dbUsers).map(toTableRow))
            })
          }
        },
      }
    )
  }

  const saveUser = (row: UsersTableRow, index: number) => {
    for (let i = 0; i < rows.length; i++) {
      if (!isEmail(row.userEmail) || (rows[i].userEmail === row.userEmail && i !== index)) {
        showAlert('Error', 'El email está repetido o es inválido', 'error')
        return
      }
    }
    if (!existSuperAdminWithout(row)) {
      if (!row.privAddItems || !row.privCreateUsers || !row.privDelItems || !row.privEditItems) {
        showAlert('Error', 'Para realizar cambios ocupa ser usuario super administrador', 'error')
        return
      }
    }
    showConfirmationAlert('Confirmación', '¿Está seguro que desea realizar cambios?', () => {
      const dbUser = dbUsers[index]
      if (!dbUser) return
      const privileges = [
        row.privAddItems ? 1 : 0,
        row.privEditItems ? 1 : 0,
        row.privDelItems ? 1 : 0,
        row.privCreateUsers ? 1 : 0,
      ]
      updateUser.mutate(
        { email: dbUser.email, newEmail: row.userEmail, password: dbUser.password, privileges },
        {
          onSuccess: (response) => {
            if ((response as { message?: string }).message === 'Successfully modified') {
              setRows((prev) => prev.map((u) => (u === row ? { ...u, editable: false } : u)))
              setSelectedUser(null)
              showAlert('Éxito', 'El usuario se ha actualizado correctamente', 'success')
              window.location.reload()
            } else {
              showAlert('Error', 'No se pudo actualizar correctamente', 'error')
            }
          },
        }
      )
    })
  }

  const handleDeleteUser = (row: UsersTableRow) => {
    setSelectedUser(null)
    if (!existSuperAdminWithout(row)) return
    deleteUser.mutate(row.userEmail, {
      onSuccess: (response) => {
        if ((response as { message?: string }).message === 'Successfully deleted') {
          showAlert('Éxito', 'El usuario se ha eliminado correctamente', 'success')
          setRows((prev) => prev.filter((u) => u !== row))
        } else {
          showAlert('Error', 'No se ha podido eliminar correctamente el usuario', 'error')
        }
      },
    })
  }

  const resetRow = (row: UsersTableRow, index: number) => {
    const db = dbUsers[index]
    if (!db) return
    setRows((prev) =>
      prev.map((u) =>
        u === row
          ? {
              ...u,
              editable: false,
              userEmail: db.email,
              privAddItems: db.privileges[0] === 1,
              privEditItems: db.privileges[1] === 1,
              privDelItems: db.privileges[2] === 1,
              privCreateUsers: db.privileges[3] === 1,
            }
          : u
      )
    )
    setSelectedUser(null)
  }

  const toggleNewPriv = (idx: number) => {
    setNewPrivileges((prev) => prev.map((v, i) => (i === idx ? !v : v)))
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
            <input
              type="text"
              className="border-0 bg-transparent"
              value={newEmail}
              placeholder="Agregar un correo"
              onChange={(e) => setNewEmail(e.target.value)}
            />
          </td>
          {[0, 1, 2, 3].map((idx) => (
            <td key={idx}>
              <span className={`badge py-2 px-3 w-100 ${newPrivileges[idx] ? 'text-bg-success' : 'text-bg-danger'}`}>
                <input type="checkbox" checked={newPrivileges[idx]} onChange={() => toggleNewPriv(idx)} />
                <label className="form-check-label ms-2">{yn(newPrivileges[idx])}</label>
              </span>
            </td>
          ))}
          <td className="w-25">
            <button type="button" className="btn btn-info text-light" onClick={() => { setSelectedUser(null); addUser() }}>
              <img src="/assets/icons/remove_person_icon.svg" alt="" className="me-1" />
              Agregar
            </button>
          </td>
        </tr>
        {rows.map((row, index) => (
          <tr
            key={row.userEmail}
            className={'align-middle' + (row === selectedUser ? ' table-primary' : '')}
            onClick={() => setSelectedUser(row)}
          >
            <td>
              <input
                type="text"
                className="border-0 bg-transparent"
                style={{ width: `${Math.max(row.userEmail.length, 12)}ch` }}
                value={row.userEmail}
                disabled={!row.editable}
                onChange={(e) => {
                  const v = e.target.value
                  setRows((prev) => prev.map((u) => (u === row ? { ...u, userEmail: v } : u)))
                }}
                onClick={(e) => e.stopPropagation()}
              />
            </td>
            {(['privAddItems', 'privEditItems', 'privDelItems', 'privCreateUsers'] as const).map((field) => (
              <td key={field}>
                <span className={`badge py-2 px-3 w-100 ${row[field] ? 'text-bg-success' : 'text-bg-danger'}`}>
                  <input
                    type="checkbox"
                    disabled={!row.editable}
                    checked={row[field]}
                    onChange={(e) => {
                      e.stopPropagation()
                      setRows((prev) => prev.map((u) => (u === row ? { ...u, [field]: !u[field] } : u)))
                    }}
                  />
                  <label className="form-check-label ms-2">{yn(row[field])}</label>
                </span>
              </td>
            ))}
            <td className="w-25">
              {selectedUser === row && !row.editable && (
                <>
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    onClick={(e) => {
                      e.stopPropagation()
                      setRows((prev) => prev.map((u) => (u === row ? { ...u, editable: true } : u)))
                    }}
                  >
                    <img src="/assets/icons/edit_note_icon.svg" alt="" className="me-1" />
                    Editar
                  </button>
                  <button type="button" className="btn btn-danger" onClick={(e) => { e.stopPropagation(); handleDeleteUser(row) }}>
                    <img src="/assets/icons/remove_person_icon.svg" alt="" className="me-1" />
                    Eliminar
                  </button>
                </>
              )}
              {selectedUser === row && row.editable && (
                <>
                  <button type="button" className="btn btn-info text-light me-2" onClick={(e) => { e.stopPropagation(); saveUser(row, index) }}>
                    <img src="/assets/icons/check_circle_icon.svg" alt="" className="me-1" />
                    Guardar
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={(e) => { e.stopPropagation(); resetRow(row, index) }}>
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
