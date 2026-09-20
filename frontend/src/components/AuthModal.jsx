import { useEffect, useRef, useState } from 'react'
import { api } from '../api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { authErrorMessage } from '../lib/errors'
import { CloseIcon } from './Icons'

export default function AuthModal() {
  const { modal: mode, openAuth, closeAuth, signIn } = useAuth()
  const toast = useToast()
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const firstField = useRef(null)

  useEffect(() => { firstField.current?.focus() }, [mode])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') closeAuth() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [closeAuth])

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  const isLogin = mode === 'login'

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      let data = isLogin
        ? await api.login({ email: form.email, password: form.password })
        : await api.register(form)
      let token = data?.access_token || data?.token
      if (!token && !isLogin) { // some backends don't return a token on register
        data = await api.login({ email: form.email, password: form.password })
        token = data?.access_token || data?.token
      }
      if (token) localStorage.setItem('arcadia_token', token)

      const user = data?.user
        || (token ? await api.me().catch(() => null) : null)
        || { username: form.username || form.email.split('@')[0], email: form.email }
      signIn(user)
      toast('Welcome to Arcadia.', 'success')
    } catch (err) {
      setError(authErrorMessage(err, mode))
      setLoading(false)
    }
  }

  return (
    <div className="modal-backdrop" onMouseDown={closeAuth}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="auth-title" onMouseDown={(e) => e.stopPropagation()}>
        <button type="button" className="icon-btn modal-close" onClick={closeAuth} aria-label="Close"><CloseIcon /></button>
        <p className="modal-kicker">{isLogin ? 'Welcome back' : 'Join Arcadia'}</p>
        <h2 id="auth-title">{isLogin ? 'Sign in to your library' : 'Create your account'}</h2>

        <form onSubmit={submit} className="auth-form">
          {!isLogin && (
            <input ref={firstField} required autoComplete="username" placeholder="Username" value={form.username} onChange={set('username')} />
          )}
          <input ref={isLogin ? firstField : null} required type="email" autoComplete="email" placeholder="Email" value={form.email} onChange={set('email')} />
          <input required type="password" autoComplete={isLogin ? 'current-password' : 'new-password'} placeholder="Password" value={form.password} onChange={set('password')} />
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="btn primary btn-lg" disabled={loading}>
            {loading ? 'Please wait...' : isLogin ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <button type="button" className="switch-auth" onClick={() => { openAuth(isLogin ? 'register' : 'login'); setError('') }}>
          {isLogin ? 'New here? Create an account' : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  )
}
