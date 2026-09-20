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

function formatStatus(status) {
  if (!status) return ''

  return status
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

export default function Admin() {
  const [stats, setStats] = useState(null)
  const [activity, setActivity] = useState([])
  const [libraryStatus, setLibraryStatus] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadDashboard() {
      setLoading(true)
      setError('')

      try {
        const [statsData, activityData, statusData] =
          await Promise.all([
            api.adminStats(),
            api.adminActivity(20),
            api.adminLibraryStatus(),
          ])

        if (cancelled) return

        setStats(statsData)
        setActivity(
          Array.isArray(activityData) ? activityData : [],
        )
        setLibraryStatus(
          Array.isArray(statusData) ? statusData : [],
        )
      } catch (err) {
        if (!cancelled && err.name !== 'AbortError') {
          if (err.status === 403) {
            setError('You do not have administrator access.')
          } else {
            setError(
              err.message || 'Unable to load admin dashboard.',
            )
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadDashboard()

    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <main className="admin-page">
        <div className="admin-state">
          <p>Loading admin dashboard...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="admin-page">
        <div className="admin-state admin-state-error">
          <h2>Unable to load dashboard</h2>
          <p>{error}</p>
        </div>
      </main>
    )
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <p className="admin-eyebrow">
            ARCADIA ADMIN
          </p>

          <h1>Platform Overview</h1>

          <p>
            Monitor the current state of the Arcadia platform.
          </p>
        </div>
      </header>

      <section className="admin-stats">
        <article className="admin-stat-card">
          <span>Users</span>
          <strong>{stats?.users ?? 0}</strong>
          <small>Registered accounts</small>
        </article>

        <article className="admin-stat-card">
          <span>Games</span>
          <strong>{stats?.games ?? 0}</strong>
          <small>Games in database</small>
        </article>

        <article className="admin-stat-card">
          <span>Reviews</span>
          <strong>{stats?.reviews ?? 0}</strong>
          <small>Published reviews</small>
        </article>

        <article className="admin-stat-card">
          <span>Collections</span>
          <strong>{stats?.collections ?? 0}</strong>
          <small>User collections</small>
        </article>

        <article className="admin-stat-card">
          <span>Follows</span>
          <strong>{stats?.follows ?? 0}</strong>
          <small>Social connections</small>
        </article>
      </section>

      <section className="admin-grid">
        <div className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <h2>Recent Activity</h2>
              <p>
                Latest activity recorded by the platform.
              </p>
            </div>
          </div>

          {activity.length === 0 ? (
            <div className="admin-empty">
              <p>No activity recorded yet.</p>
            </div>
          ) : (
            <div className="admin-activity-list">
              {activity.map((item, index) => (
                <div
                  className="admin-activity"
                  key={`${item.created_at}-${index}`}
                >
                  <div className="admin-activity-marker" />

                  <div className="admin-activity-content">
                    <strong>{item.username}</strong>

                    <span>
                      {item.action}
                      {item.target
                        ? ` "${item.target}"`
                        : ''}
                    </span>

                    <small>
                      {formatDate(item.created_at)}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <h2>Library Status</h2>
              <p>
                How users are currently tracking their games.
              </p>
            </div>
          </div>

          {libraryStatus.length === 0 ? (
            <div className="admin-empty">
              <p>No library entries yet.</p>
            </div>
          ) : (
            <div className="admin-status-list">
              {libraryStatus.map((item) => {
                const total = libraryStatus.reduce(
                  (sum, status) => sum + status.count,
                  0,
                )

                const percentage =
                  total > 0
                    ? Math.round(
                        (item.count / total) * 100,
                      )
                    : 0

                return (
                  <div
                    className="admin-status-item"
                    key={item.status}
                  >
                    <div className="admin-status-heading">
                      <span>
                        {formatStatus(item.status)}
                      </span>

                      <strong>
                        {item.count}
                      </strong>
                    </div>

                    <div className="admin-status-bar">
                      <div
                        className="admin-status-fill"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <section className="admin-info-panel">
        <div>
          <h2>System Information</h2>
          <p>
            This dashboard currently reports data directly
            from the Arcadia database. Reports, moderation
            queues, and genre analytics will appear here once
            those systems are implemented.
          </p>
        </div>
      </section>
    </main>
  )
}