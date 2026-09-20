import { useEffect, useState } from 'react'
import { api } from '../api'
import { friendlyError } from '../lib/errors'
import { mergeGames, normalizeGame } from '../lib/games'

const detailCache = new Map()

// `seed` is the game we already know from the card the user clicked,
// so the page can render instantly while full details load.
export function useGame(id, seed) {
  const [state, setState] = useState(() => {
    const cached = detailCache.get(id)
    return { status: cached ? 'success' : 'loading', game: cached || (seed ? normalizeGame(seed) : null), error: '', notFound: false }
  })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (detailCache.has(id) && attempt === 0) return

    const controller = new AbortController()
    setState((prev) => ({ ...prev, status: 'loading', error: '', notFound: false }))

    api.gameDetails(id, { signal: controller.signal })
      .then((data) => {
        const detail = normalizeGame(data?.game ?? data)
        setState((prev) => {
          const game = { ...mergeGames(prev.game || {}, detail), id } // the route id stays the source of truth
          detailCache.set(id, game)
          return { status: 'success', game, error: '', notFound: false }
        })
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        setState((prev) => ({
          ...prev,
          status: 'error',
          notFound: err.status === 404,
          error: friendlyError(err, "We couldn't load this game."),
        }))
      })

    return () => controller.abort()
  }, [id, attempt])

  return { ...state, retry: () => setAttempt((n) => n + 1) }
}
