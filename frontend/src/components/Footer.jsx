export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span className="brand-word">Arcadia</span>
        <span>Play, track and discover games.</span>
        <span>&copy; {new Date().getFullYear()} Arcadia</span>
      </div>
    </footer>
  )
}
