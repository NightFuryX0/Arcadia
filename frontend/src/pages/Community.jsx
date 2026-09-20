import { useEffect, useState } from 'react'
import { api } from '../api'

function formatDate(dateString) {
  if (!dateString) return ''

  const date = new Date(dateString)

  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function getDisplayName(user) {
  return user.display_name || user.username
}

export default function Community() {
  const [reviews, setReviews] = useState([])
  const [suggestions, setSuggestions] = useState([])

  const [loadingReviews, setLoadingReviews] = useState(true)
  const [loadingSuggestions, setLoadingSuggestions] = useState(true)

  const [reviewError, setReviewError] = useState('')
  const [suggestionError, setSuggestionError] = useState('')

  const [following, setFollowing] = useState({})
  const [followLoading, setFollowLoading] = useState({})

  useEffect(() => {
    let cancelled = false

    async function loadCommunity() {
      setLoadingReviews(true)
      setReviewError('')

      try {
        const data = await api.communityFeed()

        if (!cancelled) {
          setReviews(Array.isArray(data) ? data : [])
        }
      } catch (error) {
        if (!cancelled && error.name !== 'AbortError') {
          setReviewError(error.message || 'Unable to load community feed.')
        }
      } finally {
        if (!cancelled) {
          setLoadingReviews(false)
        }
      }
    }

    loadCommunity()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function loadSuggestions() {
      setLoadingSuggestions(true)
      setSuggestionError('')

      try {
        const data = await api.communitySuggestions()

        if (!cancelled) {
          const users = Array.isArray(data) ? data : []

          setSuggestions(users)

          const initialFollowing = {}

          users.forEach((user) => {
            initialFollowing[user.id] = user.is_following
          })

          setFollowing(initialFollowing)
        }
      } catch (error) {
        if (!cancelled && error.name !== 'AbortError') {
          setSuggestionError(
            error.message || 'Unable to load suggested users.',
          )
        }
      } finally {
        if (!cancelled) {
          setLoadingSuggestions(false)
        }
      }
    }

    loadSuggestions()

    return () => {
      cancelled = true
    }
  }, [])

  async function handleFollow(userId) {
    const currentlyFollowing = following[userId]

    setFollowLoading((current) => ({
      ...current,
      [userId]: true,
    }))

    try {
      if (currentlyFollowing) {
        await api.unfollowUser(userId)
      } else {
        await api.followUser(userId)
      }

      setFollowing((current) => ({
        ...current,
        [userId]: !currentlyFollowing,
      }))
    } catch (error) {
      console.error('Failed to update follow state:', error)
    } finally {
      setFollowLoading((current) => ({
        ...current,
        [userId]: false,
      }))
    }
  }

  return (
    <main className="community-page">
      <section className="community-header">
        <div>
          <p className="eyebrow">ARCADIA COMMUNITY</p>

          <h1>Discover what gamers are playing.</h1>

          <p className="community-subtitle">
            See reviews from the people you follow and discover new players
            across Arcadia.
          </p>
        </div>
      </section>

      <div className="community-layout">
        <section className="community-feed">
          <div className="section-heading">
            <div>
              <h2>Community Feed</h2>
              <p>Recent reviews from the Arcadia community.</p>
            </div>
          </div>

          {loadingReviews && (
            <div className="community-state">
              <p>Loading community activity...</p>
            </div>
          )}

          {!loadingReviews && reviewError && (
            <div className="community-state community-state-error">
              <p>{reviewError}</p>
            </div>
          )}

          {!loadingReviews &&
            !reviewError &&
            reviews.length === 0 && (
              <div className="community-state">
                <h3>No reviews yet</h3>

                <p>
                  Once players start reviewing games, their activity will
                  appear here.
                </p>
              </div>
            )}

          {!loadingReviews &&
            !reviewError &&
            reviews.length > 0 && (
              <div className="community-review-list">
                {reviews.map((review) => (
                  <article
                    className="community-review-card"
                    key={review.id}
                  >
                    <div className="community-review-user">
                      <div className="community-avatar">
                        {review.avatar_url ? (
                          <img
                            src={review.avatar_url}
                            alt=""
                          />
                        ) : (
                          <span>
                            {getDisplayName(review)
                              .charAt(0)
                              .toUpperCase()}
                          </span>
                        )}
                      </div>

                      <div>
                        <strong>
                          {getDisplayName(review)}
                        </strong>

                        <span>
                          @{review.username}
                        </span>
                      </div>
                    </div>

                    <div className="community-game">
                      {review.game_cover_url && (
                        <img
                          src={review.game_cover_url}
                          alt={review.game_title}
                        />
                      )}

                      <div className="community-game-info">
                        <span className="community-game-label">
                          REVIEWED
                        </span>

                        <h3>{review.game_title}</h3>

                        <div className="community-rating">
                          <span>{review.rating}/10</span>

                          <span className="community-review-date">
                            {formatDate(review.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="community-review-content">
                      {review.title && (
                        <h3>{review.title}</h3>
                      )}

                      <p>
                        {review.contains_spoilers
                          ? 'This review contains spoilers.'
                          : review.body}
                      </p>

                      {review.contains_spoilers && (
                        <details>
                          <summary>
                            Show spoiler review
                          </summary>

                          <p>{review.body}</p>
                        </details>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
        </section>

        <aside className="community-sidebar">
          <div className="community-sidebar-card">
            <div className="section-heading">
              <div>
                <h2>Find Gamers</h2>
                <p>People you might want to follow.</p>
              </div>
            </div>

            {loadingSuggestions && (
              <div className="community-sidebar-state">
                Loading players...
              </div>
            )}

            {!loadingSuggestions && suggestionError && (
              <div className="community-sidebar-state community-state-error">
                {suggestionError}
              </div>
            )}

            {!loadingSuggestions &&
              !suggestionError &&
              suggestions.length === 0 && (
                <div className="community-sidebar-state">
                  No new players to suggest right now.
                </div>
              )}

            {!loadingSuggestions &&
              !suggestionError &&
              suggestions.length > 0 && (
                <div className="community-user-list">
                  {suggestions.map((user) => {
                    const isFollowing = following[user.id]
                    const isLoading = followLoading[user.id]

                    return (
                      <div
                        className="community-user"
                        key={user.id}
                      >
                        <div className="community-avatar">
                          {user.avatar_url ? (
                            <img
                              src={user.avatar_url}
                              alt=""
                            />
                          ) : (
                            <span>
                              {getDisplayName(user)
                                .charAt(0)
                                .toUpperCase()}
                            </span>
                          )}
                        </div>

                        <div className="community-user-info">
                          <strong>
                            {getDisplayName(user)}
                          </strong>

                          <span>
                            @{user.username}
                          </span>
                        </div>

                        <button
                          type="button"
                          className={
                            isFollowing
                              ? 'community-follow-button following'
                              : 'community-follow-button'
                          }
                          disabled={isLoading}
                          onClick={() =>
                            handleFollow(user.id)
                          }
                        >
                          {isLoading
                            ? '...'
                            : isFollowing
                              ? 'Following'
                              : 'Follow'}
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
          </div>
        </aside>
      </div>
    </main>
  )
}