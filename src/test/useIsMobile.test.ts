import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'

describe('useIsMobile', () => {
  it('returns false for desktop viewport', async () => {
    const mq = {
      matches: false,
      media: '(max-width: 767px)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
      onchange: null,
    }
    vi.spyOn(window, 'matchMedia').mockReturnValue(mq as unknown as MediaQueryList)

    const { useIsMobile } = await import('@/hooks/useIsMobile')
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)
  })

  it('returns true for mobile viewport', async () => {
    const mq = {
      matches: true,
      media: '(max-width: 767px)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
      onchange: null,
    }
    vi.spyOn(window, 'matchMedia').mockReturnValue(mq as unknown as MediaQueryList)

    const { useIsMobile } = await import('@/hooks/useIsMobile')
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(true)
  })

  it('subscribes to media query changes', async () => {
    const listeners: Array<() => void> = []
    const mq = {
      matches: false,
      media: '(max-width: 767px)',
      addEventListener: vi.fn((_event: string, cb: () => void) => {
        listeners.push(cb)
      }),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
      onchange: null,
    }
    vi.spyOn(window, 'matchMedia').mockReturnValue(mq as unknown as MediaQueryList)

    const { useIsMobile } = await import('@/hooks/useIsMobile')
    renderHook(() => useIsMobile())

    expect(mq.addEventListener).toHaveBeenCalledWith('change', expect.any(Function))
    expect(listeners.length).toBe(1)
  })
})
