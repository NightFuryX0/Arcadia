import { useEffect, useRef, useState } from 'react'

import { useLocation, useSearchParams } from 'react-router-dom'

import { GameGrid, GameGridSkeleton } from '../components/GameGrid'

import { AlertIcon, CloseIcon, SearchIcon } from '../components/Icons'

import StateMessage from '../components/StateMessage'

import { useDebounce } from '../hooks/useDebounce'

import { useFeaturedGames } from '../hooks/useFeaturedGames'

import { useGameSearch } from '../hooks/useGameSearch'

import { usePageTitle } from '../hooks/usePageTitle'

import { MIN_SEARCH_LENGTH, SEARCH_DEBOUNCE_MS } from '../lib/constants'

import pikachuRunning from '../assets/pikachu-running.gif'

// The URL (?q=) is the source of truth for the search, so results can be
// bookmarked, shared, and survive the back button.

export default function Discover() {
  const [params, setParams] = useSearchParams()

  const q = (params.get('q') ?? '').trim()

  const { state } = useLocation()

  const [input, setInput] = useState(q)

  const debouncedInput = useDebounce(input, SEARCH_DEBOUNCE_MS)

  const lastPushed = useRef(q)

  const inputRef = useRef(null)

  const searchActive = q.length >= MIN_SEARCH_LENGTH

  const search = useGameSearch(q)

  const featured = useFeaturedGames(!searchActive)

  usePageTitle(searchActive ? `Search: ${q}` : 'Discover')

  useEffect(() => {
    if (state?.focusSearch) {
      inputRef.current?.focus()
    }
  }, [state])

  // The URL changed from outside (header search, back/forward):
  // mirror it into the input.
  useEffect(() => {
    if (q !== lastPushed.current) {
      lastPushed.current = q
      setInput(q)
    }
  }, [q])

  // The user paused typing: write the query to the URL,
  // which triggers the search.
  useEffect(() => {
    const next = debouncedInput.trim()

    if (next === lastPushed.current) return

    lastPushed.current = next

    setParams(next ? { q: next } : {}, { replace: true })

    // Only re-run when the debounced text changes.
    // setParams changes identity with the URL.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedInput])

  const submit = (e) => {
    e.preventDefault()

    const next = input.trim()

    lastPushed.current = next

    setParams(next ? { q: next } : {}, { replace: true })
  }

  const clear = () => {
    setInput('')
    inputRef.current?.focus()
  }

  return (
    <section className="container page">
      <div className="page-head">
        <div>
          <h1>Discover games</h1>

          <p>
            Search the full game catalogue and add what you like to your library.
          </p>
        </div>

        <form
          className="big-search"
          role="search"
          onSubmit={submit}
        >
          <SearchIcon />

          <input
            ref={inputRef}
            type="search"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Try Elden Ring, Hades, Celeste"
            aria-label="Search games"
          />

          {input && (
            <button
              type="button"
              className="icon-btn"
              onClick={clear}
              aria-label="Clear search"
            >
              <CloseIcon width={18} height={18} />
            </button>
          )}
        </form>
      </div>

      <div
        className={`search-progress ${
          search.status === 'loading' ? 'on' : ''
        }`}
        aria-hidden="true"
      />

      {!searchActive ? (
        <>
          <p className="result-line">
            {input.trim().length === 1
              ? 'Keep typing to search. Two characters or more.'
              : 'Popular picks'}
          </p>

          {featured.status === 'loading' && (
            <GameGridSkeleton count={6} />
          )}

          {featured.status === 'error' && (
            <StateMessage
              tone="error"
              icon={<AlertIcon width={28} height={28} />}
              title="Couldn't load games"
              actions={
                <button
                  className="btn"
                  onClick={featured.retry}
                >
                  Try again
                </button>
              }
            >
              {featured.error}
            </StateMessage>
          )}

          {featured.status === 'success' && (
            <GameGrid games={featured.games} />
          )}
        </>
      ) : (
        <>
          <p className="result-line" role="status">
            {search.status === 'loading' &&
              search.results.length === 0 &&
              `Searching for "${q}"`}

            {search.status === 'success' &&
              (search.results.length
                ? `${search.results.length} ${
                    search.results.length === 1 ? 'result' : 'results'
                  } for "${q}"`
                : '')}

            {search.status === 'loading' &&
              search.results.length > 0 &&
              `Updating results for "${q}"`}
          </p>

          {/* First search: show Pikachu instead of the normal skeleton */}
          {search.status === 'loading' &&
            search.results.length === 0 && (
              <div className="search-loading" role="status">
                <img
                  src={pikachuRunning}
                  alt=""
                  className="search-loading-gif"
                />

                <h2>Searching Arcadia...</h2>

                <p>
                  Looking through the game catalogue for "{q}".
                </p>
              </div>
            )}

          {search.status === 'error' && (
            <StateMessage
              tone="error"
              icon={<AlertIcon width={28} height={28} />}
              title="Search isn't working right now"
              actions={
                <button
                  className="btn"
                  onClick={search.retry}
                >
                  Try again
                </button>
              }
            >
              {search.error}
            </StateMessage>
          )}

          {search.status === 'success' &&
            search.results.length === 0 && (
              <StateMessage
                icon={<SearchIcon width={28} height={28} />}
                title={`No games found for "${q}"`}
                actions={
                  <button
                    className="btn"
                    onClick={clear}
                  >
                    Clear search
                  </button>
                }
              >
                Check the spelling or try a shorter title.
              </StateMessage>
            )}

          {search.results.length > 0 && (
            <GameGrid
              games={search.results}
              stale={search.status === 'loading'}
            />
          )}
        </>
      )}
    </section>
  )
}