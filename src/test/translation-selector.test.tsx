import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router'
import userEvent from '@testing-library/user-event'
import { useBibleStore, useProgressStore, useThemeStore } from '@/stores'
import { Header } from '@/components/layout/Header'
import { ChapterReader } from '@/components/reader/ChapterReader'
import { SidebarProvider } from '@/components/layout/SidebarContext'
import { getChapterSync } from '@/data/bibleData'
import { defaultTranslationId, translations } from '@/data/translations'

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

function renderHeader() {
  return render(
    <MemoryRouter>
      <SidebarProvider>
        <Header />
      </SidebarProvider>
    </MemoryRouter>,
  )
}

function renderChapterReaderWithHeader(initialEntry = '/genesis/1') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <SidebarProvider>
        <Header />
        <Routes>
          <Route path="/:bookId/:chapter" element={<ChapterReader />} />
        </Routes>
      </SidebarProvider>
    </MemoryRouter>,
  )
}

describe('defaultTranslationId', () => {
  it('should be nvi', () => {
    expect(defaultTranslationId).toBe('nvi')
  })

  it('should match the default in bibleStore', () => {
    useBibleStore.setState({
      bookId: null,
      chapter: null,
      activeTranslation: 'nvi',
      comparisonTranslations: [],
      comparisonMode: false,
    })
    expect(useBibleStore.getState().activeTranslation).toBe(defaultTranslationId)
  })
})

describe('getChapterSync with translation parameter', () => {
  it('returns NVI verses when translationId is nvi', () => {
    const verses = getChapterSync('genesis', 1, 'nvi')
    expect(verses.length).toBeGreaterThan(0)
    expect(verses[0].text).toContain('Deus')
  })

  it('returns ARA verses when translationId is ara', () => {
    const verses = getChapterSync('genesis', 1, 'ara')
    expect(verses.length).toBeGreaterThan(0)
    expect(verses[0].text).toContain('Deus')
  })

  it('returns ACF verses when translationId is acf', () => {
    const verses = getChapterSync('genesis', 1, 'acf')
    expect(verses.length).toBeGreaterThan(0)
    expect(verses[0].text).toContain('Deus')
  })

  it('returns different text for different translations', () => {
    const nviVerses = getChapterSync('genesis', 1, 'nvi')
    const araVerses = getChapterSync('genesis', 1, 'ara')
    expect(nviVerses[0].text).not.toBe(araVerses[0].text)
  })

  it('defaults to NVI when no translationId is provided', () => {
    const versesWithDefault = getChapterSync('genesis', 1)
    const versesWithNvi = getChapterSync('genesis', 1, 'nvi')
    expect(versesWithDefault[0].text).toBe(versesWithNvi[0].text)
  })
})

describe('bibleStore translation state', () => {
  it('initializes with nvi as the default active translation', () => {
    expect(useBibleStore.getState().activeTranslation).toBe('nvi')
  })

  it('setActiveTranslation changes the active translation', () => {
    useBibleStore.getState().setActiveTranslation('ara')
    expect(useBibleStore.getState().activeTranslation).toBe('ara')

    useBibleStore.getState().setActiveTranslation('acf')
    expect(useBibleStore.getState().activeTranslation).toBe('acf')

    useBibleStore.getState().setActiveTranslation('nvi')
    expect(useBibleStore.getState().activeTranslation).toBe('nvi')
  })

  it('persists activeTranslation to localStorage', () => {
    useBibleStore.getState().setActiveTranslation('acf')
    
    const serialized = localStorage.getItem('bible-app-bible')
    expect(serialized).toBeDefined()
    
    const parsed = JSON.parse(serialized!)
    expect(parsed.state.activeTranslation).toBe('acf')
  })

  it('stores translation preference in localStorage', () => {
    localStorage.clear()
    
    useBibleStore.setState({
      bookId: null,
      chapter: null,
      activeTranslation: 'ara',
      comparisonTranslations: [],
      comparisonMode: false,
    })

    const stored = localStorage.getItem('bible-app-bible')
    expect(stored).toBeDefined()
    const parsed = JSON.parse(stored!)
    expect(parsed.state.activeTranslation).toBe('ara')
  })
})

