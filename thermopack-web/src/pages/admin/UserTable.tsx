import { useState } from 'react'
import { useAllUsers, useCreateUser, useUpdateUser, useDeleteUser } from '../../hooks/useUsers'
import { showAlert, showConfirmationAlert } from '../../lib/sweetAlert'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'

export type UsersTableRow = {
  userEmail: string
  privAddItems: boolean
  privEditItems: boolean
  privDelItems: boolean
  privCreateUsers: boolean
  editable: boolean
}

function yn(v: boolean) { return v ? 'Sí' : 'No' }

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
  if (rows.length === 0 && dbUsers.length > 0) setRows(dbUsers.map(toTableRow))

  const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)

  const existSuperAdminWithout = (user: UsersTableRow): boolean => {
    const ok = rows.filter((u) => u !== user).some((u) => u.privCreateUsers && u.privAddItems && u.privDelItems && u.privEditItems)
    if (!ok) showAlert('Error', 'Debe existir un usuario super administrador', 'error')
    return ok
  }

  const addUser = () => {
    if (rows.some((u) => u.userEmail === newEmail) || !isEmail(newEmail)) {
      showAlert('Error', 'Correo inválido o ya existe', 'error'); return
    }
    createUser.mutate({ email: newEmail, privileges: newPrivileges.map((p) => (p ? 1 : 0)) }, {
      onSuccess: (user) => {
        if ((user as { email?: string }).email === newEmail) {
          showAlert('Éxito', 'Usuario creado correctamente', 'success')
          setNewEmail(''); setNewPrivileges([false, false, false, false])
          void refetch().then((r) => { if (r.data) setRows((r.data as typeof dbUsers).map(toTableRow)) })
        }
      },
    })
  }

  const saveUser = (row: UsersTableRow, index: number) => {
    for (let i = 0; i < rows.length; i++) {
      if (!isEmail(row.userEmail) || (rows[i].userEmail === row.userEmail && i !== index)) {
        showAlert('Error', 'El email está repetido o es inválido', 'error'); return
      }
    }
    if (!existSuperAdminWithout(row)) {
      if (!row.privAddItems || !row.privCreateUsers || !row.privDelItems || !row.privEditItems) {
        showAlert('Error', 'Para realizar cambios ocupa ser super administrador', 'error'); return
      }
    }
    showConfirmationAlert('Confirmación', '¿Está seguro que desea realizar cambios?', () => {
      const db = dbUsers[index]; if (!db) return
      updateUser.mutate({ email: db.email, newEmail: row.userEmail, password: db.password, privileges: [row.privAddItems ? 1 : 0, row.privEditItems ? 1 : 0, row.privDelItems ? 1 : 0, row.privCreateUsers ? 1 : 0] }, {
        onSuccess: (res) => {
          if ((res as { message?: string }).message === 'Successfully modified') {
            setRows((prev) => prev.map((u) => u === row ? { ...u, editable: false } : u))
            setSelectedUser(null)
            showAlert('Éxito', 'Usuario actualizado', 'success')
            window.location.reload()
          } else showAlert('Error', 'No se pudo actualizar', 'error')
        },
      })
    })
  }

  const handleDeleteUser = (row: UsersTableRow) => {
    setSelectedUser(null)
    if (!existSuperAdminWithout(row)) return
    deleteUser.mutate(row.userEmail, {
      onSuccess: (res) => {
        if ((res as { message?: string }).message === 'Successfully deleted') {
          showAlert('Éxito', 'Usuario eliminado', 'success')
          setRows((prev) => prev.filter((u) => u !== row))
        } else showAlert('Error', 'No se pudo eliminar', 'error')
      },
    })
  }

  const resetRow = (row: UsersTableRow, index: number) => {
    const db = dbUsers[index]; if (!db) return
    setRows((prev) => prev.map((u) => u === row ? { ...u, editable: false, userEmail: db.email, privAddItems: db.privileges[0] === 1, privEditItems: db.privileges[1] === 1, privDelItems: db.privileges[2] === 1, privCreateUsers: db.privileges[3] === 1 } : u))
    setSelectedUser(null)
  }

  const privFields = ['privAddItems', 'privEditItems', 'privDelItems', 'privCreateUsers'] as const

  const PrivBadge = ({ active, disabled, onChange }: { active: boolean; disabled?: boolean; onChange: () => void }) => (
    <label className="cursor-pointer">
      <input type="checkbox" className="sr-only" checked={active} disabled={disabled} onChange={onChange} />
      <Badge variant={active ? 'default' : 'destructive'} className={`w-full justify-center ${active ? 'bg-green-600 hover:bg-green-600' : ''} cursor-pointer`}>
        {yn(active)}
      </Badge>
    </label>
  )

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Correo</TableHead>
            <TableHead className="text-center">Agregar</TableHead>
            <TableHead className="text-center">Editar</TableHead>
            <TableHead className="text-center">Eliminar</TableHead>
            <TableHead className="text-center">Crear usuarios</TableHead>
            <TableHead className="w-44" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* New user row */}
          <TableRow className="bg-muted/30">
            <TableCell>
              <Input
                type="text"
                value={newEmail}
                placeholder="nuevo@email.com"
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </TableCell>
            {[0, 1, 2, 3].map((idx) => (
              <TableCell key={idx} className="text-center">
                <PrivBadge active={newPrivileges[idx]} onChange={() => setNewPrivileges((prev) => prev.map((v, i) => i === idx ? !v : v))} />
              </TableCell>
            ))}
            <TableCell>
              <Button size="sm" className="bg-sky-500 hover:bg-sky-600 text-white" onClick={addUser}>
                Agregar
              </Button>
            </TableCell>
          </TableRow>

          {rows.map((row, index) => (
            <TableRow
              key={row.userEmail}
              className={'cursor-pointer ' + (row === selectedUser ? 'bg-brand-50' : '')}
              onClick={() => setSelectedUser(row)}
            >
              <TableCell>
                <input
                  type="text"
                  className="border-0 bg-transparent text-sm outline-none disabled:opacity-60 w-full"
                  value={row.userEmail}
                  disabled={!row.editable}
                  onChange={(e) => { const v = e.target.value; setRows((prev) => prev.map((u) => u === row ? { ...u, userEmail: v } : u)) }}
                  onClick={(e) => e.stopPropagation()}
                />
              </TableCell>
              {privFields.map((field) => (
                <TableCell key={field} className="text-center">
                  <PrivBadge
                    active={row[field]}
                    disabled={!row.editable}
                    onChange={() => { setRows((prev) => prev.map((u) => u === row ? { ...u, [field]: !u[field] } : u)) }}
                  />
                </TableCell>
              ))}
              <TableCell>
                {selectedUser === row && !row.editable && (
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button size="sm" className="bg-brand-800 hover:bg-brand-700 text-white"
                      onClick={() => setRows((prev) => prev.map((u) => u === row ? { ...u, editable: true } : u))}>
                      Editar
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteUser(row)}>
                      Eliminar
                    </Button>
                  </div>
                )}
                {selectedUser === row && row.editable && (
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button size="sm" className="bg-sky-500 hover:bg-sky-600 text-white" onClick={() => saveUser(row, index)}>
                      Guardar
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => resetRow(row, index)}>
                      Cancelar
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
