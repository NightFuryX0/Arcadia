import { useEffect, useState } from 'react'
import { api } from '../api'
import { FEATURED_TITLES } from '../lib/constants'
import { friendlyError } from '../lib/errors'
import { normalizeList } from '../lib/games'

// The featured shelf is built from real search results (there is no "featured" endpoint).
// It is fetched once per browser session and shared by Home and Discover.
const STORAGE_KEY = 'arcadia_featured_v1'
let memo = readSession()
let inflight = null

function readSession() {
  try { return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) } catch { return null }
}

async function fetchFeatured() {
  const settled = await Promise.allSettled(
    FEATURED_TITLES.map(async (title) => {
      const list = normalizeList(await api.searchGames(title, 3))
      return list.find((g) => g.title.toLowerCase() === title.toLowerCase()) || list[0]
    }),
  )
  const games = settled.filter((r) => r.status === 'fulfilled' && r.value).map((r) => r.value)
  if (games.length === 0) {
    throw settled.find((r) => r.status === 'rejected')?.reason ?? new Error('No featured games found')
  }
  return games
}

function loadFeatured() {
  if (memo?.length) return Promise.resolve(memo)
  // Sharing one in-flight promise prevents duplicate requests (e.g. React StrictMode in dev).
  inflight ??= fetchFeatured()
    .then((games) => {
      memo = games
      try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(games)) } catch { /* storage full or blocked */ }
      return games
    })
    .finally(() => { inflight = null })
  return inflight
}

export function useFeaturedGames(enabled = true) {
  const [state, setState] = useState(() => (
    memo?.length ? { status: 'success', games: memo, error: '' } : { status: 'loading', games: [], error: '' }
  ))
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (!enabled || (memo?.length && attempt === 0)) return
    let cancelled = false
    setState((prev) => ({ ...prev, status: 'loading', error: '' }))
    loadFeatured()
      .then((games) => { if (!cancelled) setState({ status: 'success', games, error: '' }) })
      .catch((err) => {
        if (!cancelled) setState({ status: 'error', games: [], error: friendlyError(err, "We couldn't load games right now.") })
      })
    return () => { cancelled = true }
  }, [enabled, attempt])

  return { ...state, retry: () => setAttempt((n) => n + 1) }
}