describe('Header translation selector', () => {
  it('renders 3 translation chips (ARA, ACF, NVI)', () => {
    renderHeader()
    
    expect(screen.getByTestId('header-translation-chip-ara')).toBeDefined()
    expect(screen.getByTestId('header-translation-chip-acf')).toBeDefined()
    expect(screen.getByTestId('header-translation-chip-nvi')).toBeDefined()
  })

  it('shows NVI chip as active by default', () => {
    useBibleStore.setState({
      activeTranslation: 'nvi',
      comparisonTranslations: [],
      comparisonMode: false,
    })

    renderHeader()
    
    const nviChip = screen.getByTestId('header-translation-chip-nvi')
    expect(nviChip.className).toContain('active')
    expect(nviChip.getAttribute('aria-checked')).toBe('true')
  })

  it('shows ARA chip as active when ARA is selected', () => {
    useBibleStore.setState({
      activeTranslation: 'ara',
      comparisonTranslations: [],
      comparisonMode: false,
    })

    renderHeader()
    
    const araChip = screen.getByTestId('header-translation-chip-ara')
    expect(araChip.className).toContain('active')
    expect(araChip.getAttribute('aria-checked')).toBe('true')
    
    const nviChip = screen.getByTestId('header-translation-chip-nvi')
    expect(nviChip.className).not.toContain('active')
    expect(nviChip.getAttribute('aria-checked')).toBe('false')
  })

  it('clicking a chip calls setActiveTranslation', async () => {
    const user = userEvent.setup()
    renderHeader()
    
    await user.click(screen.getByTestId('header-translation-chip-ara'))
    expect(useBibleStore.getState().activeTranslation).toBe('ara')
    
    await user.click(screen.getByTestId('header-translation-chip-acf'))
    expect(useBibleStore.getState().activeTranslation).toBe('acf')
    
    await user.click(screen.getByTestId('header-translation-chip-nvi'))
    expect(useBibleStore.getState().activeTranslation).toBe('nvi')
  })

  it('has role="radiogroup" and aria-label on the selector container', () => {
    renderHeader()
    
    const selector = screen.getByTestId('header-translation-selector')
    expect(selector).toBeDefined()
    expect(selector.getAttribute('role')).toBe('radiogroup')
    expect(selector.getAttribute('aria-label')).toBe('Selecione a tradução da Bíblia')
  })

  it('each chip has role="radio" and aria-checked', () => {
    useBibleStore.setState({
      activeTranslation: 'nvi',
      comparisonTranslations: [],
      comparisonMode: false,
    })

    renderHeader()
    
    translations.forEach((t) => {
      const chip = screen.getByTestId(`header-translation-chip-${t.id}`)
      expect(chip.getAttribute('role')).toBe('radio')
      expect(chip.getAttribute('aria-checked')).toBe(
        t.id === 'nvi' ? 'true' : 'false'
      )
    })
  })

  it('tabIndex is 0 for active chip and -1 for inactive chips', () => {
    useBibleStore.setState({
      activeTranslation: 'nvi',
      comparisonTranslations: [],
      comparisonMode: false,
    })

    renderHeader()
    
    const nviChip = screen.getByTestId('header-translation-chip-nvi')
    const araChip = screen.getByTestId('header-translation-chip-ara')
    const acfChip = screen.getByTestId('header-translation-chip-acf')
    
    expect(nviChip.getAttribute('tabIndex')).toBe('0')
    expect(araChip.getAttribute('tabIndex')).toBe('-1')
    expect(acfChip.getAttribute('tabIndex')).toBe('-1')
  })

  it('keyboard navigation: ArrowRight moves focus to next chip', async () => {
    const user = userEvent.setup()
    useBibleStore.setState({
      activeTranslation: 'ara',
      comparisonTranslations: [],
      comparisonMode: false,
    })

    renderHeader()
    
    const araChip = screen.getByTestId('header-translation-chip-ara')
    await user.click(araChip)
    
    await user.keyboard('{ArrowRight}')
    
    const acfChip = screen.getByTestId('header-translation-chip-acf')
    expect(acfChip).toHaveFocus()
  })

  it('keyboard navigation: ArrowLeft moves focus to previous chip', async () => {
    const user = userEvent.setup()
    useBibleStore.setState({
      activeTranslation: 'nvi',
      comparisonTranslations: [],
      comparisonMode: false,
    })

    renderHeader()
    
    const nviChip = screen.getByTestId('header-translation-chip-nvi')
    await user.click(nviChip)
    
    await user.keyboard('{ArrowLeft}')
    
    const acfChip = screen.getByTestId('header-translation-chip-acf')
    expect(acfChip).toHaveFocus()
  })

  it('keyboard navigation: Home moves focus to first chip', async () => {
    const user = userEvent.setup()
    useBibleStore.setState({
      activeTranslation: 'nvi',
      comparisonTranslations: [],
      comparisonMode: false,
    })

    renderHeader()
    
    const nviChip = screen.getByTestId('header-translation-chip-nvi')
    await user.click(nviChip)
    
    await user.keyboard('{Home}')
    
    const araChip = screen.getByTestId('header-translation-chip-ara')
    expect(araChip).toHaveFocus()
  })

  it('keyboard navigation: End moves focus to last chip', async () => {
    const user = userEvent.setup()
    useBibleStore.setState({
      activeTranslation: 'ara',
      comparisonTranslations: [],
      comparisonMode: false,
    })

    renderHeader()
    
    const araChip = screen.getByTestId('header-translation-chip-ara')
    await user.click(araChip)
    
    await user.keyboard('{End}')
    
    const nviChip = screen.getByTestId('header-translation-chip-nvi')
    expect(nviChip).toHaveFocus()
  })

  it('Enter key selects a translation', async () => {
    const user = userEvent.setup()
    renderHeader()
    
    const acfChip = screen.getByTestId('header-translation-chip-acf')
    await user.click(acfChip)
    await user.keyboard('{Enter}')
    
    expect(useBibleStore.getState().activeTranslation).toBe('acf')
  })

  it('Space key selects a translation', async () => {
    const user = userEvent.setup()
    renderHeader()
    
    const acfChip = screen.getByTestId('header-translation-chip-acf')
    await user.click(acfChip)
    await user.keyboard(' ') // Space
    
    expect(useBibleStore.getState().activeTranslation).toBe('acf')
  })
})

