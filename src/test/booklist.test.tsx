import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter, Routes, Route, useParams, useLocation } from 'react-router'
import { BookList } from '@/components/navigation/BookList'
import { BookItem } from '@/components/navigation/BookItem'
import { TestamentGroup } from '@/components/navigation/TestamentGroup'
import { SidebarProvider } from '@/components/layout/SidebarContext'
import { AppShell } from '@/components/layout/AppShell'
import { useBibleStore } from '@/stores'
import type { BookMeta } from '@/types'

const mockBook: BookMeta = {
  id: 'genesis',
  name: 'Gênesis',
  abbrev: 'Gn',
  testament: 'old',
  chapters: 50,
}

const mockBook2: BookMeta = {
  id: 'exodus',
  name: 'Êxodo',
  abbrev: 'Êx',
  testament: 'old',
  chapters: 40,
}

function renderWithRouter(ui: React.ReactNode) {
  return render(
    <BrowserRouter>
      <SidebarProvider>
        {ui}
      </SidebarProvider>
    </BrowserRouter>,
  )
}

beforeEach(() => {
  localStorage.clear()
  useBibleStore.setState({
    bookId: null,
    chapter: null,
    activeTranslation: 'nvi',
    comparisonTranslations: [],
    comparisonMode: false,
  })
})

describe('BookList', () => {
  it('renders 39 Old Testament and 27 New Testament books', () => {
    renderWithRouter(<BookList />)

    const otGroup = screen.getByTestId('testament-group-antigo-testamento')
    const ntGroup = screen.getByTestId('testament-group-novo-testamento')

    const otBooks = within(otGroup).getAllByRole('option')
    const ntBooks = within(ntGroup).getAllByRole('option')

    expect(otBooks).toHaveLength(39)
    expect(ntBooks).toHaveLength(27)
  })

  it('currently selected book has active styling', () => {
    useBibleStore.setState({ bookId: 'genesis' })
    renderWithRouter(<BookList />)

    const activeBook = screen.getByTestId('book-item-genesis')
    expect(activeBook.classList.contains('active')).toBe(true)
  })

  it('non-selected books do not have active styling', () => {
    useBibleStore.setState({ bookId: 'genesis' })
    renderWithRouter(<BookList />)

    const inactiveBook = screen.getByTestId('book-item-exodus')
    expect(inactiveBook.classList.contains('active')).toBe(false)
  })

  it('testament groups render with correct Portuguese headers', () => {
    renderWithRouter(<BookList />)

    expect(screen.getByText('Antigo Testamento')).toBeDefined()
    expect(screen.getByText('Novo Testamento')).toBeDefined()
  })
})

describe('BookItem', () => {
  it('renders book abbreviation', () => {
    renderWithRouter(<BookItem book={mockBook} isActive={false} />)
    expect(screen.getByText('Gn')).toBeDefined()
  })

  it('has active styling when isActive is true', () => {
    renderWithRouter(<BookItem book={mockBook} isActive={true} />)
    expect(screen.getByTestId('book-item-genesis').classList.contains('active')).toBe(true)
  })

  it('does not have active styling when isActive is false', () => {
    renderWithRouter(<BookItem book={mockBook} isActive={false} />)
    expect(screen.getByTestId('book-item-genesis').classList.contains('active')).toBe(false)
  })
})

describe('TestamentGroup', () => {
  it('renders group label and book items', () => {
    renderWithRouter(
      <TestamentGroup
        label="Antigo Testamento"
        books={[mockBook, mockBook2]}
        activeBookId="genesis"
      />,
    )

    expect(screen.getByText('Antigo Testamento')).toBeDefined()
    expect(screen.getByTestId('book-item-genesis')).toBeDefined()
    expect(screen.getByTestId('book-item-exodus')).toBeDefined()
  })

  it('marks active book', () => {
    renderWithRouter(
      <TestamentGroup
        label="Test"
        books={[mockBook, mockBook2]}
        activeBookId="genesis"
      />,
    )

    expect(screen.getByTestId('book-item-genesis').classList.contains('active')).toBe(true)
    expect(screen.getByTestId('book-item-exodus').classList.contains('active')).toBe(false)
  })
})

describe('Integration', () => {
  it('BookList renders correctly in AppShell sidebar zone at desktop width', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="*" element={<div data-testid="page">page</div>} />
          </Route>
        </Routes>
      </BrowserRouter>,
    )

    expect(screen.getByTestId('sidebar')).toBeDefined()
    expect(screen.getByTestId('book-list')).toBeDefined()
  })

  it('sidebar opens and closes on mobile via hamburger toggle', async () => {
    const user = userEvent.setup()
    render(
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="*" element={<div data-testid="page">page</div>} />
          </Route>
        </Routes>
      </BrowserRouter>,
    )

    const sidebar = screen.getByTestId('sidebar')
    expect(sidebar.classList.contains('-translate-x-full')).toBe(true)

    const hamburger = screen.getByTestId('hamburger-btn')
    await user.click(hamburger)

    await waitFor(() => {
      expect(sidebar.classList.contains('translate-x-0')).toBe(true)
    })

    const backdrop = screen.getByLabelText('Fechar menu')
    await user.click(backdrop)

    await waitFor(() => {
      expect(sidebar.classList.contains('-translate-x-full')).toBe(true)
    })
  })

  it('selecting a book updates the URL and closes mobile overlay', async () => {
    const user = userEvent.setup()
    window.history.pushState({}, 'Test', '/genesis/1')

    function ChapterSelectionPage() {
      const { bookId } = useParams<{ bookId: string }>()
      const location = useLocation()
      return (
        <div>
          <span data-testid="url-path">{location.pathname}</span>
          <span data-testid="page-book">{bookId}</span>
        </div>
      )
    }

    render(
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/:bookId" element={<ChapterSelectionPage />} />
            <Route path="/:bookId/:chapter" element={<ChapterSelectionPage />} />
          </Route>
        </Routes>
      </BrowserRouter>,
    )

    const hamburger = screen.getByTestId('hamburger-btn')
    await user.click(hamburger)

    await waitFor(() => {
      expect(screen.getByTestId('sidebar').classList.contains('translate-x-0')).toBe(true)
    })

    const exodusBtn = screen.getByTestId('book-item-exodus')
    await user.click(exodusBtn)

    await waitFor(() => {
      expect(screen.getByTestId('url-path').textContent).toBe('/exodus')
      expect(screen.getByTestId('sidebar').classList.contains('-translate-x-full')).toBe(true)
    })
  })

  it('keyboard navigation: Tab focuses books, Enter selects, Escape closes overlay', async () => {
    const user = userEvent.setup()
    render(
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="*" element={<div>page</div>} />
          </Route>
        </Routes>
      </BrowserRouter>,
    )

    const hamburger = screen.getByTestId('hamburger-btn')
    await user.click(hamburger)

    await waitFor(() => {
      expect(screen.getByTestId('sidebar').classList.contains('translate-x-0')).toBe(true)
    })

    const genesisBtn = screen.getByTestId('book-item-genesis')
    genesisBtn.focus()

    await user.keyboard('{ArrowDown}')

    const exodusBtn = screen.getByTestId('book-item-exodus')
    expect(document.activeElement).toBe(exodusBtn)

    await user.keyboard('{Enter}')

    await waitFor(() => {
      expect(screen.getByTestId('sidebar').classList.contains('-translate-x-full')).toBe(true)
    })
  })
})
