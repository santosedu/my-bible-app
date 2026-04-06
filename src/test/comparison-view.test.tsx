import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router'
import userEvent from '@testing-library/user-event'
import { useBibleStore, useProgressStore, useThemeStore } from '@/stores'
import { ComparisonView } from '@/components/reader/ComparisonView'
import { TranslationSelector } from '@/components/reader/TranslationSelector'
import { ChapterReader } from '@/components/reader/ChapterReader'
import { getChapter } from '@/data/bibleData'
import { getTranslationMeta } from '@/data/translations'
import type { TranslationId } from '@/types'

const mockIsMobile = vi.hoisted(() => vi.fn(() => false))

vi.mock('@/hooks/useIsMobile', () => ({
  useIsMobile: () => mockIsMobile(),
}))

beforeEach(() => {
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
  mockIsMobile.mockReturnValue(false)

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

function renderComparisonView(bookId = 'genesis', chapterNum = 1) {
  return render(
    <MemoryRouter>
      <ComparisonView bookId={bookId} chapterNum={chapterNum} />
    </MemoryRouter>,
  )
}

function renderChapterReader(initialEntry = '/genesis/1') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/:bookId/:chapter" element={<ChapterReader />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('TranslationSelector', () => {
  it('shows all three translations as selectable chips', () => {
    const onChange = vi.fn()
    render(
      <TranslationSelector
        selectedTranslations={['ara', 'acf']}
        onSelectionChange={onChange}
      />,
    )

    expect(screen.getByTestId('translation-chip-ara')).toBeDefined()
    expect(screen.getByTestId('translation-chip-acf')).toBeDefined()
    expect(screen.getByTestId('translation-chip-nvi')).toBeDefined()
    expect(screen.getByText('ARA')).toBeDefined()
    expect(screen.getByText('ACF')).toBeDefined()
    expect(screen.getByText('NVI')).toBeDefined()
  })

  it('marks selected translations with active chip style', () => {
    render(
      <TranslationSelector
        selectedTranslations={['ara', 'acf']}
        onSelectionChange={vi.fn()}
      />,
    )

    expect(screen.getByTestId('translation-chip-ara').className).toContain('active')
    expect(screen.getByTestId('translation-chip-acf').className).toContain('active')
    expect(screen.getByTestId('translation-chip-nvi').className).not.toContain('active')
  })

  it('calls onSelectionChange when toggling a translation', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <TranslationSelector
        selectedTranslations={['ara', 'acf']}
        onSelectionChange={onChange}
      />,
    )

    await user.click(screen.getByTestId('translation-chip-nvi'))
    expect(onChange).toHaveBeenCalledWith(['ara', 'acf', 'nvi'])
  })

  it('does not deselect below 2 translations', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <TranslationSelector
        selectedTranslations={['ara', 'acf']}
        onSelectionChange={onChange}
      />,
    )

    await user.click(screen.getByTestId('translation-chip-ara'))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('cannot select more than 3 translations', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <TranslationSelector
        selectedTranslations={['ara', 'acf', 'nvi']}
        onSelectionChange={onChange}
      />,
    )

    await user.click(screen.getByTestId('translation-chip-ara'))
    expect(onChange).toHaveBeenCalledWith(['acf', 'nvi'])
  })

  it('deselects a translation when 3 are selected', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <TranslationSelector
        selectedTranslations={['ara', 'acf', 'nvi']}
        onSelectionChange={onChange}
      />,
    )

    await user.click(screen.getByTestId('translation-chip-nvi'))
    expect(onChange).toHaveBeenCalledWith(['ara', 'acf'])
  })

  it('has correct ARIA attributes', () => {
    render(
      <TranslationSelector
        selectedTranslations={['ara', 'acf']}
        onSelectionChange={vi.fn()}
      />,
    )

    const group = screen.getByTestId('translation-selector')
    expect(group.getAttribute('role')).toBe('group')

    const chipAra = screen.getByTestId('translation-chip-ara')
    expect(chipAra.getAttribute('role')).toBe('radio')
    expect(chipAra.getAttribute('aria-checked')).toBe('true')

    const chipNvi = screen.getByTestId('translation-chip-nvi')
    expect(chipNvi.getAttribute('aria-checked')).toBe('false')
  })
})

