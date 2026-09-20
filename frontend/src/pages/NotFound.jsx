import { Link } from 'react-router-dom'

import { usePageTitle } from '../hooks/usePageTitle'

import notFoundImage from '../assets/404.png'

function HomeGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
    </svg>
  )
}

function CompassGlyph() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9.5" />
      <path d="m15.5 8.5-2 5-5 2 2-5z" />
    </svg>
  )
}

function SparkleGlyph() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M12 2c0 6 4 10 10 10-6 0-10 4-10 10 0-6-4-10-10-10 6 0 10-4 10-10z" strokeLinejoin="round" />
    </svg>
  )
}

export default function NotFound() {
  usePageTitle('Page not found')

  return (
    <section className="container not-found">
      <h1 className="nf-code">404</h1>

      <img src={notFoundImage} alt="" className="not-found-image" />

      <p className="nf-title">Game not found in this universe.</p>

      <p className="nf-text">
        The page you're looking for doesn't exist
        <br />
        or has moved on to another level.
      </p>

      <div className="hero-actions">
        <Link to="/" className="btn btn-lg nf-btn nf-btn-primary">
          <HomeGlyph />
          Back to home
        </Link>

        <Link to="/discover" className="btn btn-lg nf-btn nf-btn-dark">
          <CompassGlyph />
          Discover games
        </Link>
      </div>

      <div className="nf-brand" aria-hidden="true">
        <div className="nf-brand-line">
          <span />
          <SparkleGlyph />
          <span />
        </div>
        <strong>Arcadia</strong>
      </div>
    </section>
  )
}