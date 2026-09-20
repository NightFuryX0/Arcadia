import { useEffect, useState } from 'react'
import { api } from '../api'
import { MIN_SEARCH_LENGTH } from '../lib/constants'
import { friendlyError } from '../lib/errors'
import { normalizeList } from '../lib/games'

// Remembers recent searches so going back to a page doesn't repeat the request.
const cache = new Map()
const CACHE_LIMIT = 30

export function useGameSearch(query) {
  const [state, setState] = useState({ status: 'idle', results: [], error: '' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const q = query.trim()
    if (q.length < MIN_SEARCH_LENGTH) {
      setState({ status: 'idle', results: [], error: '' })
      return
    }

    const key = q.toLowerCase()
    if (cache.has(key) && attempt === 0) {
      setState({ status: 'success', results: cache.get(key), error: '' })
      return
    }

    // Any newer query aborts this one, so slow old responses can never overwrite newer ones.
    const controller = new AbortController()
    setState((prev) => ({ ...prev, status: 'loading', error: '' }))

    api.searchGames(q, 24, { signal: controller.signal })
      .then((data) => {
        const results = normalizeList(data)
        cache.set(key, results)
        if (cache.size > CACHE_LIMIT) cache.delete(cache.keys().next().value)
        setState({ status: 'success', results, error: '' })
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        setState({ status: 'error', results: [], error: friendlyError(err, "We couldn't search right now.") })
      })

    return () => controller.abort()
  }, [query, attempt])

  return { ...state, retry: () => setAttempt((n) => n + 1) }
}
