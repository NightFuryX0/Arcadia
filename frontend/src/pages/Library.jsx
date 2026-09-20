import { memo, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Cover from '../components/Cover'
import { LibraryIcon, UserIcon } from '../components/Icons'
import RatingStars from '../components/RatingStars'
import StateMessage from '../components/StateMessage'
import { useAuth } from '../context/AuthContext'
import { useLibrary } from '../context/LibraryContext'
import { usePageTitle } from '../hooks/usePageTitle'
import { STATUSES, STATUS_LABELS } from '../lib/constants'

const LibraryCard = memo(function LibraryCard({ entry, onUpdate }) {
  return (
    <article className={`lib-card tone-${entry.status}`}>
      <Link to={`/game/${entry.id}`} state={{ game: entry }} className="card-link">
        <div className="cover-wrap">
          <Cover url={entry.cover} title={entry.title} />
          <span className="status-pill overlay">{STATUS_LABELS[entry.status]}</span>
        </div>
        <h3 className="card-title">{entry.title}</h3>
      </Link>
      <div className="lib-controls">
        <select
          value={entry.status}
          onChange={(e) => onUpdate(entry.id, { status: e.target.value })}
          aria-label={`Status for ${entry.title}`}
        >
          {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <RatingStars small value={entry.rating} onChange={(r) => onUpdate(entry.id, { rating: r })} />
      </div>
    </article>
  )
})

export default function Library() {
  usePageTitle('My library')
  const { user, openAuth } = useAuth()
  const { entries, update } = useLibrary()
  const [filter, setFilter] = useState('all')

  const counts = useMemo(() => {
    const result = { all: entries.length }
    for (const s of STATUSES) result[s.value] = 0
    for (const e of entries) result[e.status] = (result[e.status] || 0) + 1
    return result
  }, [entries])

  const visible = useMemo(
    () => (filter === 'all' ? entries : entries.filter((e) => e.status === filter)),
    [entries, filter],
  )

  if (!user) {
    return (
      <section className="container page">
        <StateMessage
          icon={<UserIcon width={28} height={28} />}
          title="Sign in to see your library"
          actions={<button className="btn primary" onClick={() => openAuth('login')}>Sign in</button>}
        >
          Your library keeps track of what you play, finish, and want to try next.
        </StateMessage>
      </section>
    )
  }

  return (
    <section className="container page">
      <div className="page-head">
        <div>
          <h1>My library</h1>
          <p>{entries.length} {entries.length === 1 ? 'game' : 'games'} in your collection.</p>
        </div>
        <Link to="/discover" className="btn primary">Find games</Link>
      </div>

      {entries.length === 0 ? (
        <StateMessage
          icon={<LibraryIcon width={28} height={28} />}
          title="Your library is empty"
          actions={<Link to="/discover" className="btn primary">Discover games</Link>}
        >
          Add a game from Discover and it will show up here.
        </StateMessage>
      ) : (
        <>
          <div className="tabs" role="tablist" aria-label="Filter by status">
            {[{ value: 'all', label: 'All' }, ...STATUSES].map((s) => (
              <button
                key={s.value}
                role="tab"
                aria-selected={filter === s.value}
                className={`tab tone-${s.value} ${filter === s.value ? 'active' : ''}`}
                onClick={() => setFilter(s.value)}
              >
                {s.label} <span className="tab-count">{counts[s.value] || 0}</span>
              </button>
            ))}
          </div>

          {visible.length === 0 ? (
            <StateMessage title={`No ${STATUS_LABELS[filter]?.toLowerCase() ?? ''} games yet`}>
              Change a game's status from its card to see it here.
            </StateMessage>
          ) : (
            <div className="game-grid">
              {visible.map((entry) => <LibraryCard key={entry.id} entry={entry} onUpdate={update} />)}
            </div>
          )}
        </>
      )}
    </section>
  )
}
