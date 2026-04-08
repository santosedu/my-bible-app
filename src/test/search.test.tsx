import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { BrowserRouter, MemoryRouter, Routes, Route, useLocation } from 'react-router'
import userEvent from '@testing-library/user-event'
import { useBibleStore } from '@/stores'
import { SearchInput } from '@/components/search/SearchInput'
import { SearchResults } from '@/components/search/SearchResults'
import { SearchPage } from '@/components/search/SearchPage'
import { getSearchResults } from '@/data/bibleData'
import type { SearchResult } from '@/types'

getSearchResults('a', 'ara')

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

beforeEach(() => {
  window.history.pushState({}, 'Test', '/')
  localStorage.clear()
  useBibleStore.setState({
    bookId: null,
    chapter: null,
    activeTranslation: 'nvi',
    comparisonTranslations: [],
    comparisonMode: false,
  })
})

describe('SearchInput', () => {
  it('renders search input with placeholder', () => {
    const onSearch = vi.fn()
    render(
      <BrowserRouter>
        <SearchInput onSearch={onSearch} />
      </BrowserRouter>,
    )

    const input = screen.getByPlaceholderText('Buscar na Bíblia...')
    expect(input).toBeDefined()
  })

  it('calls onSearch after debounce', async () => {
    vi.useFakeTimers()
    const onSearch = vi.fn()

    render(
      <BrowserRouter>
        <SearchInput onSearch={onSearch} />
      </BrowserRouter>,
    )

    const input = screen.getByPlaceholderText('Buscar na Bíblia...')
    fireEvent.change(input, { target: { value: 'amor' } })

    vi.advanceTimersByTime(300)
    expect(onSearch).toHaveBeenCalledWith('amor')

    vi.useRealTimers()
  }, 10000)

  it('shows clear button when query is provided in URL', () => {
    const onSearch = vi.fn()
    render(
      <BrowserRouter>
        <SearchInput onSearch={onSearch} initialQuery="test" />
      </BrowserRouter>,
    )

    const clearButton = screen.getByRole('button', { name: /limpar/i })
    expect(clearButton).toBeDefined()
  })

  it('calls onSearch when clear button is clicked', async () => {
    const user = userEvent.setup()
    const onSearch = vi.fn()

    render(
      <BrowserRouter>
        <SearchInput onSearch={onSearch} initialQuery="test" />
      </BrowserRouter>,
    )

    const clearButton = screen.getByRole('button', { name: /limpar/i })
    await user.click(clearButton)

    expect(onSearch).toHaveBeenCalledWith('')
  })
})

describe('SearchResults', () => {
  const mockResults: SearchResult[] = [
    {
      bookId: 'genesis',
      bookName: 'Gênesis',
      chapter: 1,
      verse: 1,
      text: 'No princípio criou Deus os céus e a terra.',
      score: 10,
    },
    {
      bookId: 'genesis',
      bookName: 'Gênesis',
      chapter: 1,
      verse: 2,
      text: 'E a terra era sem forma e vazia; e havia trevas sobre a face do abismo.',
      score: 5,
    },
    {
      bookId: 'john',
      bookName: 'João',
      chapter: 1,
      verse: 1,
      text: 'No princípio era o Verbo, e o Verbo estava com Deus, e o Verbo era Deus.',
      score: 10,
    },
  ]

  it('renders results grouped by book', () => {
    render(
      <MemoryRouter>
        <SearchResults results={mockResults} query="princípio" />
      </MemoryRouter>,
    )

    expect(screen.getByText('Gênesis')).toBeDefined()
    expect(screen.getByText('João')).toBeDefined()
  })

  it('displays verse text, book name, chapter and verse', () => {
    const singleBookResults: SearchResult[] = [
      {
        bookId: 'genesis',
        bookName: 'Gênesis',
        chapter: 1,
        verse: 1,
        text: 'No princípio criou Deus os céus e a terra.',
        score: 10,
      },
    ]
    render(
      <MemoryRouter>
        <SearchResults results={singleBookResults} query="princípio" />
      </MemoryRouter>,
    )

    expect(screen.getByText('Gênesis')).toBeDefined()
    expect(screen.getByText(/1:1/)).toBeDefined()
    expect(screen.getByText(/No princípio criou Deus/)).toBeDefined()
  })

  it('shows no results message when results are empty', () => {
    render(
      <MemoryRouter>
        <SearchResults results={[]} query="xyznone" />
      </MemoryRouter>,
    )

    expect(screen.getByTestId('no-results')).toBeDefined()
    expect(screen.getByText(/Nenhum resultado encontrado/)).toBeDefined()
  })

  it('renders up to 50 results', () => {
    const manyResults: SearchResult[] = Array.from({ length: 50 }, (_, i) => ({
      bookId: 'genesis',
      bookName: 'Gênesis',
      chapter: Math.floor(i / 20) + 1,
      verse: (i % 20) + 1,
      text: `Verse ${i}`,
      score: 1,
    }))

    const { container } = render(
      <MemoryRouter>
        <SearchResults results={manyResults} query="verse" />
      </MemoryRouter>,
    )
    const buttons = container.querySelectorAll('button')

    expect(buttons.length).toBe(50)
  })
})

