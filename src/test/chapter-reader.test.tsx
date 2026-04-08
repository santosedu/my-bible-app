import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import { BrowserRouter, MemoryRouter, Routes, Route, useSearchParams } from 'react-router'
import userEvent from '@testing-library/user-event'
import { useBibleStore, useProgressStore, useThemeStore } from '@/stores'
import { ChapterReader } from '@/components/reader/ChapterReader'
import { VerseBlock } from '@/components/reader/VerseBlock'
import type { Verse } from '@/types'

let observerCallback: ((entries: Array<{ isIntersecting: boolean }>) => void) | null = null

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
  useProgressStore.setState({ readChapters: new Set() })
  useThemeStore.setState({ preference: 'system' })

  observerCallback = null
  vi.stubGlobal(
    'IntersectionObserver',
    class MockIntersectionObserver {
      constructor(cb: (entries: Array<{ isIntersecting: boolean }>) => void) {
        observerCallback = cb
      }
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

function renderWithBrowserRouter(initialPath: string) {
  window.history.pushState({}, 'Test', initialPath)
  return render(
    <BrowserRouter>
      <Routes>
        <Route path="/:bookId/:chapter" element={<ChapterReader />} />
        <Route path="*" element={<div>Not found</div>} />
      </Routes>
    </BrowserRouter>,
  )
}

describe('VerseBlock', () => {
  const verse: Verse = {
    number: 1,
    text: 'No princípio criou Deus os céus e a terra.',
  }

  it('renders verse number and text', () => {
    const onSelect = vi.fn()
    render(<VerseBlock verse={verse} isSelected={false} onSelect={onSelect} />)

    expect(screen.getByText('1')).toBeDefined()
    expect(screen.getByText(verse.text)).toBeDefined()
  })

  it('displays verse number as superscript with DM Sans styling', () => {
    const onSelect = vi.fn()
    render(<VerseBlock verse={verse} isSelected={false} onSelect={onSelect} />)

    const sup = screen.getByText('1').closest('sup')
    expect(sup).toBeDefined()
    expect(sup!.className).toContain('font-verse-number')
  })

  it('has correct ARIA attributes', () => {
    const onSelect = vi.fn()
    render(<VerseBlock verse={verse} isSelected={false} onSelect={onSelect} />)

    const block = screen.getByTestId('verse-1')
    expect(block.getAttribute('role')).toBe('button')
    expect(block.getAttribute('aria-label')).toBe('Versículo 1')
    expect(block.getAttribute('aria-selected')).toBe('false')
  })

  it('calls onSelect when clicked', () => {
    const onSelect = vi.fn()
    render(<VerseBlock verse={verse} isSelected={false} onSelect={onSelect} />)

    fireEvent.click(screen.getByTestId('verse-1'))
    expect(onSelect).toHaveBeenCalledWith(1, false)
  })

  it('calls onSelect with shiftKey when shift+clicked', () => {
    const onSelect = vi.fn()
    render(<VerseBlock verse={verse} isSelected={false} onSelect={onSelect} />)

    fireEvent.click(screen.getByTestId('verse-1'), { shiftKey: true })
    expect(onSelect).toHaveBeenCalledWith(1, true)
  })

  it('applies selected state with surface-raised background and ring', () => {
    const onSelect = vi.fn()
    render(<VerseBlock verse={verse} isSelected={true} onSelect={onSelect} />)

    const block = screen.getByTestId('verse-1')
    expect(block.className).toContain('bg-[var(--color-surface-raised)]')
    expect(block.className).toContain('ring-2')
    expect(block.getAttribute('aria-selected')).toBe('true')
  })

  it('supports keyboard activation with Enter', () => {
    const onSelect = vi.fn()
    render(<VerseBlock verse={verse} isSelected={false} onSelect={onSelect} />)

    fireEvent.keyDown(screen.getByTestId('verse-1'), { key: 'Enter' })
    expect(onSelect).toHaveBeenCalledWith(1, false)
  })

  it('supports keyboard activation with Space', () => {
    const onSelect = vi.fn()
    render(<VerseBlock verse={verse} isSelected={false} onSelect={onSelect} />)

    fireEvent.keyDown(screen.getByTestId('verse-1'), { key: ' ' })
    expect(onSelect).toHaveBeenCalledWith(1, false)
  })
})

describe('ChapterReader', () => {
  it('renders all 31 verses for genesis chapter 1', async () => {
    renderWithMemoryRouter('/genesis/1')

    await waitFor(() => {
      expect(screen.getByTestId('chapter-reader')).toBeDefined()
    })

    const container = screen.getByTestId('verses-container')
    const verseElements = within(container).getAllByTestId(/^verse-\d+$/)
    expect(verseElements.length).toBe(31)
  })

  it('displays book name and chapter number in heading', async () => {
    renderWithMemoryRouter('/genesis/1')

    await waitFor(() => {
      expect(screen.getByTestId('chapter-heading').textContent).toBe(
        'Gênesis 1',
      )
    })
  })

  it('displays correct heading for a New Testament book', async () => {
    renderWithMemoryRouter('/john/3')

    await waitFor(() => {
      expect(screen.getByTestId('chapter-heading').textContent).toBe('João 3')
    })
  })

  it('renders empty state for invalid chapter', async () => {
    renderWithMemoryRouter('/genesis/999')

    await waitFor(() => {
      expect(screen.getByTestId('chapter-reader-empty')).toBeDefined()
      expect(screen.getByText('Capítulo não encontrado.')).toBeDefined()
    })
  })

  it('renders empty state for invalid book', async () => {
    renderWithMemoryRouter('/nonexistent-book/1')

    await waitFor(() => {
      expect(screen.getByTestId('chapter-reader-empty')).toBeDefined()
    })
  })

  it('renders invalid state for non-numeric chapter parameter', async () => {
    renderWithMemoryRouter('/genesis/abc')

    await waitFor(() => {
      expect(screen.getByTestId('chapter-reader-empty')).toBeDefined()
      expect(screen.getByText('Capítulo inválido.')).toBeDefined()
    })
  })

  it('clicking a verse selects it', async () => {
    const user = userEvent.setup()
    renderWithMemoryRouter('/genesis/1')

    await waitFor(() => {
      expect(screen.getByTestId('verse-1')).toBeDefined()
    })

    await user.click(screen.getByTestId('verse-1'))
    expect(screen.getByTestId('verse-1').getAttribute('aria-selected')).toBe(
      'true',
    )
    expect(
      screen.getByTestId('verse-2').getAttribute('aria-selected'),
    ).toBe('false')
  })

  it('shift+clicking selects a verse range', async () => {
    const user = userEvent.setup()
    renderWithMemoryRouter('/genesis/1')

    await waitFor(() => {
      expect(screen.getByTestId('verse-1')).toBeDefined()
    })

    await user.click(screen.getByTestId('verse-1'))
    await user.keyboard('{Shift>}')
    await user.click(screen.getByTestId('verse-5'))
    await user.keyboard('{/Shift}')

    expect(screen.getByTestId('verse-1').getAttribute('aria-selected')).toBe(
      'true',
    )
    expect(screen.getByTestId('verse-3').getAttribute('aria-selected')).toBe(
      'true',
    )
    expect(screen.getByTestId('verse-5').getAttribute('aria-selected')).toBe(
      'true',
    )
    expect(
      screen.getByTestId('verse-6').getAttribute('aria-selected'),
    ).toBe('false')
  })

  it('shift+clicking in reverse order selects correct range', async () => {
    const user = userEvent.setup()
    renderWithMemoryRouter('/genesis/1')

    await waitFor(() => {
      expect(screen.getByTestId('verse-5')).toBeDefined()
    })

    await user.click(screen.getByTestId('verse-5'))
    await user.keyboard('{Shift>}')
    await user.click(screen.getByTestId('verse-2'))
    await user.keyboard('{/Shift}')

    expect(screen.getByTestId('verse-2').getAttribute('aria-selected')).toBe(
      'true',
    )
    expect(screen.getByTestId('verse-4').getAttribute('aria-selected')).toBe(
      'true',
    )
    expect(screen.getByTestId('verse-5').getAttribute('aria-selected')).toBe(
      'true',
    )
    expect(
      screen.getByTestId('verse-1').getAttribute('aria-selected'),
    ).toBe('false')
  })

  it('updates bibleStore when navigated to a chapter', async () => {
    renderWithMemoryRouter('/genesis/1')

    await waitFor(() => {
      expect(useBibleStore.getState().bookId).toBe('genesis')
      expect(useBibleStore.getState().chapter).toBe(1)
    })
  })

  it('clears selection when navigating to a new chapter', async () => {
    const user = userEvent.setup()
    renderWithBrowserRouter('/genesis/1')

    await waitFor(() => {
      expect(screen.getByTestId('verse-1')).toBeDefined()
    })

    await user.click(screen.getByTestId('verse-1'))
    expect(screen.getByTestId('verse-1').getAttribute('aria-selected')).toBe(
      'true',
    )

    window.history.pushState({}, 'Test', '/genesis/2')
    window.dispatchEvent(new PopStateEvent('popstate', { state: {} }))

    await waitFor(() => {
      expect(screen.getByTestId('chapter-heading').textContent).toBe(
        'Gênesis 2',
      )
    })

    const allVerses = screen.getAllByTestId(/^verse-\d+$/)
    for (const verse of allVerses) {
      expect(verse.getAttribute('aria-selected')).toBe('false')
    }
  })

  it('verses container uses font-reading class for Crimson Pro and line-height', async () => {
    renderWithMemoryRouter('/genesis/1')

    await waitFor(() => {
      const container = screen.getByTestId('verses-container')
      expect(container.className).toContain('font-reading')
    })
  })

  it('scrolling to bottom marks chapter as read via IntersectionObserver', async () => {
    renderWithMemoryRouter('/genesis/1')

    await waitFor(() => {
      expect(screen.getByTestId('scroll-sentinel')).toBeDefined()
    })

    expect(observerCallback).not.toBeNull()

    observerCallback!([{ isIntersecting: true }])
    expect(useProgressStore.getState().isChapterRead('genesis', 1)).toBe(false)

    const main = document.querySelector('[data-testid="main-content"]') ?? window
    main.dispatchEvent(new Event('scroll', { bubbles: true }))

    observerCallback!([{ isIntersecting: true }])
    expect(useProgressStore.getState().isChapterRead('genesis', 1)).toBe(true)
  })
})

const VerseParamCapture = ({ children }: { children: React.ReactNode }) => {
  const [searchParams] = useSearchParams()
  const verseParam = searchParams.get('verse')
  const parsedVerse = verseParam ? Number(verseParam) : null
  const targetVerse =
    parsedVerse !== null &&
    Number.isInteger(parsedVerse) &&
    parsedVerse > 0
      ? parsedVerse
      : null
  return (
    <>
      {children}
      <div
        data-testid="verse-param-capture"
        data-target-verse={targetVerse ?? 'null'}
      />
    </>
  )
}

function renderWithMemoryRouterAndVerseCapture(initialEntry: string) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <VerseParamCapture>
        <Routes>
          <Route path="/:bookId/:chapter" element={<ChapterReader />} />
          <Route path="*" element={<div>Not found</div>} />
        </Routes>
      </VerseParamCapture>
    </MemoryRouter>,
  )
}

