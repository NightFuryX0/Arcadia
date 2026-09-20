import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../api'
import { useToast } from './ToastContext'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const toast = useToast()
  const [user, setUser] = useState(null)
  const [modal, setModal] = useState(null) // 'login' | 'register' | null

  // Restore the session. Only a rejected token logs the user out;
  // if the backend is simply down we keep the token for next time.
  useEffect(() => {
    if (!localStorage.getItem('arcadia_token')) return
    const controller = new AbortController()
    api.me({ signal: controller.signal })
      .then(setUser)
      .catch((err) => {
        if (err.status === 401 || err.status === 403) localStorage.removeItem('arcadia_token')
      })
    return () => controller.abort()
  }, [])

  const openAuth = useCallback((mode = 'login') => setModal(mode), [])
  const closeAuth = useCallback(() => setModal(null), [])
  const signIn = useCallback((nextUser) => { setUser(nextUser); setModal(null) }, [])
  const logout = useCallback(() => {
    localStorage.removeItem('arcadia_token')
    setUser(null)
    toast('You have been signed out.')
  }, [toast])

  const value = useMemo(
    () => ({ user, modal, openAuth, closeAuth, signIn, logout }),
    [user, modal, openAuth, closeAuth, signIn, logout],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
