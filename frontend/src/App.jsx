import { useEffect, useMemo, useState } from 'react'
import { api } from './api'
import { featuredGames, librarySeed } from './mockData'

const icons = {
  home: '⌂',
  discover: '◈',
  library: '▣',
  profile: '◎',
  search: '⌕',
  plus: '+',
  arrow: '→',
  star: '★',
  menu: '☰',
  close: '×',
}

function App() {
  const [page, setPage] = useState('home')
  const [search, setSearch] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [selected, setSelected] = useState(null)
  const [library, setLibrary] = useState(librarySeed)
  const [toast, setToast] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('arcadia_token')
    if (token) api.me().then(setUser).catch(() => localStorage.removeItem('arcadia_token'))
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 2600)
    return () => clearTimeout(t)
  }, [toast])

  const nav = (target) => {
    setPage(target)
    setSelected(null)
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const runSearch = async (value = search) => {
    const q = value.trim()
    if (!q) return
    setSearching(true)
    try {
      const data = await api.searchGames(q)
      setResults(Array.isArray(data) ? data : data?.results || [])
      setPage('discover')
    } catch {
      setToast('Backend search is unavailable — showing demo results.')
      setResults(featuredGames.filter(g => g.title.toLowerCase().includes(q.toLowerCase())))
      setPage('discover')
    } finally {
      setSearching(false)
    }
  }

  const openGame = async (game) => {
    setSelected(game)
    setPage('game')
    try {
      if (game.id || game.external_id) {
        const detail = await api.gameDetails(game.external_id || game.id)
        setSelected({ ...game, ...detail })
      }
    } catch {
      // Demo cards still work without a running backend.
    }
  }

  const addToLibrary = async (game) => {
    try {
      if (game.external_id || game.id) await api.addExternalGame(game.external_id || game.id)
      setToast(`${game.name || game.title || 'Game'} added to your library.`)
    } catch {
      setToast('Demo mode: game added locally.')
    }
    setLibrary(prev => [{ ...game, title: game.name || game.title, status: 'Backlog', progress: 0 }, ...prev])
  }

  return (
    <div className="app-shell">
      <div className="noise" />
      <Header
        page={page}
        nav={nav}
        search={search}
        setSearch={setSearch}
        runSearch={runSearch}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        onLogin={() => { setAuthMode('login'); setAuthOpen(true) }}
        user={user}
      />

      <main>
        {page === 'home' && (
          <Home onExplore={() => nav('discover')} onOpenGame={openGame} onAdd={addToLibrary} />
        )}
        {page === 'discover' && (
          <Discover search={search} setSearch={setSearch} results={results} searching={searching} onSearch={runSearch} onOpenGame={openGame} onAdd={addToLibrary} />
        )}
        {page === 'library' && <Library games={library} onOpenGame={openGame} />}
        {page === 'profile' && <Profile user={user} onLogin={() => { setAuthMode('login'); setAuthOpen(true) }} />}
        {page === 'game' && selected && <GameDetails game={selected} onBack={() => nav('discover')} onAdd={() => addToLibrary(selected)} />}
      </main>

      <Footer />
      {toast && <div className="toast">{toast}</div>}
      {authOpen && (
        <AuthModal
          mode={authMode}
          setMode={setAuthMode}
          close={() => setAuthOpen(false)}
          onSuccess={(data) => { setUser(data?.user || data); setAuthOpen(false); setToast('Welcome to ARCADIA.') }}
        />
      )}
    </div>
  )
}

function Header({ page, nav, search, setSearch, runSearch, menuOpen, setMenuOpen, onLogin, user }) {
  return (
    <header className="topbar">
      <button className="brand" onClick={() => nav('home')} aria-label="ARCADIA home">
        <span className="brand-icon">A</span>
        <span className="brand-word">ARCADIA</span>
      </button>

      <nav className={menuOpen ? 'nav-links open' : 'nav-links'}>
        <button className={page === 'home' ? 'active' : ''} onClick={() => nav('home')}>Home</button>
        <button className={page === 'discover' ? 'active' : ''} onClick={() => nav('discover')}>Discover</button>
        <button className={page === 'library' ? 'active' : ''} onClick={() => nav('library')}>Library</button>
        <button className={page === 'profile' ? 'active' : ''} onClick={() => nav('profile')}>Profile</button>
      </nav>

      <div className="header-actions">
        <form className="search-mini" onSubmit={(e) => { e.preventDefault(); runSearch() }}>
          <span>{icons.search}</span>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search games..." />
        </form>
        <button className="avatar-btn" onClick={() => nav('profile')}>{user?.username?.[0]?.toUpperCase() || 'G'}</button>
        <button className="menu-btn" onClick={() => setMenuOpen(v => !v)}>{menuOpen ? icons.close : icons.menu}</button>
      </div>
    </header>
  )
}