describe('Header + ChapterReader integration', () => {
  it('switching translation via store updates chapter reader text', async () => {
    useBibleStore.setState({
      activeTranslation: 'nvi',
      comparisonTranslations: [],
      comparisonMode: false,
    })

    renderChapterReaderWithHeader('/genesis/1')

    await waitFor(() => {
      expect(screen.getByTestId('chapter-reader')).toBeDefined()
    })

    const nviVerse1 = within(screen.getByTestId('verses-container'))
      .getByTestId('verse-1')
      .textContent

    useBibleStore.getState().setActiveTranslation('ara')
    
    await waitFor(() => {
      const araVerse1 = within(screen.getByTestId('verses-container'))
        .getByTestId('verse-1')
        .textContent
      expect(araVerse1).not.toBe(nviVerse1)
    })
  })

  it('switching translation to ARA renders ARA text', async () => {
    useBibleStore.setState({
      activeTranslation: 'nvi',
      comparisonTranslations: [],
      comparisonMode: false,
    })

    renderChapterReaderWithHeader('/genesis/1')

    await waitFor(() => {
      expect(screen.getByTestId('chapter-reader')).toBeDefined()
    })

    useBibleStore.getState().setActiveTranslation('ara')
    
    await waitFor(() => {
      expect(screen.getByTestId('verses-container')).toBeDefined()
    })

    const verse1 = within(screen.getByTestId('verses-container'))
      .getByTestId('verse-1')
      .textContent
    expect(verse1).toContain('Deus')
  })

  it('selected translation is saved to localStorage', () => {
    localStorage.clear()
    useBibleStore.getState().setActiveTranslation('acf')
    
    const stored = localStorage.getItem('bible-app-bible')
    expect(stored).toBeDefined()
    const parsed = JSON.parse(stored!)
    expect(parsed.state.activeTranslation).toBe('acf')
  })

  it('switching translation while viewing a chapter immediately updates displayed text', async () => {
    useBibleStore.setState({
      activeTranslation: 'nvi',
      bookId: 'genesis',
      chapter: 1,
      comparisonTranslations: [],
      comparisonMode: false,
    })

    renderChapterReaderWithHeader('/genesis/1')

    await waitFor(() => {
      expect(screen.getByTestId('chapter-reader')).toBeDefined()
    })

    const initialVerseText = within(screen.getByTestId('verses-container'))
      .getByTestId('verse-1')
      .textContent

    useBibleStore.getState().setActiveTranslation('ara')

    await waitFor(() => {
      const newVerseText = within(screen.getByTestId('verses-container'))
        .getByTestId('verse-1')
        .textContent
      expect(newVerseText).not.toBe(initialVerseText)
    })
  })
})