describe('SearchPage', () => {
  it('renders search page with input', () => {
    render(
      <MemoryRouter initialEntries={['/search']}>
        <Routes>
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByTestId('search-page')).toBeDefined()
    expect(screen.getByPlaceholderText('Buscar na Bíblia...')).toBeDefined()
  })

  it('loads results from URL query parameter', async () => {
    render(
      <MemoryRouter initialEntries={['/search?q=amor']}>
        <Routes>
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.queryByTestId('no-results')).toBeNull()
    })
  })

  it('shows no results for non-existent word', async () => {
    render(
      <MemoryRouter initialEntries={['/search?q=nonexistentword12345']}>
        <Routes>
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </MemoryRouter>,
    )

    await waitFor(
      () => {
        expect(screen.getByTestId('no-results')).toBeDefined()
      },
      { timeout: 1000 },
    )
  })
})

describe('Search navigation', () => {
  it('navigates to passage with verse parameter when clicking a result', async () => {
    const user = userEvent.setup()
    const mockResults: SearchResult[] = [
      {
        bookId: 'genesis',
        bookName: 'Gênesis',
        chapter: 1,
        verse: 1,
        text: 'No princípio criou Deus os céus e a terra.',
        score: 10,
      },
    ]

    render(
      <MemoryRouter initialEntries={['/search']}>
        <Routes>
          <Route path="/search" element={<SearchResults results={mockResults} query="princípio" />} />
          <Route path="/:bookId/:chapter" element={<div data-testid="chapter-page">Chapter Page</div>} />
        </Routes>
      </MemoryRouter>,
    )

    const button = screen.getByText(/No princípio criou Deus/)
    await user.click(button)

    expect(screen.getByTestId('chapter-page')).toBeDefined()
  })

  it('includes correct verse number in navigation URL', async () => {
    const user = userEvent.setup()
    const mockResults: SearchResult[] = [
      {
        bookId: 'genesis',
        bookName: 'Gênesis',
        chapter: 1,
        verse: 1,
        text: 'No princípio criou Deus os céus e a terra.',
        score: 10,
      },
      {
        bookId: 'john',
        bookName: 'João',
        chapter: 3,
        verse: 16,
        text: 'Porque Deus amou o mundo de tal forma que deu o seu Filho unigênito.',
        score: 10,
      },
    ]

    const LocationChecker = () => {
      const location = useLocation()
      return <span data-testid="location">{location.search}</span>
    }

    render(
      <MemoryRouter initialEntries={['/search']}>
        <Routes>
          <Route path="/search" element={<SearchResults results={mockResults} query="amor" />} />
          <Route
            path="/:bookId/:chapter"
            element={
              <div data-testid="chapter-page">
                <LocationChecker />
              </div>
            }
          />
        </Routes>
      </MemoryRouter>,
    )

    const genesisButton = screen.getByText(/No princípio criou Deus/)
    await user.click(genesisButton)

    await waitFor(() => {
      const locationSpan = screen.getByTestId('location')
      expect(locationSpan.textContent).toContain('verse=1')
    })
  })
})
