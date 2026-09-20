import { Link } from 'react-router-dom'
import { usePageTitle } from '../hooks/usePageTitle'

export default function NotFound() {
  usePageTitle('Page not found')
  return (
    <section className="container not-found">
      <h1 className="nf-code">404</h1>
      <p className="nf-title">Game not found in this universe.</p>
      <p className="nf-text">The page you're looking for doesn't exist or has moved on to another level.</p>
      <div className="hero-actions">
        <Link to="/" className="btn primary btn-lg">Back to home</Link>
        <Link to="/discover" className="btn ghost btn-lg">Discover games</Link>
      </div>
    </section>
  )
}
