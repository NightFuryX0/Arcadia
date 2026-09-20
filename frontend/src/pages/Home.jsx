import { Link } from 'react-router-dom'
import { GameGrid, GameGridSkeleton } from '../components/GameGrid'
import Cover from '../components/Cover'
import { AlertIcon, ArrowRightIcon } from '../components/Icons'
import StateMessage from '../components/StateMessage'
import { useFeaturedGames } from '../hooks/useFeaturedGames'
import { usePageTitle } from '../hooks/usePageTitle'
import { STATUSES } from '../lib/constants'

export default function Home() {
  usePageTitle()
  const { status, games, error, retry } = useFeaturedGames()
  const stack = games.slice(0, 3)

  return (
    <>
      <section className="container hero">
        <div className="hero-copy">
          <h1>Play.<br /><span className="outline">Track.</span><br />Discover.</h1>
          <p>Keep every game you have played, are playing, and want to play in one place.</p>
          <div className="hero-actions">
            <Link to="/discover" className="btn primary btn-lg">Explore games <ArrowRightIcon width={18} height={18} /></Link>
            <Link to="/library" className="btn ghost btn-lg">Open my library</Link>
          </div>
        </div>

        <div className="cover-stack" aria-hidden={stack.length === 0}>
          {(stack.length ? stack : [null, null, null]).map((game, i) => (
            <div key={game?.id ?? i} className={`stack-card ${game ? '' : 'skeleton'}`}>
              {game && (
                <Link to={`/game/${game.id}`} state={{ game }} aria-label={game.title} tabIndex={i === 1 ? 0 : -1}>
                  <Cover url={game.cover} title={game.title} eager={i === 1} />
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="section-head">
          <h2>Games worth playing</h2>
          <Link to="/discover" className="text-link">Browse all <ArrowRightIcon width={16} height={16} /></Link>
        </div>
        {status === 'loading' && <GameGridSkeleton count={6} />}
        {status === 'error' && (
          <StateMessage
            tone="error"
            icon={<AlertIcon width={28} height={28} />}
            title="Couldn't load games"
            actions={<button className="btn" onClick={retry}>Try again</button>}
          >
            {error}
          </StateMessage>
        )}
        {status === 'success' && <GameGrid games={games} />}
      </section>

      <section className="container section">
        <div className="section-head"><h2>Track how you play</h2></div>
        <ul className="status-showcase">
          {STATUSES.map((s) => (
            <li key={s.value} className={`tone-${s.value}`}>
              <strong>{s.label}</strong>
              <span>{s.hint}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
