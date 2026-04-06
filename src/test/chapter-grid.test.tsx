import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter, useLocation } from 'react-router'
import { ChapterGrid } from '@/components/navigation/ChapterGrid'
import { useProgressStore } from '@/stores'

function LocationDisplay() {
  const location = useLocation()
  return <div data-testid="current-path">{location.pathname}</div>
}

function renderWithRouter(ui: React.ReactNode) {
  return render(
    <BrowserRouter>
      {ui}
      <LocationDisplay />
    </BrowserRouter>,
  )
}

beforeEach(() => {
  localStorage.clear()
  useProgressStore.setState({ readChapters: new Set() })
})

describe('ChapterGrid', () => {
  it('renders the correct number of chapter buttons for Genesis (50)', () => {
    renderWithRouter(<ChapterGrid bookId="genesis" totalChapters={50} />)

    const buttons = screen.getAllByRole('gridcell')
    expect(buttons).toHaveLength(50)
  })

  it('renders the correct number of chapter buttons for Obadiah (1)', () => {
    renderWithRouter(<ChapterGrid bookId="obadiah" totalChapters={1} />)

    const buttons = screen.getAllByRole('gridcell')
    expect(buttons).toHaveLength(1)
    expect(buttons[0].textContent).toBe('1')
  })

  it('renders chapter numbers in ascending order', () => {
    renderWithRouter(<ChapterGrid bookId="genesis" totalChapters={5} />)

    const buttons = screen.getAllByRole('gridcell')
    expect(buttons[0].textContent).toBe('1')
    expect(buttons[1].textContent).toBe('2')
    expect(buttons[2].textContent).toBe('3')
    expect(buttons[3].textContent).toBe('4')
    expect(buttons[4].textContent).toBe('5')
  })

  it('clicking a chapter button navigates to /:bookId/:chapter', async () => {
    const user = userEvent.setup()
    renderWithRouter(<ChapterGrid bookId="psalms" totalChapters={150} />)

    const chapter23 = screen.getByTestId('chapter-btn-23')
    await user.click(chapter23)

    expect(screen.getByTestId('current-path').textContent).toBe('/psalms/23')
  })

  it('shows a visual indicator for chapters marked as read', () => {
    useProgressStore.setState({
      readChapters: new Set(['genesis:1', 'genesis:3', 'genesis:5']),
    })

    renderWithRouter(<ChapterGrid bookId="genesis" totalChapters={5} />)

    const btn1 = screen.getByTestId('chapter-btn-1')
    const btn2 = screen.getByTestId('chapter-btn-2')
    const btn3 = screen.getByTestId('chapter-btn-3')

    expect(btn1.classList.contains('active')).toBe(true)
    expect(btn2.classList.contains('active')).toBe(false)
    expect(btn3.classList.contains('active')).toBe(true)
  })

  it('read chapter button has correct ARIA label', () => {
    useProgressStore.setState({
      readChapters: new Set(['genesis:1']),
    })

    renderWithRouter(<ChapterGrid bookId="genesis" totalChapters={1} />)

    expect(screen.getByTestId('chapter-btn-1').getAttribute('aria-label')).toBe(
      'Capítulo 1, já lido',
    )
  })

  it('unread chapter button has correct ARIA label', () => {
    renderWithRouter(<ChapterGrid bookId="genesis" totalChapters={1} />)

    expect(screen.getByTestId('chapter-btn-1').getAttribute('aria-label')).toBe(
      'Capítulo 1',
    )
  })

  it('keyboard navigation: Tab focuses chapter buttons, Enter navigates', async () => {
    const user = userEvent.setup()
    renderWithRouter(<ChapterGrid bookId="genesis" totalChapters={3} />)

    const btn1 = screen.getByTestId('chapter-btn-1')
    const btn2 = screen.getByTestId('chapter-btn-2')

    btn1.focus()
    expect(document.activeElement).toBe(btn1)

    await user.keyboard('{Tab}')
    expect(document.activeElement).toBe(btn2)

    await user.keyboard('{Enter}')
    expect(screen.getByTestId('current-path').textContent).toBe('/genesis/2')
  })

  it('renders with role="grid" for accessibility', () => {
    renderWithRouter(<ChapterGrid bookId="genesis" totalChapters={3} />)

    expect(screen.getByTestId('chapter-grid').getAttribute('role')).toBe('grid')
  })
})
