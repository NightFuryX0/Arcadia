import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import AuthModal from './components/AuthModal'
import Footer from './components/Footer'
import Header from './components/Header'
import { useAuth } from './context/AuthContext'
import Discover from './pages/Discover'
import GameDetails from './pages/GameDetails'
import Home from './pages/Home'

// Pages that aren't part of the first visit are loaded on demand.
const Library = lazy(() => import('./pages/Library'))
const Profile = lazy(() => import('./pages/Profile'))
const NotFound = lazy(() => import('./pages/NotFound'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  const location = useLocation()
  const { modal } = useAuth()

  return (
    <div className="app-shell">
      <a href="#main" className="skip-link">Skip to content</a>
      <ScrollToTop />
      <Header />

      <main id="main">
        {/* Keyed by path so each page gets a short fade-in; query-string changes (search) don't retrigger it. */}
        <div className="page-transition" key={location.pathname}>
          <Suspense fallback={<div className="page-fallback" aria-busy="true" />}>
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/game/:id" element={<GameDetails />} />
              <Route path="/library" element={<Library />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>
      </main>

      <Footer />
      {modal && <AuthModal />}
    </div>
  )
}