describe('ComparisonView', () => {
  it('renders comparison view container', async () => {
    renderComparisonView()

    await waitFor(() => {
      expect(screen.getByTestId('comparison-view')).toBeDefined()
    })
  })

  it('renders correct number of translation columns for 2 translations', async () => {
    useBibleStore.setState({
      comparisonTranslations: ['ara', 'acf'],
    })

    renderComparisonView()

    await waitFor(() => {
      expect(screen.getByTestId('comparison-desktop')).toBeDefined()
    })

    expect(screen.getByTestId('comparison-column-ara')).toBeDefined()
    expect(screen.getByTestId('comparison-column-acf')).toBeDefined()
    expect(screen.queryByTestId('comparison-column-nvi')).toBeNull()
  })

  it('renders correct number of translation columns for 3 translations', async () => {
    useBibleStore.setState({
      comparisonTranslations: ['ara', 'acf', 'nvi'],
    })

    renderComparisonView()

    await waitFor(() => {
      expect(screen.getByTestId('comparison-column-nvi')).toBeDefined()
    })

    expect(screen.getByTestId('comparison-column-ara')).toBeDefined()
    expect(screen.getByTestId('comparison-column-acf')).toBeDefined()
    expect(screen.getByTestId('comparison-column-nvi')).toBeDefined()
  })

  it('each column displays verses from the correct translation', async () => {
    useBibleStore.setState({
      comparisonTranslations: ['ara', 'acf'],
    })

    await getChapter('genesis', 1, 'acf')

    renderComparisonView()

    await waitFor(() => {
      expect(
        screen.getByTestId('verses-container-acf').querySelectorAll(
          '[data-testid^="verse-"]',
        ).length,
      ).toBeGreaterThan(0)
    })

    const araVerses = within(
      screen.getByTestId('verses-container-ara'),
    ).getAllByTestId(/^verse-\d+$/)
    const acfVerses = within(
      screen.getByTestId('verses-container-acf'),
    ).getAllByTestId(/^verse-\d+$/)

    expect(araVerses.length).toBe(31)
    expect(acfVerses.length).toBeGreaterThanOrEqual(1)
  })

  it('initializes default translations when comparisonTranslations is empty', async () => {
    useBibleStore.setState({
      comparisonTranslations: [],
    })

    renderComparisonView()

    await waitFor(() => {
      expect(screen.getByTestId('comparison-desktop')).toBeDefined()
    })

    expect(screen.getByTestId('comparison-column-nvi')).toBeDefined()
    expect(screen.getByTestId('comparison-column-ara')).toBeDefined()
  })

  it('selecting a translation updates the comparison columns', async () => {
    const user = userEvent.setup()
    useBibleStore.setState({
      comparisonTranslations: ['ara', 'acf'],
    })

    renderComparisonView()

    await waitFor(() => {
      expect(screen.getByTestId('comparison-column-ara')).toBeDefined()
    })

    await user.click(screen.getByTestId('translation-chip-nvi'))

    await waitFor(() => {
      expect(screen.getByTestId('comparison-column-nvi')).toBeDefined()
    })

    expect(useBibleStore.getState().comparisonTranslations).toEqual([
      'ara',
      'acf',
      'nvi',
    ])
  })

  it('scrolling one column synchronizes scroll position of other columns', async () => {
    useBibleStore.setState({
      comparisonTranslations: ['ara', 'acf'],
    })

    renderComparisonView()

    await waitFor(() => {
      expect(
        screen.getByTestId('verses-container-acf').querySelectorAll(
          '[data-testid^="verse-"]',
        ).length,
      ).toBeGreaterThan(0)
    })

    const containerAra = screen.getByTestId('verses-container-ara')
    const containerAcf = screen.getByTestId('verses-container-acf')

    Object.defineProperty(containerAra, 'scrollHeight', {
      value: 2000,
      configurable: true,
    })
    Object.defineProperty(containerAra, 'clientHeight', {
      value: 400,
      configurable: true,
    })
    Object.defineProperty(containerAcf, 'scrollHeight', {
      value: 1600,
      configurable: true,
    })
    Object.defineProperty(containerAcf, 'clientHeight', {
      value: 400,
      configurable: true,
    })

    containerAra.scrollTop = 800
    fireEvent.scroll(containerAra)

    const expectedRatio = 800 / (2000 - 400)
    const expectedScroll = expectedRatio * (1600 - 400)
    expect(containerAcf.scrollTop).toBeCloseTo(expectedScroll, 0)
  })

  it('mobile viewport shows single column with translation switcher', async () => {
    mockIsMobile.mockReturnValue(true)
    useBibleStore.setState({
      comparisonTranslations: ['ara', 'acf'],
    })

    renderComparisonView()

    await waitFor(() => {
      expect(screen.getByTestId('comparison-mobile')).toBeDefined()
    })

    expect(screen.queryByTestId('comparison-desktop')).toBeNull()
    expect(screen.getByTestId('mobile-switch-ara')).toBeDefined()
    expect(screen.getByTestId('mobile-switch-acf')).toBeDefined()
    expect(screen.getByTestId('verses-container')).toBeDefined()
  })

  it('mobile switcher changes visible translation', async () => {
    const user = userEvent.setup()
    mockIsMobile.mockReturnValue(true)
    useBibleStore.setState({
      comparisonTranslations: ['ara', 'acf'],
    })

    renderComparisonView()

    await waitFor(() => {
      expect(screen.getByTestId('comparison-mobile')).toBeDefined()
    })

    expect(screen.getByTestId('mobile-switch-ara').className).toContain('active')

    await user.click(screen.getByTestId('mobile-switch-acf'))

    expect(screen.getByTestId('mobile-switch-acf').className).toContain('active')
    expect(screen.getByTestId('mobile-switch-ara').className).not.toContain('active')
  })
})

