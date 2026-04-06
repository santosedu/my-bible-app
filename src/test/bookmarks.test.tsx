import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router'
import userEvent from '@testing-library/user-event'
import { useBibleStore, useProgressStore, useStudyStore, useThemeStore } from '@/stores'
import { ChapterReader } from '@/components/reader/ChapterReader'
import { BookmarkButton } from '@/components/study/BookmarkButton'
import { BookmarksPanel } from '@/components/study/BookmarksPanel'

beforeEach(() => {
  window.history.pushState({}, 'Test', '/')
  localStorage.clear()
  useBibleStore.setState({
    bookId: null,
    chapter: null,
    activeTranslation: 'ara',
    comparisonTranslations: [],
    comparisonMode: false,
  })
  useStudyStore.setState({ highlights: [], notes: [], bookmarks: [] })
  useProgressStore.setState({ readChapters: new Set() })
  useThemeStore.setState({ preference: 'system' })

  vi.stubGlobal(
    'IntersectionObserver',
    class MockIntersectionObserver {
      constructor() {}
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  )
})

describe('BookmarkButton', () => {
  it('renders bookmark button', () => {
    render(
      <BookmarkButton bookId="genesis" chapter={1} />,
    )

    expect(screen.getByTestId('bookmark-button')).toBeDefined()
  })

  it('shows default (inactive) styling when not bookmarked', () => {
    render(
      <BookmarkButton bookId="genesis" chapter={1} />,
    )

    const button = screen.getByTestId('bookmark-button')
    expect(button.classList.contains('active')).toBe(false)
  })

  it('shows active styling (bookmark color) when bookmarked', () => {
    useStudyStore.getState().addBookmark({
      bookId: 'genesis',
      chapter: 1,
      verse: null,
      label: 'Chapter bookmark',
    })

    render(
      <BookmarkButton bookId="genesis" chapter={1} verse={null} label="Chapter bookmark" />,
    )

    const button = screen.getByTestId('bookmark-button')
    expect(button.classList.contains('active')).toBe(true)
  })

  it('calls addBookmark when clicking on inactive bookmark', async () => {
    const user = userEvent.setup()
    render(
      <BookmarkButton bookId="genesis" chapter={1} label="Test label" />,
    )

    await user.click(screen.getByTestId('bookmark-button'))

    const bookmarks = useStudyStore.getState().bookmarks
    expect(bookmarks).toHaveLength(1)
    expect(bookmarks[0]).toEqual(
      expect.objectContaining({
        bookId: 'genesis',
        chapter: 1,
        verse: null,
        label: 'Test label',
      }),
    )
  })

  it('calls removeBookmark when clicking on active bookmark', async () => {
    const user = userEvent.setup()
    useStudyStore.getState().addBookmark({
      bookId: 'genesis',
      chapter: 1,
      verse: null,
      label: '',
    })

    render(
      <BookmarkButton bookId="genesis" chapter={1} verse={null} label="" />,
    )

    await user.click(screen.getByTestId('bookmark-button'))

    const bookmarks = useStudyStore.getState().bookmarks
    expect(bookmarks).toHaveLength(0)
  })

  it('toggles bookmark state on click', async () => {
    const user = userEvent.setup()
    render(
      <BookmarkButton bookId="genesis" chapter={1} verse={5} />,
    )

    expect(useStudyStore.getState().bookmarks).toHaveLength(0)

    await user.click(screen.getByTestId('bookmark-button'))
    expect(useStudyStore.getState().bookmarks).toHaveLength(1)

    await user.click(screen.getByTestId('bookmark-button'))
    expect(useStudyStore.getState().bookmarks).toHaveLength(0)
  })

  it('has correct aria-label when inactive', () => {
    render(
      <BookmarkButton bookId="genesis" chapter={1} />,
    )

    const button = screen.getByTestId('bookmark-button')
    expect(button.getAttribute('aria-label')).toBe('Adicionar marcador')
  })

  it('has correct aria-label when active', () => {
    useStudyStore.getState().addBookmark({
      bookId: 'genesis',
      chapter: 1,
      verse: null,
      label: '',
    })

    render(
      <BookmarkButton bookId="genesis" chapter={1} verse={null} label="" />,
    )

    const button = screen.getByTestId('bookmark-button')
    expect(button.getAttribute('aria-label')).toBe('Remover marcador')
  })

  it('handles verse bookmark correctly', async () => {
    const user = userEvent.setup()
    render(
      <BookmarkButton bookId="genesis" chapter={1} verse={5} label="Verse 5" />,
    )

    await user.click(screen.getByTestId('bookmark-button'))

    const bookmarks = useStudyStore.getState().bookmarks
    expect(bookmarks[0].verse).toBe(5)
  })

  it('uses smaller size when specified', () => {
    render(
      <BookmarkButton bookId="genesis" chapter={1} size="sm" />,
    )

    const svg = screen.getByTestId('bookmark-button').querySelector('svg')
    expect(svg?.getAttribute('width')).toBe('14')
  })

  it('uses default size when not specified', () => {
    render(
      <BookmarkButton bookId="genesis" chapter={1} />,
    )

    const svg = screen.getByTestId('bookmark-button').querySelector('svg')
    expect(svg?.getAttribute('width')).toBe('20')
  })
})

describe('BookmarkButton in ChapterReader', () => {
  function renderWithMemoryRouter(initialEntry: string) {
    return render(
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path="/:bookId/:chapter" element={<ChapterReader />} />
          <Route path="*" element={<div>Not found</div>} />
        </Routes>
      </MemoryRouter>,
    )
  }

  it('displays bookmark button in chapter header', async () => {
    renderWithMemoryRouter('/genesis/1')

    await waitFor(() => {
      expect(screen.getByTestId('bookmark-button')).toBeDefined()
    })
  })

  it('clicking header bookmark adds chapter bookmark', async () => {
    const user = userEvent.setup()
    renderWithMemoryRouter('/genesis/1')

    await waitFor(() => {
      expect(screen.getByTestId('bookmark-button')).toBeDefined()
    })

    await user.click(screen.getByTestId('bookmark-button'))

    const bookmarks = useStudyStore.getState().bookmarks
    expect(bookmarks).toHaveLength(1)
    expect(bookmarks[0].bookId).toBe('genesis')
    expect(bookmarks[0].chapter).toBe(1)
  })

  it('chapter bookmark button shows active when bookmarked', async () => {
    useStudyStore.getState().addBookmark({
      bookId: 'genesis',
      chapter: 1,
      verse: null,
      label: '',
    })

    renderWithMemoryRouter('/genesis/1')

    await waitFor(() => {
      const button = screen.getByTestId('bookmark-button')
      expect(button.classList.contains('active')).toBe(true)
    })
  })
})

describe('BookmarksPanel', () => {
  it('shows empty state when there are no bookmarks', () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<BookmarksPanel />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByTestId('bookmarks-panel-empty')).toBeDefined()
    expect(screen.getByText('Nenhum marcador ainda.')).toBeDefined()
  })

  it('lists all bookmarks with book/chapter/verse references', () => {
    useStudyStore.getState().addBookmark({
      bookId: 'genesis',
      chapter: 1,
      verse: null,
      label: 'Chapter 1',
    })
    useStudyStore.getState().addBookmark({
      bookId: 'john',
      chapter: 3,
      verse: 16,
      label: 'John 3:16',
    })

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<BookmarksPanel />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByTestId('bookmarks-panel')).toBeDefined()
    expect(screen.getByTestId('bookmarks-panel-count')).toHaveTextContent('2 marcadores')
    const cards = screen.getAllByTestId('bookmark-card')
    expect(cards).toHaveLength(2)
  })

  it('displays formatted reference correctly', () => {
    useStudyStore.getState().addBookmark({
      bookId: 'genesis',
      chapter: 1,
      verse: 5,
      label: 'Test',
    })

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<BookmarksPanel />} />
        </Routes>
      </MemoryRouter>,
    )

    const reference = screen.getByTestId('bookmark-card-reference')
    expect(reference).toHaveTextContent(/1:5/)
  })

  it('displays chapter-only reference when verse is null', () => {
    useStudyStore.getState().addBookmark({
      bookId: 'genesis',
      chapter: 1,
      verse: null,
      label: '',
    })

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<BookmarksPanel />} />
        </Routes>
      </MemoryRouter>,
    )

    const reference = screen.getByTestId('bookmark-card-reference')
    expect(reference).toHaveTextContent(/^Gênesis 1$/)
  })

  it('displays label when provided', () => {
    useStudyStore.getState().addBookmark({
      bookId: 'genesis',
      chapter: 1,
      verse: 1,
      label: 'Beginning',
    })

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<BookmarksPanel />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Beginning')).toBeDefined()
  })

  it('displays formatted date', () => {
    useStudyStore.getState().addBookmark({
      bookId: 'genesis',
      chapter: 1,
      verse: null,
      label: '',
    })

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<BookmarksPanel />} />
        </Routes>
      </MemoryRouter>,
    )

    const dateSpan = screen.getByText(/\d{2}\/\d{2}\/\d{4}/)
    expect(dateSpan).toBeDefined()
  })

  it('remove button calls removeBookmark', () => {
    useStudyStore.getState().addBookmark({
      bookId: 'genesis',
      chapter: 1,
      verse: null,
      label: '',
    })

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<BookmarksPanel />} />
        </Routes>
      </MemoryRouter>,
    )

    const removeBtn = screen.getByTestId('bookmark-card-remove')
    fireEvent.click(removeBtn)

    const bookmarks = useStudyStore.getState().bookmarks
    expect(bookmarks).toHaveLength(0)
    expect(screen.getByTestId('bookmarks-panel-empty')).toBeDefined()
  })

  it('bookmarks are sorted by createdAt descending (newest first)', () => {
    const now = Date.now()
    const bookmarks = [
      {
        id: 'bookmark-newer',
        bookId: 'genesis',
        chapter: 1,
        verse: null,
        label: 'Newer',
        createdAt: now,
      },
      {
        id: 'bookmark-older',
        bookId: 'genesis',
        chapter: 2,
        verse: null,
        label: 'Older',
        createdAt: now - 86400000,
      },
    ]
    useStudyStore.setState({ bookmarks })

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<BookmarksPanel />} />
        </Routes>
      </MemoryRouter>,
    )

    const cards = screen.getAllByTestId('bookmark-card')
    expect(cards).toHaveLength(2)
    expect(cards[0].getAttribute('data-bookmark-id')).toBe('bookmark-newer')
    expect(cards[1].getAttribute('data-bookmark-id')).toBe('bookmark-older')
  })

  it('shows correct count for singular/plural', () => {
    useStudyStore.getState().addBookmark({
      bookId: 'genesis',
      chapter: 1,
      verse: null,
      label: '',
    })

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<BookmarksPanel />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByTestId('bookmarks-panel-count')).toHaveTextContent('1 marcador')
  })

  it('has decorative triangle for bookmarked cards', () => {
    useStudyStore.getState().addBookmark({
      bookId: 'genesis',
      chapter: 1,
      verse: null,
      label: '',
    })

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<BookmarksPanel />} />
        </Routes>
      </MemoryRouter>,
    )

    const card = screen.getByTestId('bookmark-card')
    const svg = card.querySelector('svg')
    expect(svg).toBeDefined()
    expect(svg?.getAttribute('fill')).toBe('var(--color-bookmark)')
  })
})

