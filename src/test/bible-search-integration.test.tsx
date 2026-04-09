import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router'
import { SearchPage } from '@/components/search/SearchPage'
import { useBibleStore } from '@/stores'
import '@testing-library/jest-dom/vitest'

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

function renderWithQuery(query: string) {
  return render(
    <MemoryRouter initialEntries={[`/search${query ? '?q=' + encodeURIComponent(query) : ''}`]}>
      <Routes>
        <Route path="/search" element={<SearchPage />} />
        <Route path="/:bookId/:chapter" element={<div data-testid="chapter-view">Chapter View</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('Bible search integration', () => {
  it('navigates to /john/3 when query is "João 3"', async () => {
    renderWithQuery('João 3')

    await waitFor(
      () => {
        expect(screen.getByTestId('chapter-view')).toBeInTheDocument()
      },
      { timeout: 2000 }
    )
  })

  it('navigates to /psalms/23 when query is "Sl 23"', async () => {
    renderWithQuery('Sl 23')

    await waitFor(
      () => {
        expect(screen.getByTestId('chapter-view')).toBeInTheDocument()
      },
      { timeout: 2000 }
    )
  })

  it('navigates to /1-corinthians/13 when query is "1 Coríntios 13"', async () => {
    renderWithQuery('1 Coríntios 13')

    await waitFor(
      () => {
        expect(screen.getByTestId('chapter-view')).toBeInTheDocument()
      },
      { timeout: 2000 }
    )
  })

  it('navigates to /genesis/1 when query is "Gênesis 1"', async () => {
    renderWithQuery('Gênesis 1')

    await waitFor(
      () => {
        expect(screen.getByTestId('chapter-view')).toBeInTheDocument()
      },
      { timeout: 2000 }
    )
  })

  it('shows error for invalid chapter when query is "João 50"', async () => {
    renderWithQuery('João 50')

    await waitFor(
      () => {
        expect(screen.getByTestId('bible-search-error')).toBeInTheDocument()
      },
      { timeout: 2000 }
    )
    expect(screen.getByText(/Capítulo 50 não existe em João/)).toBeInTheDocument()
  })

  it('shows error for non-existent book when query is "LivroInexistente 1"', async () => {
    renderWithQuery('LivroInexistente 1')

    await waitFor(
      () => {
        expect(screen.getByTestId('bible-search-error')).toBeInTheDocument()
      },
      { timeout: 2000 }
    )
    expect(screen.getByText(/Livro não encontrado/)).toBeInTheDocument()
  })

  it('shows full-text search results for non-bible query "amor"', async () => {
    renderWithQuery('amor')

    await waitFor(
      () => {
        expect(screen.getByTestId('search-results')).toBeInTheDocument()
      },
      { timeout: 2000 }
    )
  })

  it('shows nothing for empty query', async () => {
    renderWithQuery('')

    await waitFor(
      () => {
        expect(screen.queryByTestId('bible-search-error')).not.toBeInTheDocument()
      },
      { timeout: 2000 }
    )
    expect(screen.queryByTestId('search-results')).not.toBeInTheDocument()
  })
})
