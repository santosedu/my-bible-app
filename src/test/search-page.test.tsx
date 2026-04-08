import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router'
import { SearchPage } from '@/components/search/SearchPage'
import { useBibleStore } from '@/stores'

beforeEach(() => {
  vi.useRealTimers()
  localStorage.clear()
  useBibleStore.setState({
    bookId: null,
    chapter: null,
    activeTranslation: 'ara',
    comparisonTranslations: [],
    comparisonMode: false,
  })
})

describe('SearchPage', () => {
  describe('bible reference query parsing', () => {
    it('navigates to chapter when query is a valid bible reference (João 3)', async () => {
      render(
        <MemoryRouter initialEntries={['/search?q=João 3']}>
          <Routes>
            <Route path="/search" element={<SearchPage />} />
            <Route path="/:bookId/:chapter" element={<div data-testid="chapter-page">Chapter Page</div>} />
          </Routes>
        </MemoryRouter>,
      )

      await waitFor(
        () => {
          expect(screen.queryByTestId('chapter-page')).toBeInTheDocument()
        },
        { timeout: 2000 },
      )
    })

    it('navigates to chapter for abbreviation query (Sl 23)', async () => {
      render(
        <MemoryRouter initialEntries={['/search?q=Sl 23']}>
          <Routes>
            <Route path="/search" element={<SearchPage />} />
            <Route path="/:bookId/:chapter" element={<div data-testid="chapter-page">Chapter Page</div>} />
          </Routes>
        </MemoryRouter>,
      )

      await waitFor(
        () => {
          expect(screen.queryByTestId('chapter-page')).toBeInTheDocument()
        },
        { timeout: 2000 },
      )
    })
  })

  describe('error handling', () => {
    it('renders BibleSearchError when chapter is out of range (João 50)', async () => {
      render(
        <MemoryRouter initialEntries={['/search?q=João 50']}>
          <Routes>
            <Route path="/search" element={<SearchPage />} />
            <Route path="/:bookId/:chapter" element={<div data-testid="chapter-page">Chapter Page</div>} />
          </Routes>
        </MemoryRouter>,
      )

      await waitFor(
        () => {
          expect(screen.getByTestId('bible-search-error')).toBeInTheDocument()
        },
        { timeout: 2000 },
      )
    })

    it('renders error with correct message for chapter_out_of_range', async () => {
      render(
        <MemoryRouter initialEntries={['/search?q=João 50']}>
          <Routes>
            <Route path="/search" element={<SearchPage />} />
            <Route path="/:bookId/:chapter" element={<div data-testid="chapter-page">Chapter Page</div>} />
          </Routes>
        </MemoryRouter>,
      )

      await waitFor(
        () => {
          const errorEl = screen.getByTestId('bible-search-error')
          expect(errorEl).toHaveTextContent(/Capítulo 50 não existe/)
        },
        { timeout: 2000 },
      )
    })

    it('renders BibleSearchError when book not found (XYZ 1)', async () => {
      render(
        <MemoryRouter initialEntries={['/search?q=XYZ 1']}>
          <Routes>
            <Route path="/search" element={<SearchPage />} />
            <Route path="/:bookId/:chapter" element={<div data-testid="chapter-page">Chapter Page</div>} />
          </Routes>
        </MemoryRouter>,
      )

      await waitFor(
        () => {
          expect(screen.getByTestId('bible-search-error')).toBeInTheDocument()
        },
        { timeout: 2000 },
      )
    })
  })

  describe('full-text search fallback', () => {
    it('renders SearchResults when query is not a bible reference (amor)', async () => {
      render(
        <MemoryRouter initialEntries={['/search?q=amor']}>
          <Routes>
            <Route path="/search" element={<SearchPage />} />
            <Route path="/:bookId/:chapter" element={<div data-testid="chapter-page">Chapter Page</div>} />
          </Routes>
        </MemoryRouter>,
      )

      await waitFor(
        () => {
          expect(screen.getByTestId('search-results')).toBeInTheDocument()
        },
        { timeout: 2000 },
      )
    })

    it('does not render error component for non-reference queries', async () => {
      render(
        <MemoryRouter initialEntries={['/search?q=amor']}>
          <Routes>
            <Route path="/search" element={<SearchPage />} />
            <Route path="/:bookId/:chapter" element={<div data-testid="chapter-page">Chapter Page</div>} />
          </Routes>
        </MemoryRouter>,
      )

      await waitFor(
        () => {
          expect(screen.queryByTestId('bible-search-error')).not.toBeInTheDocument()
        },
        { timeout: 2000 },
      )
    })

    it('renders SearchResults for partial book name without chapter', async () => {
      render(
        <MemoryRouter initialEntries={['/search?q=João']}>
          <Routes>
            <Route path="/search" element={<SearchPage />} />
            <Route path="/:bookId/:chapter" element={<div data-testid="chapter-page">Chapter Page</div>} />
          </Routes>
        </MemoryRouter>,
      )

      await waitFor(
        () => {
          expect(screen.getByTestId('search-results')).toBeInTheDocument()
        },
        { timeout: 2000 },
      )
    })
  })

  describe('empty query', () => {
    it('does not render results or error for empty query', async () => {
      render(
        <MemoryRouter initialEntries={['/search']}>
          <Routes>
            <Route path="/search" element={<SearchPage />} />
            <Route path="/:bookId/:chapter" element={<div data-testid="chapter-page">Chapter Page</div>} />
          </Routes>
        </MemoryRouter>,
      )

      await waitFor(
        () => {
          expect(screen.queryByTestId('search-results')).not.toBeInTheDocument()
          expect(screen.queryByTestId('bible-search-error')).not.toBeInTheDocument()
        },
        { timeout: 2000 },
      )
    })
  })
})