describe('BookmarksPanel navigation', () => {
  it('clicking a bookmark navigates to the passage', async () => {
    useStudyStore.getState().addBookmark({
      bookId: 'genesis',
      chapter: 1,
      verse: null,
      label: '',
    })

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<BookmarksPanel />} />
          <Route path="/:bookId/:chapter" element={<div data-testid="reader">Reader</div>} />
        </Routes>
      </MemoryRouter>,
    )

    await userEvent.setup().click(screen.getByTestId('bookmark-card-reference'))

    await waitFor(() => {
      expect(screen.getByTestId('reader')).toBeDefined()
    })
  })
})

describe('Bookmarks - persistence', () => {
  it('adding a bookmark persists to localStorage via studyStore', () => {
    useStudyStore.getState().addBookmark({
      bookId: 'genesis',
      chapter: 1,
      verse: null,
      label: 'Test',
    })

    const serialized = localStorage.getItem('bible-app-study')
    expect(serialized).toBeDefined()
    const parsed = JSON.parse(serialized!)
    expect(parsed.state.bookmarks).toHaveLength(1)
    expect(parsed.state.bookmarks[0].bookId).toBe('genesis')
    expect(parsed.state.bookmarks[0].chapter).toBe(1)
  })

  it('reloading the page restores bookmarks (manual verification)', () => {
    useStudyStore.getState().addBookmark({
      bookId: 'genesis',
      chapter: 1,
      verse: null,
      label: 'Test',
    })

    const serialized = localStorage.getItem('bible-app-study')
    expect(serialized).toBeDefined()
    const parsed = JSON.parse(serialized!)
    expect(parsed.state.bookmarks[0].bookId).toBe('genesis')
    expect(parsed.state.bookmarks[0].chapter).toBe(1)
  })

  it('removing a bookmark from panel removes it from localStorage', () => {
    useStudyStore.getState().addBookmark({
      bookId: 'genesis',
      chapter: 1,
      verse: null,
      label: '',
    })

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<BookmarksPanel />} />
        </Routes>
      </MemoryRouter>,
    )

    const removeBtn = screen.getByTestId('bookmark-card-remove')
    fireEvent.click(removeBtn)

    const serialized = localStorage.getItem('bible-app-study')
    const parsed = JSON.parse(serialized!)
    expect(parsed.state.bookmarks).toHaveLength(0)
  })

  it('BookmarksPanel updates in real-time when bookmarks change', () => {
    useStudyStore.getState().addBookmark({
      bookId: 'genesis',
      chapter: 1,
      verse: null,
      label: 'First',
    })

    const { rerender } = render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<BookmarksPanel />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByTestId('bookmarks-panel-count')).toHaveTextContent('1 marcador')

    useStudyStore.getState().addBookmark({
      bookId: 'genesis',
      chapter: 2,
      verse: null,
      label: 'Second',
    })

    rerender(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<BookmarksPanel />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByTestId('bookmarks-panel-count')).toHaveTextContent('2 marcadores')
  })
})