import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter, Routes, Route, useNavigate, useParams, useLocation } from 'react-router'
import { useEffect } from 'react'
import { useBibleStore, useThemeStore } from '@/stores'

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
  useThemeStore.setState({ preference: 'system' })
})

function RootRedirect() {
  const navigate = useNavigate()
  const bookId = useBibleStore((s) => s.bookId)
  const chapter = useBibleStore((s) => s.chapter)

  useEffect(() => {
    if (bookId && chapter) {
      navigate(`/${bookId}/${chapter}`, { replace: true })
    } else if (bookId) {
      navigate(`/${bookId}`, { replace: true })
    } else {
      navigate('/genesis', { replace: true })
    }
  }, [navigate, bookId, chapter])

  return null
}

function ChapterSelectionPage() {
  const { bookId } = useParams<{ bookId: string }>()
  return (
    <div data-testid="chapter-selection-page">
      <span data-testid="route-book">{bookId}</span>
    </div>
  )
}

function ChapterPage() {
  const { bookId, chapter } = useParams<{ bookId: string; chapter: string }>()
  return (
    <div data-testid="chapter-page">
      <span data-testid="route-book">{bookId}</span>
      <span data-testid="route-chapter">{chapter}</span>
    </div>
  )
}

function SearchPage() {
  return <div data-testid="search-page">Search</div>
}

function LocationDisplay() {
  const location = useLocation()
  return <div data-testid="current-path">{location.pathname}</div>
}

function TestApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<RootRedirect />} />
        <Route path="/:bookId" element={<ChapterSelectionPage />} />
        <Route path="/:bookId/:chapter" element={<ChapterPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
      <LocationDisplay />
    </BrowserRouter>
  )
}

describe('Routing', () => {
  it('navigating to / redirects to /genesis (chapter selection)', async () => {
    render(<TestApp />)

    await waitFor(() => {
      expect(screen.getByTestId('current-path').textContent).toBe('/genesis')
    })
  })

  it('navigating to /genesis/3 renders chapter 3 route', async () => {
    window.history.pushState({}, 'Test', '/genesis/3')
    render(<TestApp />)

    await waitFor(() => {
      expect(screen.getByTestId('route-book').textContent).toBe('genesis')
      expect(screen.getByTestId('route-chapter').textContent).toBe('3')
    })
  })

  it('navigating to /search renders search route', async () => {
    window.history.pushState({}, 'Test', '/search')
    render(<TestApp />)

    await waitFor(() => {
      expect(screen.getByTestId('search-page')).toBeDefined()
    })
  })

  it('navigating to /:bookId shows chapter selection page', async () => {
    window.history.pushState({}, 'Test', '/psalms')
    render(<TestApp />)

    await waitFor(() => {
      expect(screen.getByTestId('chapter-selection-page')).toBeDefined()
      expect(screen.getByTestId('route-book').textContent).toBe('psalms')
    })
  })

  it('redirects to last read location if stored', async () => {
    useBibleStore.setState({ bookId: 'john', chapter: 3 })
    render(<TestApp />)

    await waitFor(() => {
      expect(screen.getByTestId('current-path').textContent).toBe('/john/3')
    })
  })

  it('redirects to book chapter selection if book stored but no chapter', async () => {
    useBibleStore.setState({ bookId: 'john', chapter: null })
    render(<TestApp />)

    await waitFor(() => {
      expect(screen.getByTestId('current-path').textContent).toBe('/john')
    })
  })

  it('browser back/forward updates the route correctly', async () => {
    window.history.pushState({}, 'Test', '/genesis/1')
    render(<TestApp />)

    await waitFor(() => {
      expect(screen.getByTestId('route-book').textContent).toBe('genesis')
    })

    window.history.pushState({}, 'Test', '/john/3')
    window.dispatchEvent(new PopStateEvent('popstate', { state: {} }))

    await waitFor(() => {
      expect(screen.getByTestId('current-path').textContent).toBe('/john/3')
    })

    window.history.pushState({}, 'Test', '/psalms/23')
    window.dispatchEvent(new PopStateEvent('popstate', { state: {} }))

    await waitFor(() => {
      expect(screen.getByTestId('current-path').textContent).toBe('/psalms/23')
    })

    window.history.back()
    window.dispatchEvent(new PopStateEvent('popstate', { state: {} }))

    await waitFor(() => {
      expect(screen.getByTestId('current-path').textContent).toBe('/john/3')
    })

    window.history.forward()
    window.dispatchEvent(new PopStateEvent('popstate', { state: {} }))

    await waitFor(() => {
      expect(screen.getByTestId('current-path').textContent).toBe('/psalms/23')
    })
  })
})
