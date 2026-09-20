import { useState } from 'react'
import { RATING_MAX } from '../lib/constants'
import { StarIcon } from './Icons'

export default function RatingStars({ value, onChange, small = false }) {
  const [hover, setHover] = useState(0)
  const shown = hover || value || 0
  return (
    <div className={`stars ${small ? 'small' : ''}`} role="radiogroup" aria-label="Your rating" onMouseLeave={() => setHover(0)}>
      {Array.from({ length: RATING_MAX }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} ${n === 1 ? 'star' : 'stars'}`}
          className={n <= shown ? 'on' : ''}
          onMouseEnter={() => setHover(n)}
          onClick={() => onChange(n)}
        >
          <StarIcon width={small ? 16 : 24} height={small ? 16 : 24} />
        </button>
      ))}
    </div>
  )
}
