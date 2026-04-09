import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BibleSearchError } from '@/components/search/BibleSearchError'
import type { BibleQueryError } from '@/types'

describe('BibleSearchError', () => {
  describe('book_not_found error', () => {
    it('renders "Livro não encontrado" message', () => {
      const error: BibleQueryError = {
        type: 'error',
        errorKind: 'book_not_found',
        message: 'Livro não encontrado. Verifique a digitação e tente novamente.',
      }
      render(<BibleSearchError error={error} />)

      expect(screen.getByText(/Livro não encontrado/)).toBeInTheDocument()
    })
  })

  describe('chapter_out_of_range error', () => {
    it('renders chapter out of range message', () => {
      const error: BibleQueryError = {
        type: 'error',
        errorKind: 'chapter_out_of_range',
        message: 'Capítulo 50 não existe em João. Este livro possui 21 capítulos.',
      }
      render(<BibleSearchError error={error} />)

      expect(screen.getByText(/Capítulo 50 não existe em João/)).toBeInTheDocument()
    })
  })

  describe('rendering attributes', () => {
    it('has data-testid attribute', () => {
      const error: BibleQueryError = {
        type: 'error',
        errorKind: 'book_not_found',
        message: 'Livro não encontrado. Verifique a digitação e tente novamente.',
      }
      const { container } = render(<BibleSearchError error={error} />)

      expect(container.querySelector('[data-testid="bible-search-error"]')).toBeInTheDocument()
    })

    it('renders with warning icon SVG', () => {
      const error: BibleQueryError = {
        type: 'error',
        errorKind: 'book_not_found',
        message: 'Livro não encontrado. Verifique a digitação e tente novamente.',
      }
      const { container } = render(<BibleSearchError error={error} />)

      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
      expect(svg?.getAttribute('viewBox')).toBe('0 0 24 24')
    })
  })
})