import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import Cover from '../components/Cover'
import StateMessage from '../components/StateMessage'
import { UserIcon } from '../components/Icons'
import { useAuth } from '../context/AuthContext'
import { useLibrary } from '../context/LibraryContext'
import { usePageTitle } from '../hooks/usePageTitle'
import { STATUSES, STATUS_LABELS } from '../lib/constants'

export default function Profile() {
  usePageTitle('Profile')
  const { user, openAuth, logout } = useAuth()
  const { entries } = useLibrary()

  // Every number on this page is derived from the player's real library.
  const stats = useMemo(() => {
    const byStatus = Object.fromEntries(STATUSES.map((s) => [s.value, 0]))
    let ratingSum = 0
    let rated = 0
    for (const e of entries) {
      byStatus[e.status] = (byStatus[e.status] || 0) + 1
      if (e.rating) { ratingSum += e.rating; rated += 1 }
    }
    return { byStatus, average: rated ? (ratingSum / rated).toFixed(1) : '-' }
  }, [entries])

  if (!user) {
    return (
      <section className="container page">
        <StateMessage
          icon={<UserIcon width={28} height={28} />}
          title="Sign in to see your profile"
          actions={<button className="btn primary" onClick={() => openAuth('login')}>Sign in</button>}
        >
          Create an account to track games and see your stats.
        </StateMessage>
      </section>
    )
  }

  const recent = [...entries].sort((a, b) => b.addedAt - a.addedAt).slice(0, 5)

  return (
    <section className="container page">
      <div className="profile-hero">
        <div className="profile-avatar">{(user.username || user.email || 'A')[0].toUpperCase()}</div>
        <div>
          <h1>{user.username || 'Player'}</h1>
          {user.email && <p>{user.email}</p>}
        </div>
        <button className="btn ghost" onClick={logout}>Sign out</button>
      </div>

      <div className="stat-grid">
        <div className="stat"><strong>{entries.length}</strong><span>Games tracked</span></div>
        <div className="stat"><strong>{stats.byStatus.playing}</strong><span>Playing</span></div>
        <div className="stat"><strong>{stats.byStatus.completed}</strong><span>Completed</span></div>
        <div className="stat"><strong>{stats.average}</strong><span>Average rating</span></div>
      </div>

      <div className="profile-grid">
        <div className="panel">
          <h2>Recently added</h2>
          {recent.length === 0 ? (
            <p className="muted">Nothing here yet. <Link className="text-link" to="/discover">Find your first game</Link>.</p>
          ) : (
            <ul className="recent-list">
              {recent.map((e) => (
                <li key={e.id}>
                  <Link to={`/game/${e.id}`} state={{ game: e }}>
                    <Cover url={e.cover} title={e.title} className="thumb" />
                    <span className="recent-title">{e.title}</span>
                    <span className={`status-pill tone-${e.status}`}>{STATUS_LABELS[e.status]}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="panel">
          <h2>Your library by status</h2>
          {entries.length === 0 ? (
            <p className="muted">Your breakdown appears once you add games.</p>
          ) : (
            <>
              <div className="breakdown-bar" role="img" aria-label="Library breakdown by status">
                {STATUSES.filter((s) => stats.byStatus[s.value] > 0).map((s) => (
                  <span key={s.value} className={`tone-${s.value}`} style={{ flexGrow: stats.byStatus[s.value] }} />
                ))}
              </div>
              <ul className="breakdown-list">
                {STATUSES.map((s) => (
                  <li key={s.value} className={`tone-${s.value}`}><span>{s.label}</span><strong>{stats.byStatus[s.value]}</strong></li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
