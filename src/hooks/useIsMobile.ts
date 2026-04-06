import { useSyncExternalStore, useMemo } from 'react'

export function useIsMobile(breakpoint = 768): boolean {
  const query = `(max-width: ${breakpoint - 1}px)`

  const subscribe = useMemo(
    () => (callback: () => void) => {
      const mq = window.matchMedia(query)
      mq.addEventListener('change', callback)
      return () => mq.removeEventListener('change', callback)
    },
    [query],
  )

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  )
}
