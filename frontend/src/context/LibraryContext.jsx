import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { api } from '../api'
import { friendlyError } from '../lib/errors'
import { useAuth } from './AuthContext'
import { useToast } from './ToastContext'

// The backend has no "list my library" endpoint yet, so the list itself is kept in
// this browser (per user). Adding a game and changing status/rating still go through the API.

const LibraryContext = createContext(null)
const NO_ENTRIES = []

const storageKey = (userKey) => `arcadia_library_${userKey}`
function readEntries(userKey) {
  try { return JSON.parse(localStorage.getItem(storageKey(userKey))) || [] } catch { return [] }
}
function writeEntries(userKey, entries) {
  try { localStorage.setItem(storageKey(userKey), JSON.stringify(entries)) } catch { /* storage blocked */ }
}

// The response to POST /library/external/:id should identify the saved game.
function pickGameId(response) {
  return response?.game_id ?? response?.game?.id ?? response?.id ?? null
}

export function LibraryProvider({ children }) {
  const { user, openAuth } = useAuth()
  const toast = useToast()

  const userKey = user ? String(user.id ?? user.email ?? user.username ?? 'user') : null
  const [store, setStore] = useState({ key: null, entries: NO_ENTRIES })
  const entries = userKey && store.key === userKey ? store.entries : NO_ENTRIES

  const keyRef = useRef(userKey)
  const entriesRef = useRef(entries)
  const inFlight = useRef(new Set())
  useEffect(() => { keyRef.current = userKey; entriesRef.current = entries })

  useEffect(() => {
    setStore({ key: userKey, entries: userKey ? readEntries(userKey) : NO_ENTRIES })
  }, [userKey])

  useEffect(() => {
    if (store.key) writeEntries(store.key, store.entries)
  }, [store])

  // Only touches the list if the same user is still signed in when an async call finishes.
  const mutate = useCallback((key, fn) => {
    setStore((s) => (s.key === key ? { ...s, entries: fn(s.entries) } : s))
  }, [])

  const add = useCallback(async (game) => {
    const key = keyRef.current
    if (!key) {
      toast('Sign in to build your library.')
      openAuth('login')
      return false
    }
    if (entriesRef.current.some((e) => e.id === game.id) || inFlight.current.has(game.id)) return true

    inFlight.current.add(game.id)
    const entry = {
      id: game.id, title: game.title, cover: game.cover, genres: game.genres, score: game.score, year: game.year,
      status: 'backlog', rating: null, libraryGameId: null, addedAt: Date.now(), updatedAt: Date.now(),
    }
    mutate(key, (list) => [entry, ...list]) // optimistic: the UI updates immediately

    try {
      const response = await api.addExternalGame(game.id)
      const libraryGameId = pickGameId(response)
      mutate(key, (list) => list.map((e) => (e.id === game.id ? { ...e, libraryGameId } : e)))
      toast(`${game.title} added to your library.`, 'success')
      return true
    } catch (err) {
      if (err.status === 409) { // already saved on the server
        toast(`${game.title} is already in your library.`)
        return true
      }
      mutate(key, (list) => list.filter((e) => e.id !== game.id)) // roll back
      if (err.status === 401) {
        toast('Your session has expired. Sign in again.', 'error')
        openAuth('login')
      } else {
        toast(friendlyError(err, "Couldn't add that game. Try again."), 'error')
      }
      return false
    } finally {
      inFlight.current.delete(game.id)
    }
  }, [mutate, openAuth, toast])

  // patch is { status } or { rating }, the same shape PATCH /library/:id receives.
  const update = useCallback(async (id, patch) => {
    const key = keyRef.current
    const current = entriesRef.current.find((e) => e.id === id)
    if (!key || !current) return

    mutate(key, (list) => list.map((e) => (e.id === id ? { ...e, ...patch, updatedAt: Date.now() } : e)))
    if (current.libraryGameId == null) return // not synced yet, keep the change locally

    try {
      await api.updateLibrary(current.libraryGameId, patch)
    } catch (err) {
      const previous = Object.fromEntries(Object.keys(patch).map((k) => [k, current[k]]))
      mutate(key, (list) => list.map((e) => (e.id === id ? { ...e, ...previous } : e)))
      if (err.status === 401) openAuth('login')
      toast(friendlyError(err, "Couldn't save that change. Try again."), 'error')
    }
  }, [mutate, openAuth, toast])

  const byId = useMemo(() => new Map(entries.map((e) => [e.id, e])), [entries])
  const value = useMemo(() => ({ entries, byId, add, update }), [entries, byId, add, update])
  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
}

export const useLibrary = () => useContext(LibraryContext)
