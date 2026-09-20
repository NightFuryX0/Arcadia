import { memo } from 'react'
import { Link } from 'react-router-dom'
import { STATUS_LABELS } from '../lib/constants'
import Cover from './Cover'
import { CheckIcon, PlusIcon, StarIcon } from './Icons'

// memo: a grid can hold dozens of cards, and library changes should only re-render the card that changed.
function GameCard({ game, entry, onAdd }) {
  const genres = game.genres.slice(0, 2).join(', ')
  return (
    <article className="card">
      <Link to={`/game/${game.id}`} state={{ game }} className="card-link">
        <Cover url={game.cover} title={game.title} />
        <div className="card-meta">
          <h3 className="card-title">{game.title}</h3>
          {(game.year || genres) && (
            <p className="card-sub">{game.year && <span>{game.year}</span>}{genres && <span>{genres}</span>}</p>
          )}
          {entry && <span className={`status-pill tone-${entry.status}`}>{STATUS_LABELS[entry.status]}</span>}
        </div>
      </Link>

      {game.score && (
        <span className="score-badge" title="Rating out of 10"><StarIcon width={12} height={12} />{game.score}</span>
      )}
      <button
        type="button"
        className={`quick-add ${entry ? 'added' : ''}`}
        onClick={() => onAdd(game)}
        disabled={Boolean(entry)}
        aria-label={entry ? `${game.title} is in your library` : `Add ${game.title} to your library`}
      >
        {entry ? <CheckIcon width={16} height={16} /> : <PlusIcon width={16} height={16} />}
      </button>
    </article>
  )
}

export default memo(GameCard)