function Home({ onExplore, onOpenGame, onAdd }) {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span /> YOUR GAMING UNIVERSE</div>
          <h1>PLAY.<br /><em>TRACK.</em><br />DISCOVER.</h1>
          <p>One place for every game you love, every game you want, and every memory in between.</p>
          <div className="hero-cta">
            <button className="btn primary" onClick={onExplore}>Explore games <span>→</span></button>
            <button className="btn ghost" onClick={() => onOpenGame(featuredGames[1])}>Featured game</button>
          </div>
          <div className="hero-meta">
            <div><strong>2.4K+</strong><span>games tracked</span></div>
            <div><strong>4.8K</strong><span>players</span></div>
            <div><strong>∞</strong><span>stories to collect</span></div>
          </div>
        </div>
        <div className="hero-art">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="hero-panel">
            <div className="hero-panel-top"><span>FEATURED / 001</span><span>ARCADIA</span></div>
            <div className="hero-poster" />
            <div className="hero-panel-bottom">
              <div><small>NOW PLAYING</small><h2>ELDEN<br />RING</h2></div>
              <div className="rating"><span>★</span> 9.6</div>
            </div>
          </div>
          <div className="floating-chip chip-one">+ 12 friends online</div>
          <div className="floating-chip chip-two">● LIVE ACTIVITY</div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div><span className="eyebrow">CURATED</span><h2>Games worth playing.</h2></div>
          <button className="link-btn" onClick={onExplore}>View all {icons.arrow}</button>
        </div>
        <div className="game-grid">
          {featuredGames.map(game => <GameCard key={game.id} game={game} onOpen={() => onOpenGame(game)} onAdd={() => onAdd(game)} />)}
        </div>
      </section>

      <section className="statement">
        <div className="statement-mark">A</div>
        <div><span className="eyebrow">YOUR COLLECTION. YOUR STORY.</span><h2>Every game has<br /><em>a place here.</em></h2></div>
        <p>Track what you're playing. Remember what you finished. Build a backlog that actually makes you excited.</p>
      </section>
    </>
  )
}

function Discover({ search, setSearch, results, searching, onSearch, onOpenGame, onAdd }) {
  const games = results.length ? results : featuredGames
  return (
    <section className="page-section">
      <div className="page-title">
        <div><span className="eyebrow">EXPLORE</span><h1>Discover games.</h1><p>Search the world's games through the ARCADIA backend.</p></div>
        <form className="big-search" onSubmit={(e) => { e.preventDefault(); onSearch() }}>
          <span>{icons.search}</span><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Try Elden Ring, GTA, Hollow Knight..." /><button>Search</button>
        </form>
      </div>
      <div className="result-row"><span>{searching ? 'Searching...' : results.length ? `${results.length} results` : 'Featured picks'}</span><span>POPULAR / RECENT</span></div>
      <div className="game-grid">{games.map((game, i) => <GameCard key={game.id || game.external_id || i} game={normaliseGame(game, i)} onOpen={() => onOpenGame(game)} onAdd={() => onAdd(game)} />)}</div>
    </section>
  )
}

function normaliseGame(game, i = 0) {
  return {
    ...game,
    id: game.id || game.external_id || String(i),
    title: game.title || game.name || 'Untitled game',
    genre: game.genre || game.genres?.map?.(g => g.name).join(' • ') || 'Game',
    score: game.score || game.rating?.toFixed?.(1) || '—',
    cover: game.cover || game.cover_url || game.image || featuredGames[i % featuredGames.length].cover,
  }
}

function GameCard({ game, onOpen, onAdd }) {
  const g = normaliseGame(game)
  return (
    <article className="game-card" onClick={onOpen}>
      <div className={`cover cover-${g.accent || 'violet'}`} style={g.cover ? { backgroundImage: `url("${g.cover}")` } : undefined}>
        <div className="cover-shade" />
        <button className="quick-add" onClick={(e) => { e.stopPropagation(); onAdd() }}>+</button>
        <div className="cover-number">{String(g.id).slice(-2).padStart(2, '0')}</div>
        <div className="cover-title">{g.title}</div>
      </div>
      <div className="card-info"><div><h3>{g.title}</h3><p>{g.genre}</p></div><strong><span>★</span> {g.score}</strong></div>
    </article>
  )
}

function Library({ games, onOpenGame }) {
  const [filter, setFilter] = useState('All')
  const filtered = filter === 'All' ? games : games.filter(g => g.status === filter)
  return (
    <section className="page-section">
      <div className="page-title simple"><div><span className="eyebrow">YOUR COLLECTION</span><h1>My library.</h1><p>{games.length} games in your universe.</p></div><button className="btn primary" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>+ Add game</button></div>
      <div className="tabs">{['All', 'Playing', 'Completed', 'Backlog'].map(x => <button key={x} className={filter === x ? 'active' : ''} onClick={() => setFilter(x)}>{x}</button>)}</div>
      <div className="library-list">{filtered.map((game, i) => <div className="library-row" key={game.id || i} onClick={() => onOpenGame(game)}><div className="mini-cover" style={game.cover ? { backgroundImage: `url("${game.cover}")` } : undefined}>{!game.cover && 'A'}</div><div className="library-main"><h3>{game.title}</h3><p>{game.genre}</p><div className="progress"><span style={{ width: `${game.progress || 0}%` }} /></div></div><span className={`status status-${game.status.toLowerCase()}`}>{game.status}</span><strong className="library-score">★ {game.score || '—'}</strong><span className="row-arrow">→</span></div>)}</div>
    </section>
  )
}