function renderWithVerseCapture(initialEntry: string) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <VerseParamCapture>
        <Routes>
          <Route path="/search" element={<div>Search</div>} />
          <Route path="/:bookId/:chapter" element={<ChapterReader />} />
          <Route path="*" element={<div>Not found</div>} />
        </Routes>
      </VerseParamCapture>
    </MemoryRouter>,
  )
}

describe('ChapterReader - verse query param', () => {
  it('passes targetVerse=5 when ?verse=5 is in the URL', async () => {
    renderWithMemoryRouterAndVerseCapture('/genesis/1?verse=5')

    await waitFor(() => {
      expect(screen.getByTestId('chapter-reader')).toBeDefined()
    })

    const capture = screen.getByTestId('verse-param-capture')
    expect(capture.getAttribute('data-target-verse')).toBe('5')
  })

  it('passes targetVerse=null when no verse param is present', async () => {
    renderWithMemoryRouterAndVerseCapture('/genesis/1')

    await waitFor(() => {
      expect(screen.getByTestId('chapter-reader')).toBeDefined()
    })

    const capture = screen.getByTestId('verse-param-capture')
    expect(capture.getAttribute('data-target-verse')).toBe('null')
  })

  it('passes targetVerse=null when ?verse=abc (non-numeric)', async () => {
    renderWithMemoryRouterAndVerseCapture('/genesis/1?verse=abc')

    await waitFor(() => {
      expect(screen.getByTestId('chapter-reader')).toBeDefined()
    })

    const capture = screen.getByTestId('verse-param-capture')
    expect(capture.getAttribute('data-target-verse')).toBe('null')
  })

  it('passes targetVerse=null when ?verse=-1 (negative)', async () => {
    renderWithMemoryRouterAndVerseCapture('/genesis/1?verse=-1')

    await waitFor(() => {
      expect(screen.getByTestId('chapter-reader')).toBeDefined()
    })

    const capture = screen.getByTestId('verse-param-capture')
    expect(capture.getAttribute('data-target-verse')).toBe('null')
  })

  it('passes targetVerse=null when ?verse=0', async () => {
    renderWithMemoryRouterAndVerseCapture('/genesis/1?verse=0')

    await waitFor(() => {
      expect(screen.getByTestId('chapter-reader')).toBeDefined()
    })

    const capture = screen.getByTestId('verse-param-capture')
    expect(capture.getAttribute('data-target-verse')).toBe('null')
  })

  it('chapter with verse param renders correctly without verse param affecting content', async () => {
    renderWithMemoryRouterAndVerseCapture('/genesis/1?verse=5')

    await waitFor(() => {
      expect(screen.getByTestId('chapter-reader')).toBeDefined()
    })

    const container = screen.getByTestId('verses-container')
    const verseElements = within(container).getAllByTestId(/^verse-\d+$/)
    expect(verseElements.length).toBe(31)
    expect(screen.getByTestId('chapter-heading').textContent).toBe('Gênesis 1')
  })
})

