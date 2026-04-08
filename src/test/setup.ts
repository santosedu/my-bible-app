import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

const noOpScroll = function (_: boolean | ScrollIntoViewOptions) { void _ }
Element.prototype.scrollIntoView = vi.fn(noOpScroll)

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
})
