import { useLibrary } from '../context/LibraryContext'
import GameCard from './GameCard'

export function GameGrid({ games, stale = false }) {
  const { byId, add } = useLibrary()
  return (
    <div className={`game-grid ${stale ? 'is-stale' : ''}`}>
      {games.map((game) => <GameCard key={game.id} game={game} entry={byId.get(game.id)} onAdd={add} />)}
    </div>
  )
}

export function GameGridSkeleton({ count = 12 }) {
  return (
    <div className="game-grid" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="card">
          <div className="cover skeleton" />
          <div className="card-meta">
            <div className="skeleton skeleton-line" style={{ width: '80%' }} />
            <div className="skeleton skeleton-line" style={{ width: '45%' }} />
          </div>
        </div>
      ))}
    </div>
  )
}