describe('ChapterReader - Comparison Integration', () => {
  it('toggling comparison mode shows comparison view', async () => {
    const user = userEvent.setup()
    renderChapterReader()

    await waitFor(() => {
      expect(screen.getByTestId('chapter-heading')).toBeDefined()
    })

    expect(screen.queryByTestId('comparison-view')).toBeNull()
    expect(screen.getByTestId('verses-container')).toBeDefined()

    await user.click(screen.getByTestId('comparison-toggle'))

    await waitFor(() => {
      expect(screen.getByTestId('comparison-view')).toBeDefined()
    })

    expect(screen.queryByTestId('verses-container')).toBeNull()
  })

  it('toggling comparison mode off restores single translation view', async () => {
    const user = userEvent.setup()
    renderChapterReader()

    await waitFor(() => {
      expect(screen.getByTestId('chapter-heading')).toBeDefined()
    })

    await user.click(screen.getByTestId('comparison-toggle'))

    await waitFor(() => {
      expect(screen.getByTestId('comparison-view')).toBeDefined()
    })

    await user.click(screen.getByTestId('comparison-toggle'))

    await waitFor(() => {
      expect(screen.getByTestId('verses-container')).toBeDefined()
    })

    expect(screen.queryByTestId('comparison-view')).toBeNull()
  })

  it('comparison toggle has correct ARIA attributes', async () => {
    renderChapterReader()

    await waitFor(() => {
      expect(screen.getByTestId('comparison-toggle')).toBeDefined()
    })

    const toggle = screen.getByTestId('comparison-toggle')
    expect(toggle.getAttribute('aria-pressed')).toBe('false')

    await userEvent.setup().click(toggle)

    expect(toggle.getAttribute('aria-pressed')).toBe('true')
  })

  it('comparison mode persists across page reload via bibleStore', async () => {
    useBibleStore.setState({
      comparisonMode: true,
      comparisonTranslations: ['ara', 'nvi'],
    })

    const stored = localStorage.getItem('bible-app-bible')
    expect(stored).not.toBeNull()
    const parsed = JSON.parse(stored!)
    expect(parsed.state.comparisonMode).toBe(true)
    expect(parsed.state.comparisonTranslations).toEqual(['ara', 'nvi'])
  })

  it('restores comparison mode from localStorage', async () => {
    useBibleStore.setState({
      comparisonMode: false,
      comparisonTranslations: [],
    })

    localStorage.setItem(
      'bible-app-bible',
      JSON.stringify({
        state: {
          bookId: 'genesis',
          chapter: 1,
          activeTranslation: 'nvi',
          comparisonMode: true,
          comparisonTranslations: ['ara', 'acf'],
        },
        version: 0,
      }),
    )

    await useBibleStore.persist.rehydrate()

    expect(useBibleStore.getState().comparisonMode).toBe(true)
    expect(useBibleStore.getState().comparisonTranslations).toEqual(['ara', 'acf'])
  })

  it('handles chapters with different verse counts across translations', async () => {
    useBibleStore.setState({
      comparisonTranslations: ['ara', 'acf'],
    })

    renderComparisonView('genesis', 1)

    await waitFor(() => {
      expect(
        screen.getByTestId('verses-container-acf').querySelectorAll(
          '[data-testid^="verse-"]',
        ).length,
      ).toBeGreaterThan(0)
    })

    const araContainer = screen.getByTestId('verses-container-ara')
    const acfContainer = screen.getByTestId('verses-container-acf')

    const araVerses = within(araContainer).getAllByTestId(/^verse-\d+$/)
    const acfVerses = within(acfContainer).getAllByTestId(/^verse-\d+$/)

    expect(araVerses.length).toBeGreaterThanOrEqual(1)
    expect(acfVerses.length).toBeGreaterThanOrEqual(1)

    expect(screen.getByTestId('comparison-desktop')).toBeDefined()
  })

  it('verse selection works in single translation mode', async () => {
    const user = userEvent.setup()
    renderChapterReader()

    await waitFor(() => {
      expect(screen.getByTestId('verse-1')).toBeDefined()
    })

    await user.click(screen.getByTestId('verse-1'))
    expect(screen.getByTestId('verse-1').getAttribute('aria-selected')).toBe('true')
  })
})

describe('translations data', () => {
  it('getTranslationMeta returns null for unknown translation', () => {
    expect(getTranslationMeta('xxx' as TranslationId)).toBeNull()
  })
})
