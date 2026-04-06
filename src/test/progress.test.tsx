import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router'
import { useProgressStore } from '@/stores'
import { ProgressIndicator, getReadStatus } from '@/components/progress'
import { OverallProgress } from '@/components/progress/OverallProgress'
import { ProgressPanel } from '@/components/progress/ProgressPanel'

beforeEach(() => {
  localStorage.clear()
  useProgressStore.setState({ readChapters: new Set() })
})

describe('ProgressIndicator', () => {
  it('displays correct fraction for a book (e.g., 5/50)', () => {
    const store = useProgressStore.getState()
    store.markChapterAsRead('genesis', 1)
    store.markChapterAsRead('genesis', 2)
    store.markChapterAsRead('genesis', 3)
    store.markChapterAsRead('genesis', 4)
    store.markChapterAsRead('genesis', 5)

    render(<ProgressIndicator bookId="genesis" />)

    const fraction = screen.getByTestId('progress-fraction')
    expect(fraction.textContent).toBe('5/50')
  })

  it('displays 0/50 for books with no chapters read', () => {
    render(<ProgressIndicator bookId="genesis" />)

    const fraction = screen.getByTestId('progress-fraction')
    expect(fraction.textContent).toBe('0/50')
  })

  it('displays full completion for fully read books', () => {
    const store = useProgressStore.getState()
    for (let i = 1; i <= 50; i++) {
      store.markChapterAsRead('genesis', i)
    }

    render(<ProgressIndicator bookId="genesis" />)

    const fraction = screen.getByTestId('progress-fraction')
    expect(fraction.textContent).toBe('50/50')
  })
})

describe('getReadStatus', () => {
  it('returns "none" when no chapters read', () => {
    expect(getReadStatus(0, 50)).toBe('none')
  })

  it('returns "partial" when some chapters read', () => {
    expect(getReadStatus(5, 50)).toBe('partial')
  })

  it('returns "full" when all chapters read', () => {
    expect(getReadStatus(50, 50)).toBe('full')
  })
})

describe('OverallProgress', () => {
  it('displays correct percentage (e.g., "3.8%" for 45/1189)', () => {
    const store = useProgressStore.getState()
    for (let i = 1; i <= 45; i++) {
      if (i <= 50) {
        store.markChapterAsRead('genesis', i)
      } else if (i <= 90) {
        store.markChapterAsRead('exodus', i - 50)
      }
    }

    render(<OverallProgress />)

    const percentage = screen.getByTestId('overall-progress-percentage')
    const expected = ((45 / 1189) * 100).toFixed(1)
    expect(percentage.textContent).toBe(`${expected}%`)
  })

  it('displays 0% when no chapters read', () => {
    render(<OverallProgress />)

    const percentage = screen.getByTestId('overall-progress-percentage')
    expect(percentage.textContent).toBe('0.0%')
  })
})

describe('ProgressPanel', () => {
  it('lists all 66 books with their progress', () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="*" element={<ProgressPanel />} />
        </Routes>
      </MemoryRouter>,
    )

    const bookItems = screen.getAllByTestId('book-progress-item')
    expect(bookItems).toHaveLength(66)
  })

  it('books are visually distinguished by read status', () => {
    useProgressStore.getState().markChapterAsRead('genesis', 1)

    render(
      <MemoryRouter>
        <Routes>
          <Route path="*" element={<ProgressPanel />} />
        </Routes>
      </MemoryRouter>,
    )

    const items = screen.getAllByTestId('book-progress-item')
    const genesisItem = items.find(el => el.getAttribute('data-book-id') === 'genesis')
    expect(genesisItem).toHaveAttribute('data-status', 'partial')

    const revelationItem = items.find(el => el.getAttribute('data-book-id') === 'revelation')
    expect(revelationItem).toHaveAttribute('data-status', 'none')
  })

  it('shows correct progress for fully read books', () => {
    const store = useProgressStore.getState()
    for (let i = 1; i <= 4; i++) {
      store.markChapterAsRead('ruth', i)
    }

    render(
      <MemoryRouter>
        <Routes>
          <Route path="*" element={<ProgressPanel />} />
        </Routes>
      </MemoryRouter>,
    )

    const items = screen.getAllByTestId('book-progress-item')
    const ruthItem = items.find(el => el.getAttribute('data-book-id') === 'ruth')
    expect(ruthItem).toHaveAttribute('data-status', 'full')
  })
})

describe('Reading a chapter updates progress in real-time', () => {
  it('updates progress when a chapter is marked as read', () => {
    useProgressStore.getState().markChapterAsRead('genesis', 1)

    render(<OverallProgress />)

    const percentage = screen.getByTestId('overall-progress-percentage')
    const expected = ((1 / 1189) * 100).toFixed(1)
    expect(percentage.textContent).toBe(`${expected}%`)
  })
})

describe('Progress persists across page reload', () => {
  it('persists progress to localStorage', () => {
    useProgressStore.getState().markChapterAsRead('genesis', 1)
    useProgressStore.getState().markChapterAsRead('genesis', 2)

    const stored = localStorage.getItem('bible-app-progress')
    expect(stored).toBeTruthy()

    const parsed = JSON.parse(stored!)
    expect(parsed.state.readChapters).toContain('genesis:1')
    expect(parsed.state.readChapters).toContain('genesis:2')
  })
})

describe('Overall progress updates when any book progress changes', () => {
  it('overall progress reflects genesis progress', () => {
    render(<OverallProgress />)

    useProgressStore.getState().markChapterAsRead('genesis', 1)

    const progress = useProgressStore.getState().getOverallProgress()
    expect(progress.read).toBe(1)
  })

  it('overall progress reflects multiple books progress', () => {
    const store = useProgressStore.getState()
    store.markChapterAsRead('genesis', 1)
    store.markChapterAsRead('genesis', 2)
    store.markChapterAsRead('exodus', 1)
    store.markChapterAsRead('exodus', 2)

    const progress = store.getOverallProgress()
    expect(progress.read).toBe(4)
  })
})
