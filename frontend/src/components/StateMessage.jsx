// One pattern for empty, error and not-found states: what happened + what to do next.
export default function StateMessage({ icon, title, children, actions, tone = 'neutral' }) {
  return (
    <div className={`state state-${tone}`} role={tone === 'error' ? 'alert' : undefined}>
      {icon && <div className="state-icon">{icon}</div>}
      <h2>{title}</h2>
      {children && <p>{children}</p>}
      {actions && <div className="state-actions">{actions}</div>}
    </div>
  )
}