function Profile({ user, onLogin }) {
  return (
    <section className="page-section profile-page">
      <div className="profile-hero"><div className="profile-avatar">{user?.username?.[0]?.toUpperCase() || 'A'}</div><div><span className="eyebrow">PLAYER PROFILE</span><h1>{user?.username || 'Arcadian'}</h1><p>Building a universe one game at a time.</p></div>{!user && <button className="btn primary" onClick={onLogin}>Sign in</button>}</div>
      <div className="stat-grid"><Stat n="24" label="Games tracked" /><Stat n="8" label="Completed" /><Stat n="12" label="Backlog" /><Stat n="4.7" label="Avg. rating" /></div>
      <div className="profile-grid"><div className="profile-card"><span className="eyebrow">RECENT ACTIVITY</span><h2>Game journey</h2><div className="activity"><div><b>Added Elden Ring</b><span>2 hours ago</span></div><div><b>Finished Hollow Knight</b><span>Yesterday</span></div><div><b>Rated Cyberpunk 2077</b><span>3 days ago</span></div></div></div><div className="profile-card accent-card"><span className="eyebrow">ARCADIA LEVEL</span><h2>Explorer</h2><div className="level-line"><span style={{ width: '68%' }} /></div><p>680 / 1000 XP</p></div></div>
    </section>
  )
}

function Stat({ n, label }) { return <div className="stat"><strong>{n}</strong><span>{label}</span></div> }

function GameDetails({ game, onBack, onAdd }) {
  const g = normaliseGame(game)
  return (
    <section className="game-detail">
      <button className="back-btn" onClick={onBack}>← Back to discover</button>
      <div className="detail-grid">
        <div className="detail-cover" style={g.cover ? { backgroundImage: `url("${g.cover}")` } : undefined}><span>ARCADIA / GAME</span></div>
        <div className="detail-copy"><span className="eyebrow">GAME DETAILS</span><h1>{g.title}</h1><p className="detail-genres">{g.genre}</p><div className="detail-rating"><strong>{g.score}</strong><span>★</span><small>ARCADIA SCORE</small></div><p className="detail-text">Discover the game, save it to your collection, and track your journey through ARCADIA.</p><div className="detail-actions"><button className="btn primary" onClick={onAdd}>+ Add to library</button><button className="btn ghost">Rate game</button></div><div className="detail-meta"><span>STATUS<strong>Backlog</strong></span><span>PLATFORM<strong>Multi-platform</strong></span><span>YEAR<strong>—</strong></span></div></div>
      </div>
    </section>
  )
}

function AuthModal({ mode, setMode, close, onSuccess }) {
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const submit = async (e) => {
    e.preventDefault(); setLoading(true); setError('')
    try {
      const data = mode === 'login' ? await api.login({ email: form.email, password: form.password }) : await api.register(form)
      const token = data?.access_token || data?.token
      if (token) localStorage.setItem('arcadia_token', token)
      onSuccess(data)
    } catch (err) { setError(err.message || 'Something went wrong.') }
    finally { setLoading(false) }
  }
  return <div className="modal-backdrop" onMouseDown={close}><div className="auth-modal" onMouseDown={e => e.stopPropagation()}><button className="modal-close" onClick={close}>×</button><span className="brand-word">ARCADIA</span><span className="eyebrow">{mode === 'login' ? 'WELCOME BACK' : 'JOIN THE UNIVERSE'}</span><h2>{mode === 'login' ? 'Enter your world.' : 'Create your world.'}</h2><form onSubmit={submit}>{mode === 'register' && <input required placeholder="Username" value={form.username} onChange={e => setForm({...form, username: e.target.value})} />}<input required type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /><input required type="password" placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />{error && <p className="form-error">{error}</p>}<button className="btn primary full" disabled={loading}>{loading ? 'Connecting...' : mode === 'login' ? 'Log in →' : 'Create account →'}</button></form><button className="switch-auth" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}>{mode === 'login' ? 'Need an account? Create one' : 'Already have an account? Log in'}</button></div></div>
}

function Footer() {
  return <footer><div className="brand"><span className="brand-icon">A</span><span className="brand-word">ARCADIA</span></div><span>PLAY / TRACK / DISCOVER</span><span>© 2026 ARCADIA</span></footer>
}

export default App