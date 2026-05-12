import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { Users } from '../types/users'
import { getUserByEmail } from '../api/users'

const LS_LOGGED = 'isLoggedIn'
const LS_EMAIL = 'userLoggedIn'
const LS_LAST = 'lastLogin'

function dayHasntPassed(lastLogin: string): boolean {
  const last = new Date(lastLogin)
  const diffHours = (Date.now() - last.getTime()) / (1000 * 60 * 60)
  return diffHours < 24
}

function pollPrivilege(
  getUser: () => Users | null,
  index: number
): Promise<boolean> {
  return new Promise((resolve) => {
    const started = Date.now()
    const id = window.setInterval(() => {
      const u = getUser()
      if (u?.privileges && u.privileges.length > index) {
        window.clearInterval(id)
        resolve(u.privileges[index] === 1)
      } else if (Date.now() - started > 8000) {
        window.clearInterval(id)
        resolve(false)
      }
    }, 100)
  })
}

type AuthContextValue = {
  isLoggedIn: boolean
  userLoggedIn: Users | null
  login: (user: Users) => void
  logout: () => void
  userCanAdd: () => Promise<boolean>
  userCanEdit: () => Promise<boolean>
  userCanDelete: () => Promise<boolean>
  userCanCreateUsers: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userLoggedIn, setUserLoggedIn] = useState<Users | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const userRef = useRef<Users | null>(null)
  useEffect(() => {
    userRef.current = userLoggedIn
  }, [userLoggedIn])

  useEffect(() => {
    let logged = localStorage.getItem(LS_LOGGED) === 'true'
    const last = localStorage.getItem(LS_LAST)
    if (!last || !dayHasntPassed(last)) logged = false
    if (!logged) {
      setIsLoggedIn(false)
      setUserLoggedIn(null)
      return
    }
    const email = localStorage.getItem(LS_EMAIL)
    if (!email) {
      setIsLoggedIn(false)
      return
    }
    getUserByEmail(email).then((u) => {
      if (u && u.email) {
        setUserLoggedIn(u)
        setIsLoggedIn(true)
      } else {
        setIsLoggedIn(false)
        setUserLoggedIn(null)
        localStorage.setItem(LS_LOGGED, 'false')
      }
    })
  }, [])

  const login = useCallback((user: Users) => {
    setUserLoggedIn(user)
    setIsLoggedIn(true)
    localStorage.setItem(LS_LOGGED, 'true')
    localStorage.setItem(LS_EMAIL, user.email)
    localStorage.setItem(LS_LAST, new Date().toISOString())
  }, [])

  const logout = useCallback(() => {
    setUserLoggedIn(null)
    setIsLoggedIn(false)
    localStorage.setItem(LS_EMAIL, '')
    localStorage.setItem(LS_LOGGED, 'false')
  }, [])

  const userCanAdd = useCallback(
    () => pollPrivilege(() => userRef.current, 0),
    []
  )
  const userCanEdit = useCallback(
    () => pollPrivilege(() => userRef.current, 1),
    []
  )
  const userCanDelete = useCallback(
    () => pollPrivilege(() => userRef.current, 2),
    []
  )
  const userCanCreateUsers = useCallback(
    () => pollPrivilege(() => userRef.current, 3),
    []
  )

  const value = useMemo(
    () => ({
      isLoggedIn,
      userLoggedIn,
      login,
      logout,
      userCanAdd,
      userCanEdit,
      userCanDelete,
      userCanCreateUsers,
    }),
    [
      isLoggedIn,
      userLoggedIn,
      login,
      logout,
      userCanAdd,
      userCanEdit,
      userCanDelete,
      userCanCreateUsers,
    ]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
