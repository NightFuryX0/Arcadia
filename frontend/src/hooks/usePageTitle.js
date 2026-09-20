import { useEffect } from 'react'

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | Arcadia` : 'Arcadia'
  }, [title])
}
