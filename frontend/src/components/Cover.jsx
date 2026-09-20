import { useMemo, useState } from 'react'
import { coverSources } from '../lib/games'
import { GamepadIcon } from './Icons'

// Game artwork with a fixed 3:4 box (no layout shift), lazy loading, a fade-in,
// and a readable placeholder when the image is missing or fails to load.
export default function Cover({ url, title, alt = '', large = false, eager = false, className = '' }) {
  const { src, srcSet } = useMemo(() => coverSources(url, large), [url, large])
  const [loadedSrc, setLoadedSrc] = useState(null)
  const [failedSrc, setFailedSrc] = useState(null)
  const broken = !src || failedSrc === src

  return (
    <div className={`cover ${className}`}>
      {broken ? (
        <div className="cover-fallback">
          <GamepadIcon width={28} height={28} />
          <span>{title}</span>
        </div>
      ) : (
        <img
          src={src}
          srcSet={srcSet}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          fetchPriority={eager ? 'high' : undefined}
          decoding="async"
          className={loadedSrc === src ? 'loaded' : ''}
          onLoad={() => setLoadedSrc(src)}
          onError={() => setFailedSrc(src)}
        />
      )}
    </div>
  )
}