describe('ChapterReader - Integration', () => {
  it('navigating between chapters updates the displayed content', async () => {
    renderWithBrowserRouter('/genesis/1')

    await waitFor(() => {
      expect(screen.getByTestId('chapter-heading').textContent).toBe(
        'Gênesis 1',
      )
    })

    const genesis1Verses = within(
      screen.getByTestId('verses-container'),
    ).getAllByTestId(/^verse-\d+$/)
    expect(genesis1Verses.length).toBe(31)

    window.history.pushState({}, 'Test', '/psalms/23')
    window.dispatchEvent(new PopStateEvent('popstate', { state: {} }))

    await waitFor(() => {
      expect(screen.getByTestId('chapter-heading').textContent).toBe(
        'Salmos 23',
      )
    })

    const psalms23Verses = within(
      screen.getByTestId('verses-container'),
    ).getAllByTestId(/^verse-\d+$/)
    expect(psalms23Verses.length).toBe(6)
  })

  it('navigating to different book updates store and heading', async () => {
    renderWithBrowserRouter('/john/3')

    await waitFor(() => {
      expect(useBibleStore.getState().bookId).toBe('john')
      expect(useBibleStore.getState().chapter).toBe(3)
      expect(screen.getByTestId('chapter-heading').textContent).toBe('João 3')
    })

    window.history.pushState({}, 'Test', '/romans/8')
    window.dispatchEvent(new PopStateEvent('popstate', { state: {} }))

    await waitFor(() => {
      expect(useBibleStore.getState().bookId).toBe('romans')
      expect(useBibleStore.getState().chapter).toBe(8)
      expect(screen.getByTestId('chapter-heading').textContent).toBe(
        'Romanos 8',
      )
    })
  })

  it('renders chapter with verse param available after navigation', async () => {
    renderWithVerseCapture('/genesis/1?verse=5')

    await waitFor(() => {
      expect(screen.getByTestId('chapter-reader')).toBeDefined()
    })

    const capture = screen.getByTestId('verse-param-capture')
    expect(capture.getAttribute('data-target-verse')).toBe('5')
  })

  it('existing chapter rendering is unaffected when no verse param is present', async () => {
    renderWithBrowserRouter('/genesis/1')

    await waitFor(() => {
      expect(screen.getByTestId('chapter-reader')).toBeDefined()
    })

    const container = screen.getByTestId('verses-container')
    const verseElements = within(container).getAllByTestId(/^verse-\d+$/)
    expect(verseElements.length).toBe(31)
    expect(screen.getByTestId('chapter-heading').textContent).toBe('Gênesis 1')
  })
})
