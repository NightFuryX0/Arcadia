import { useMemo } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import Cover from '../components/Cover'
import { AlertIcon, ArrowLeftIcon, CheckIcon, PlusIcon, StarIcon } from '../components/Icons'
import RatingStars from '../components/RatingStars'
import StateMessage from '../components/StateMessage'
import StatusPicker from '../components/StatusPicker'
import { useLibrary } from '../context/LibraryContext'
import { useGame } from '../hooks/useGame'
import { usePageTitle } from '../hooks/usePageTitle'
import { coverSources, formatDate } from '../lib/games'

// `key={id}` gives every game a fresh state, so moving between games never shows stale data.
export default function GameDetailsRoute() {
  const { id } = useParams()
  const { state } = useLocation()
  return <GameDetailsView key={id} id={id} seed={state?.game} />
}

function GameDetailsView({ id, seed }) {
  const { status, game, error, notFound, retry } = useGame(id, seed)
  const { byId, add, update } = useLibrary()
  const navigate = useNavigate()
  const location = useLocation()
  const entry = byId.get(id)
  usePageTitle(game?.title)

  const backdrop = useMemo(() => coverSources(game?.cover, true).src, [game?.cover])
  const goBack = () => (location.key !== 'default' ? navigate(-1) : navigate('/discover'))

  if (!game && status === 'error') {
    return (
      <section className="container page">
        <StateMessage
          tone={notFound ? 'neutral' : 'error'}
          icon={<AlertIcon width={28} height={28} />}
          title={notFound ? 'Game not found' : "Couldn't load this game"}
          actions={(
            <>
              {!notFound && <button className="btn" onClick={retry}>Try again</button>}
              <Link className="btn ghost" to="/discover">Back to Discover</Link>
            </>
          )}
        >
          {notFound ? "That game doesn't exist in our catalogue, or the link is out of date." : error}
        </StateMessage>
      </section>
    )
  }

  if (!game) {
    return (
      <section className="container detail" aria-busy="true">
        <div className="detail-grid">
          <div className="detail-cover"><div className="cover skeleton" /></div>
          <div className="detail-body">
            <div className="skeleton skeleton-line" style={{ width: '60%', height: 48 }} />
            <div className="skeleton skeleton-line" style={{ width: '30%' }} />
            <div className="skeleton skeleton-line" style={{ width: '90%', height: 90 }} />
          </div>
        </div>
      </section>
    )
  }

  const facts = [
    game.releaseDate && ['Release date', formatDate(game.releaseDate)],
    !game.releaseDate && game.year && ['Release year', game.year],
    game.platforms.length > 0 && ['Platforms', game.platforms.join(', ')],
    game.genres.length > 0 && ['Genres', game.genres.join(', ')],
  ].filter(Boolean)

  return (
    <article className="detail">
      {backdrop && <div className="detail-backdrop" style={{ backgroundImage: `url("${backdrop}")` }} aria-hidden="true" />}

      <div className="container">
        <button type="button" className="back-link" onClick={goBack}><ArrowLeftIcon width={18} height={18} /> Back</button>

        <div className="detail-grid">
          <div className="detail-cover">
            <Cover url={game.cover} title={game.title} alt={`${game.title} cover art`} large eager />
          </div>

          <div className="detail-body">
            <h1>{game.title}</h1>
            {(game.year || game.platforms.length > 0) && (
              <p className="detail-sub">{[game.year, game.platforms.slice(0, 3).join(', ')].filter(Boolean).join(' | ')}</p>
            )}

            {game.genres.length > 0 && (
              <ul className="chips">{game.genres.map((g) => <li key={g}>{g}</li>)}</ul>
            )}

            {game.score && (
              <div className="detail-score" title="Rating out of 10">
                <StarIcon width={22} height={22} /><strong>{game.score}</strong><span>/ 10</span>
              </div>
            )}

            {status === 'error' && (
              <p className="notice">
                Some details couldn't be loaded. <button type="button" className="text-link" onClick={retry}>Try again</button>
              </p>
            )}

            <p className="detail-desc">
              {game.description || (status === 'loading' ? 'Loading details...' : 'No description is available for this game yet.')}
            </p>

            <div className="library-panel">
              {entry ? (
                <>
                  <div className="panel-row">
                    <span className="panel-label"><CheckIcon width={16} height={16} /> In your library</span>
                    <StatusPicker value={entry.status} onChange={(s) => update(id, { status: s })} />
                  </div>
                  <div className="panel-row">
                    <span className="panel-label">Your rating</span>
                    <RatingStars value={entry.rating} onChange={(r) => update(id, { rating: r })} />
                  </div>
                </>
              ) : (
                <div className="panel-row">
                  <button type="button" className="btn primary btn-lg" onClick={() => add(game)}>
                    <PlusIcon width={18} height={18} /> Add to library
                  </button>
                  <span className="panel-hint">Saved as Backlog. You can change the status afterwards.</span>
                </div>
              )}
            </div>

            {facts.length > 0 && (
              <dl className="facts">
                {facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
              </dl>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
