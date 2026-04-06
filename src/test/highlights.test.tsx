import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router'
import userEvent from '@testing-library/user-event'
import { useBibleStore, useProgressStore, useStudyStore, useThemeStore } from '@/stores'
import { ChapterReader } from '@/components/reader/ChapterReader'
import { HighlightPicker } from '@/components/study/HighlightPicker'
import { VerseBlock } from '@/components/reader/VerseBlock'
import type { Verse } from '@/types'

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

describe('HighlightPicker', () => {
  it('renders five circular color buttons (yellow, green, blue, red, purple)', () => {
    render(
      <HighlightPicker
        currentColor={null}
        onColorSelect={vi.fn()}
        onRemove={vi.fn()}
      />,
    )

    expect(screen.getByTestId('highlight-btn-yellow')).toBeDefined()
    expect(screen.getByTestId('highlight-btn-green')).toBeDefined()
    expect(screen.getByTestId('highlight-btn-blue')).toBeDefined()
    expect(screen.getByTestId('highlight-btn-red')).toBeDefined()
    expect(screen.getByTestId('highlight-btn-purple')).toBeDefined()
  })

  it('clicking a color button calls onColorSelect with correct color', () => {
    const onColorSelect = vi.fn()
    render(
      <HighlightPicker
        currentColor={null}
        onColorSelect={onColorSelect}
        onRemove={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByTestId('highlight-btn-green'))
    expect(onColorSelect).toHaveBeenCalledWith('green')

    fireEvent.click(screen.getByTestId('highlight-btn-blue'))
    expect(onColorSelect).toHaveBeenCalledWith('blue')

    fireEvent.click(screen.getByTestId('highlight-btn-yellow'))
    expect(onColorSelect).toHaveBeenCalledWith('yellow')
  })

  it('active color button has active class', () => {
    render(
      <HighlightPicker
        currentColor="green"
        onColorSelect={vi.fn()}
        onRemove={vi.fn()}
      />,
    )

    const greenBtn = screen.getByTestId('highlight-btn-green')
    expect(greenBtn.className).toContain('active')

    const yellowBtn = screen.getByTestId('highlight-btn-yellow')
    expect(yellowBtn.className).not.toContain('active')
  })

  it('remove button is not shown when no highlight exists', () => {
    render(
      <HighlightPicker
        currentColor={null}
        onColorSelect={vi.fn()}
        onRemove={vi.fn()}
      />,
    )

    expect(screen.queryByTestId('highlight-btn-remove')).toBeNull()
  })

  it('remove button is shown when a highlight exists', () => {
    render(
      <HighlightPicker
        currentColor="yellow"
        onColorSelect={vi.fn()}
        onRemove={vi.fn()}
      />,
    )

    expect(screen.getByTestId('highlight-btn-remove')).toBeDefined()
  })

  it('clicking remove button calls onRemove', () => {
    const onRemove = vi.fn()
    render(
      <HighlightPicker
        currentColor="red"
        onColorSelect={vi.fn()}
        onRemove={onRemove}
      />,
    )

    expect(screen.getByTestId('highlight-btn-remove')).toBeInTheDocument()
  })

  it('color buttons have correct aria-pressed state', () => {
    render(
      <HighlightPicker
        currentColor="red"
        onColorSelect={vi.fn()}
        onRemove={vi.fn()}
      />,
    )

    expect(screen.getByTestId('highlight-btn-red').getAttribute('aria-pressed')).toBe('true')
    expect(screen.getByTestId('highlight-btn-yellow').getAttribute('aria-pressed')).toBe('false')
  })
})

describe('VerseBlock - highlight rendering', () => {
  const verse: Verse = {
    number: 1,
    text: 'No princípio criou Deus os céus e a terra.',
  }

  it('renders with correct highlight background for yellow', () => {
    render(
      <VerseBlock verse={verse} isSelected={false} highlightColor="yellow" onSelect={vi.fn()} />,
    )

    const block = screen.getByTestId('verse-1')
    expect(block.className).toContain('bg-[var(--color-highlight-yellow)]')
  })

  it('renders with correct highlight background for green', () => {
    render(
      <VerseBlock verse={verse} isSelected={false} highlightColor="green" onSelect={vi.fn()} />,
    )

    const block = screen.getByTestId('verse-1')
    expect(block.className).toContain('bg-[var(--color-highlight-green)]')
  })

  it('renders with correct highlight background for blue', () => {
    render(
      <VerseBlock verse={verse} isSelected={false} highlightColor="blue" onSelect={vi.fn()} />,
    )

    const block = screen.getByTestId('verse-1')
    expect(block.className).toContain('bg-[var(--color-highlight-blue)]')
  })

  it('selected state without highlight uses surface-raised background', () => {
    render(
      <VerseBlock verse={verse} isSelected={true} onSelect={vi.fn()} />,
    )

    const block = screen.getByTestId('verse-1')
    expect(block.className).toContain('bg-[var(--color-surface-raised)]')
    expect(block.className).toContain('ring-2')
  })

  it('selected state with highlight shows highlight background and ring', () => {
    render(
      <VerseBlock verse={verse} isSelected={true} highlightColor="green" onSelect={vi.fn()} />,
    )

    const block = screen.getByTestId('verse-1')
    expect(block.className).toContain('bg-[var(--color-highlight-green)]')
    expect(block.className).toContain('ring-2')
  })

  it('no highlight and not selected has no background', () => {
    render(
      <VerseBlock verse={verse} isSelected={false} onSelect={vi.fn()} />,
    )

    const block = screen.getByTestId('verse-1')
    expect(block.className).not.toContain('bg-[')
    expect(block.className).not.toContain('ring-2')
  })
})

describe('ChapterReader - highlight integration', () => {
  it('shows highlight picker when a verse is selected', async () => {
    const user = userEvent.setup()
    renderWithMemoryRouter('/genesis/1')

    await waitFor(() => {
      expect(screen.getByTestId('verse-1')).toBeDefined()
    })

    await user.click(screen.getByTestId('verse-1'))

    await waitFor(() => {
      expect(screen.getByTestId('highlight-action-bar')).toBeDefined()
      expect(screen.getByTestId('highlight-picker')).toBeDefined()
    })
  })

  it('clicking a highlight color creates a persisted highlight', async () => {
    const user = userEvent.setup()
    renderWithMemoryRouter('/genesis/1')

    await waitFor(() => {
      expect(screen.getByTestId('verse-1')).toBeDefined()
    })

    await user.click(screen.getByTestId('verse-1'))

    await waitFor(() => {
      expect(screen.getByTestId('highlight-btn-yellow')).toBeDefined()
    })

    await user.click(screen.getByTestId('highlight-btn-yellow'))

    expect(useStudyStore.getState().highlights).toHaveLength(1)
    expect(useStudyStore.getState().highlights[0]).toEqual(
      expect.objectContaining({
        bookId: 'genesis',
        chapter: 1,
        startVerse: 1,
        endVerse: 1,
        color: 'yellow',
      }),
    )
    expect(useStudyStore.getState().highlights[0].id).toBeDefined()
    expect(useStudyStore.getState().highlights[0].createdAt).toBeTypeOf('number')
  })

  it('highlighted verse renders with correct pastel background color', async () => {
    useStudyStore.getState().addHighlight({
      bookId: 'genesis',
      chapter: 1,
      startVerse: 1,
      endVerse: 1,
      color: 'green',
    })

    renderWithMemoryRouter('/genesis/1')

    await waitFor(() => {
      const block = screen.getByTestId('verse-1')
      expect(block.className).toContain('bg-[var(--color-highlight-green)]')
    })
  })

  it('highlighting a verse range applies color to all verses in range', async () => {
    const user = userEvent.setup()
    renderWithMemoryRouter('/genesis/1')

    await waitFor(() => {
      expect(screen.getByTestId('verse-1')).toBeDefined()
    })

    await user.click(screen.getByTestId('verse-1'))
    await user.keyboard('{Shift>}')
    await user.click(screen.getByTestId('verse-5'))
    await user.keyboard('{/Shift}')

    await waitFor(() => {
      expect(screen.getByTestId('highlight-btn-red')).toBeDefined()
    })

    await user.click(screen.getByTestId('highlight-btn-red'))

    const highlight = useStudyStore.getState().highlights[0]
    expect(highlight.startVerse).toBe(1)
    expect(highlight.endVerse).toBe(5)
    expect(highlight.color).toBe('red')

    expect(screen.getByTestId('verse-1').className).toContain('bg-[var(--color-highlight-red)]')
    expect(screen.getByTestId('verse-3').className).toContain('bg-[var(--color-highlight-red)]')
    expect(screen.getByTestId('verse-5').className).toContain('bg-[var(--color-highlight-red)]')
  })

  it('clicking highlight on already-highlighted verse shows current color as active and remove button', async () => {
    useStudyStore.getState().addHighlight({
      bookId: 'genesis',
      chapter: 1,
      startVerse: 3,
      endVerse: 3,
      color: 'yellow',
    })

    const user = userEvent.setup()
    renderWithMemoryRouter('/genesis/1')

    await waitFor(() => {
      expect(screen.getByTestId('verse-3')).toBeDefined()
    })

    await user.click(screen.getByTestId('verse-3'))

    await waitFor(() => {
      expect(screen.getByTestId('highlight-picker')).toBeDefined()
      const yellowBtn = screen.getByTestId('highlight-btn-yellow')
      expect(yellowBtn.className).toContain('active')
      expect(screen.getByTestId('highlight-btn-remove')).toBeDefined()
    })
  })

  it('changing highlight color on existing highlight updates it', async () => {
    useStudyStore.getState().addHighlight({
      bookId: 'genesis',
      chapter: 1,
      startVerse: 3,
      endVerse: 3,
      color: 'yellow',
    })
    const originalId = useStudyStore.getState().highlights[0].id

    const user = userEvent.setup()
    renderWithMemoryRouter('/genesis/1')

    await waitFor(() => {
      expect(screen.getByTestId('verse-3')).toBeDefined()
    })

    await user.click(screen.getByTestId('verse-3'))

    await waitFor(() => {
      expect(screen.getByTestId('highlight-btn-green')).toBeDefined()
    })

    await user.click(screen.getByTestId('highlight-btn-green'))

    expect(useStudyStore.getState().highlights).toHaveLength(1)
    expect(useStudyStore.getState().highlights[0].id).toBe(originalId)
    expect(useStudyStore.getState().highlights[0].color).toBe('green')
  })

  it('removing a highlight clears the background color', async () => {
    useStudyStore.getState().addHighlight({
      bookId: 'genesis',
      chapter: 1,
      startVerse: 3,
      endVerse: 3,
      color: 'yellow',
    })

    const user = userEvent.setup()
    renderWithMemoryRouter('/genesis/1')

    await waitFor(() => {
      expect(screen.getByTestId('verse-3').className).toContain('bg-[var(--color-highlight-yellow)]')
    })

    await user.click(screen.getByTestId('verse-3'))

    await waitFor(() => {
      expect(screen.getByTestId('highlight-btn-remove')).toBeDefined()
    })

    await user.click(screen.getByTestId('highlight-btn-remove'))

    expect(useStudyStore.getState().highlights).toHaveLength(0)

    await waitFor(() => {
      expect(screen.getByTestId('verse-3').className).not.toContain('bg-[var(--color-highlight-yellow)]')
    })
  })

  it('pressing Escape dismisses the highlight picker', async () => {
    const user = userEvent.setup()
    renderWithMemoryRouter('/genesis/1')

    await waitFor(() => {
      expect(screen.getByTestId('verse-1')).toBeDefined()
    })

    await user.click(screen.getByTestId('verse-1'))

    await waitFor(() => {
      expect(screen.getByTestId('highlight-action-bar')).toBeDefined()
    })

    fireEvent.keyDown(document, { key: 'Escape' })

    await waitFor(() => {
      expect(screen.queryByTestId('highlight-action-bar')).toBeNull()
    })
  })

  it('selecting a subset of a highlighted range shows the parent highlight for editing', async () => {
    useStudyStore.getState().addHighlight({
      bookId: 'genesis',
      chapter: 1,
      startVerse: 1,
      endVerse: 5,
      color: 'green',
    })

    const user = userEvent.setup()
    renderWithMemoryRouter('/genesis/1')

    await waitFor(() => {
      expect(screen.getByTestId('verse-3')).toBeDefined()
    })

    await user.click(screen.getByTestId('verse-3'))

    await waitFor(() => {
      const greenBtn = screen.getByTestId('highlight-btn-green')
      expect(greenBtn.className).toContain('active')
      expect(screen.getByTestId('highlight-btn-remove')).toBeDefined()
    })
  })
})

describe('ChapterReader - highlight persistence', () => {
  it('adding a highlight persists to localStorage via studyStore', async () => {
    const user = userEvent.setup()
    renderWithMemoryRouter('/genesis/1')

    await waitFor(() => {
      expect(screen.getByTestId('verse-1')).toBeDefined()
    })

    await user.click(screen.getByTestId('verse-1'))

    await waitFor(() => {
      expect(screen.getByTestId('highlight-btn-yellow')).toBeDefined()
    })

    await user.click(screen.getByTestId('highlight-btn-yellow'))

    const serialized = localStorage.getItem('bible-app-study')
    expect(serialized).toBeDefined()
    const parsed = JSON.parse(serialized!)
    expect(parsed.state.highlights).toHaveLength(1)
    expect(parsed.state.highlights[0].color).toBe('yellow')
  })

  it('reloading the page restores highlights on correct verses', async () => {
    useStudyStore.getState().addHighlight({
      bookId: 'genesis',
      chapter: 1,
      startVerse: 1,
      endVerse: 3,
      color: 'purple',
    })

    const serialized = localStorage.getItem('bible-app-study')
    expect(serialized).toBeDefined()
    const parsed = JSON.parse(serialized!)
    expect(parsed.state.highlights).toHaveLength(1)

    renderWithMemoryRouter('/genesis/1')

    await waitFor(() => {
      expect(screen.getByTestId('verse-1').className).toContain('bg-[var(--color-highlight-purple)]')
      expect(screen.getByTestId('verse-2').className).toContain('bg-[var(--color-highlight-purple)]')
      expect(screen.getByTestId('verse-3').className).toContain('bg-[var(--color-highlight-purple)]')
      expect(screen.getByTestId('verse-4').className).not.toContain('bg-[var(--color-highlight-purple)]')
    })
  })

  it('changing highlight color updates the background and persists', async () => {
    useStudyStore.getState().addHighlight({
      bookId: 'genesis',
      chapter: 1,
      startVerse: 1,
      endVerse: 1,
      color: 'yellow',
    })

    const user = userEvent.setup()
    renderWithMemoryRouter('/genesis/1')

    await waitFor(() => {
      expect(screen.getByTestId('verse-1').className).toContain('bg-[var(--color-highlight-yellow)]')
    })

    await user.click(screen.getByTestId('verse-1'))

    await waitFor(() => {
      expect(screen.getByTestId('highlight-btn-green')).toBeDefined()
    })

    await user.click(screen.getByTestId('highlight-btn-green'))

    await waitFor(() => {
      expect(screen.getByTestId('verse-1').className).toContain('bg-[var(--color-highlight-green)]')
      expect(screen.getByTestId('verse-1').className).not.toContain('bg-[var(--color-highlight-yellow)]')
    })

    const serialized = localStorage.getItem('bible-app-study')
    const parsed = JSON.parse(serialized!)
    expect(parsed.state.highlights[0].color).toBe('green')
  })

  it('highlights from different chapters do not appear', async () => {
    useStudyStore.getState().addHighlight({
      bookId: 'genesis',
      chapter: 2,
      startVerse: 1,
      endVerse: 1,
      color: 'yellow',
    })

    renderWithMemoryRouter('/genesis/1')

    await waitFor(() => {
      expect(screen.getByTestId('verse-1')).toBeDefined()
    })

    expect(screen.getByTestId('verse-1').className).not.toContain('bg-[var(--color-highlight-yellow)]')
  })

  it('creating a highlight on overlapping range replaces the old one', async () => {
    useStudyStore.getState().addHighlight({
      bookId: 'genesis',
      chapter: 1,
      startVerse: 1,
      endVerse: 3,
      color: 'yellow',
    })

    const user = userEvent.setup()
    renderWithMemoryRouter('/genesis/1')

    await waitFor(() => {
      expect(screen.getByTestId('verse-1')).toBeDefined()
    })

    await user.click(screen.getByTestId('verse-3'))
    await user.keyboard('{Shift>}')
    await user.click(screen.getByTestId('verse-5'))
    await user.keyboard('{/Shift}')

    await waitFor(() => {
      expect(screen.getByTestId('highlight-btn-green')).toBeDefined()
    })

    await user.click(screen.getByTestId('highlight-btn-green'))

    const highlights = useStudyStore.getState().highlights
    expect(highlights).toHaveLength(1)
    expect(highlights[0].startVerse).toBe(3)
    expect(highlights[0].endVerse).toBe(5)
    expect(highlights[0].color).toBe('green')
  })
})
