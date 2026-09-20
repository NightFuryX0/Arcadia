import { STATUSES } from '../lib/constants'

export default function StatusPicker({ value, onChange }) {
  return (
    <div className="status-picker" role="radiogroup" aria-label="Library status">
      {STATUSES.map((s) => (
        <button
          key={s.value}
          type="button"
          role="radio"
          aria-checked={value === s.value}
          className={`status-option tone-${s.value} ${value === s.value ? 'active' : ''}`}
          onClick={() => onChange(s.value)}
          title={s.hint}
        >
          {s.label}
        </button>
      ))}
    </div>
  )
}
