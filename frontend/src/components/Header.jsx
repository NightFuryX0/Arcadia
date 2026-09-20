import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { CompassIcon, HomeIcon, LibraryIcon, SearchIcon, UserIcon } from './Icons'

const NAV = [
  { to: '/', label: 'Home', icon: HomeIcon, end: true },
  { to: '/discover', label: 'Discover', icon: CompassIcon },
  { to: '/library', label: 'Library', icon: LibraryIcon },
  { to: '/profile', label: 'Profile', icon: UserIcon },
]
const linkClass = ({ isActive }) => (isActive ? 'active' : '')

export default function Header() {
  const { user, openAuth } = useAuth()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const submit = (e) => {
    e.preventDefault()
    const q = query.trim()
    navigate(q ? `/discover?q=${encodeURIComponent(q)}` : '/discover')
    setQuery('')
  }

  return (
    <>
      <header className="topbar">
        <div className="container topbar-inner">
          <Link to="/" className="brand" aria-label="Arcadia home">
            <span className="brand-mark">A</span>
            <span className="brand-word">Arcadia</span>
          </Link>

          <nav className="nav-links" aria-label="Main">
            {NAV.map(({ to, label, end }) => <NavLink key={to} to={to} end={end} className={linkClass}>{label}</NavLink>)}
          </nav>

          <div className="header-actions">
            <form className="search-mini" role="search" onSubmit={submit}>
              <SearchIcon width={16} height={16} />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search games"
                aria-label="Quick search"
              />
            </form>
            <Link to="/discover" state={{ focusSearch: true }} className="icon-btn search-link" aria-label="Search games">
              <SearchIcon />
            </Link>
            {user ? (
              <Link to="/profile" className="avatar" aria-label="Your profile">
                {(user.username || user.email || 'A')[0].toUpperCase()}
              </Link>
            ) : (
              <button type="button" className="btn btn-sm primary" onClick={() => openAuth('login')}>Sign in</button>
            )}
          </div>
        </div>
      </header>

      {/* Phones get a bottom tab bar: easier to reach than a hamburger menu. */}
      <nav className="tabbar" aria-label="Main">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={linkClass}>
            <Icon /><span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  )
}
