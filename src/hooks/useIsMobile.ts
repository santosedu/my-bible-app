import { useSyncExternalStore, useMemo, useCallback } from 'react'

export function useIsMobile(breakpoint = 768): boolean {
  const query = `(max-width: ${breakpoint - 1}px)`

  const { mq } = useMemo(() => {
    const mq = window.matchMedia(query)
    return { mq }
  }, [query])

  const subscribe = useCallback(
    (callback: () => void) => {
      mq.addEventListener('change', callback)
      return () => mq.removeEventListener('change', callback)
    },
    [mq],
  )

  return useSyncExternalStore(
    subscribe,
    () => mq.matches,
    () => false,
  )
}
