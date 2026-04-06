import { describe, it, expect, beforeEach } from 'vitest'
import { useBibleStore } from '@/stores/bibleStore'
import { useStudyStore } from '@/stores/studyStore'
import { useProgressStore } from '@/stores/progressStore'
import { useThemeStore } from '@/stores/themeStore'

beforeEach(() => {
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
})

describe('bibleStore', () => {
  it('setBook sets current bookId', () => {
    useBibleStore.getState().setBook('genesis')
    expect(useBibleStore.getState().bookId).toBe('genesis')
  })

  it('setChapter sets current chapter', () => {
    useBibleStore.getState().setChapter(3)
    expect(useBibleStore.getState().chapter).toBe(3)
  })

  it('setActiveTranslation changes active translation', () => {
    useBibleStore.getState().setActiveTranslation('nvi')
    expect(useBibleStore.getState().activeTranslation).toBe('nvi')
  })

  it('toggleComparisonMode flips comparison flag', () => {
    expect(useBibleStore.getState().comparisonMode).toBe(false)
    useBibleStore.getState().toggleComparisonMode()
    expect(useBibleStore.getState().comparisonMode).toBe(true)
    useBibleStore.getState().toggleComparisonMode()
    expect(useBibleStore.getState().comparisonMode).toBe(false)
  })

  it('setComparisonTranslations sets comparison list', () => {
    useBibleStore.getState().setComparisonTranslations(['acf', 'nvi'])
    expect(useBibleStore.getState().comparisonTranslations).toEqual(['acf', 'nvi'])
  })

  it('navigateTo sets both bookId and chapter', () => {
    useBibleStore.getState().navigateTo('psalms', 23)
    const state = useBibleStore.getState()
    expect(state.bookId).toBe('psalms')
    expect(state.chapter).toBe(23)
  })
})

describe('studyStore', () => {
  it('addHighlight adds highlight with correct color', () => {
    useStudyStore.getState().addHighlight({
      bookId: 'genesis',
      chapter: 1,
      startVerse: 1,
      endVerse: 3,
      color: 'yellow',
    })
    const highlights = useStudyStore.getState().highlights
    expect(highlights).toHaveLength(1)
    expect(highlights[0].color).toBe('yellow')
    expect(highlights[0].id).toBeDefined()
    expect(highlights[0].createdAt).toBeTypeOf('number')
  })

  it('removeHighlight removes it', () => {
    useStudyStore.getState().addHighlight({
      bookId: 'genesis',
      chapter: 1,
      startVerse: 1,
      endVerse: 3,
      color: 'green',
    })
    const id = useStudyStore.getState().highlights[0].id
    useStudyStore.getState().removeHighlight(id)
    expect(useStudyStore.getState().highlights).toHaveLength(0)
  })

  it('editHighlightColor updates color', () => {
    useStudyStore.getState().addHighlight({
      bookId: 'john',
      chapter: 3,
      startVerse: 16,
      endVerse: 16,
      color: 'yellow',
    })
    const id = useStudyStore.getState().highlights[0].id
    useStudyStore.getState().editHighlightColor(id, 'rose')
    expect(useStudyStore.getState().highlights[0].color).toBe('rose')
  })

  it('addNote creates note', () => {
    useStudyStore.getState().addNote({
      bookId: 'john',
      chapter: 3,
      startVerse: 16,
      endVerse: null,
      text: 'For God so loved',
    })
    const notes = useStudyStore.getState().notes
    expect(notes).toHaveLength(1)
    expect(notes[0].text).toBe('For God so loved')
  })

  it('updateNote modifies text', () => {
    useStudyStore.getState().addNote({
      bookId: 'john',
      chapter: 3,
      startVerse: 16,
      endVerse: null,
      text: 'original',
    })
    const id = useStudyStore.getState().notes[0].id
    useStudyStore.getState().updateNote(id, 'updated')
    expect(useStudyStore.getState().notes[0].text).toBe('updated')
  })

  it('deleteNote removes it', () => {
    useStudyStore.getState().addNote({
      bookId: 'john',
      chapter: 3,
      startVerse: 16,
      endVerse: null,
      text: 'test',
    })
    const id = useStudyStore.getState().notes[0].id
    useStudyStore.getState().deleteNote(id)
    expect(useStudyStore.getState().notes).toHaveLength(0)
  })

  it('addBookmark creates bookmark', () => {
    useStudyStore.getState().addBookmark({
      bookId: 'psalms',
      chapter: 23,
      verse: 1,
      label: 'Shepherd psalm',
    })
    const bookmarks = useStudyStore.getState().bookmarks
    expect(bookmarks).toHaveLength(1)
    expect(bookmarks[0].label).toBe('Shepherd psalm')
  })

  it('removeBookmark removes it', () => {
    useStudyStore.getState().addBookmark({
      bookId: 'psalms',
      chapter: 23,
      verse: 1,
      label: 'test',
    })
    const id = useStudyStore.getState().bookmarks[0].id
    useStudyStore.getState().removeBookmark(id)
    expect(useStudyStore.getState().bookmarks).toHaveLength(0)
  })

  it('updateBookmarkLabel changes label', () => {
    useStudyStore.getState().addBookmark({
      bookId: 'psalms',
      chapter: 23,
      verse: 1,
      label: 'old',
    })
    const id = useStudyStore.getState().bookmarks[0].id
    useStudyStore.getState().updateBookmarkLabel(id, 'new')
    expect(useStudyStore.getState().bookmarks[0].label).toBe('new')
  })
})

describe('progressStore', () => {
  it('markChapterAsRead records the chapter', () => {
    useProgressStore.getState().markChapterAsRead('genesis', 1)
    expect(useProgressStore.getState().isChapterRead('genesis', 1)).toBe(true)
  })

  it('isChapterRead returns false for unread chapters', () => {
    expect(useProgressStore.getState().isChapterRead('genesis', 1)).toBe(false)
  })

  it('getBookProgress returns correct fraction', () => {
    useProgressStore.getState().markChapterAsRead('genesis', 1)
    useProgressStore.getState().markChapterAsRead('genesis', 2)
    useProgressStore.getState().markChapterAsRead('genesis', 3)
    const progress = useProgressStore.getState().getBookProgress('genesis')
    expect(progress.read).toBe(3)
    expect(progress.total).toBe(50)
  })

  it('getOverallProgress returns fraction of all 1189 chapters read', () => {
    useProgressStore.getState().markChapterAsRead('genesis', 1)
    useProgressStore.getState().markChapterAsRead('genesis', 2)
    const progress = useProgressStore.getState().getOverallProgress()
    expect(progress.total).toBe(1189)
    expect(progress.read).toBe(2)
  })

  it('does not duplicate read chapters', () => {
    useProgressStore.getState().markChapterAsRead('genesis', 1)
    useProgressStore.getState().markChapterAsRead('genesis', 1)
    const progress = useProgressStore.getState().getOverallProgress()
    expect(progress.read).toBe(1)
  })

  it('getBookProgress only counts chapters for the specified book', () => {
    useProgressStore.getState().markChapterAsRead('genesis', 1)
    useProgressStore.getState().markChapterAsRead('genesis', 2)
    useProgressStore.getState().markChapterAsRead('psalms', 1)
    const progress = useProgressStore.getState().getBookProgress('genesis')
    expect(progress.read).toBe(2)
    expect(progress.total).toBe(50)
  })
})

describe('themeStore', () => {
  it('setTheme persists theme', () => {
    useThemeStore.getState().setTheme('dark')
    expect(useThemeStore.getState().preference).toBe('dark')
  })

  it('resolved theme returns actual theme for explicit values', () => {
    useThemeStore.getState().setTheme('sepia')
    expect(useThemeStore.getState().getResolvedTheme()).toBe('sepia')

    useThemeStore.getState().setTheme('light')
    expect(useThemeStore.getState().getResolvedTheme()).toBe('light')

    useThemeStore.getState().setTheme('dark')
    expect(useThemeStore.getState().getResolvedTheme()).toBe('dark')

    useThemeStore.getState().setTheme('green')
    expect(useThemeStore.getState().getResolvedTheme()).toBe('green')

    useThemeStore.getState().setTheme('blue')
    expect(useThemeStore.getState().getResolvedTheme()).toBe('blue')

    useThemeStore.getState().setTheme('orange')
    expect(useThemeStore.getState().getResolvedTheme()).toBe('orange')
  })

  it('resolved theme handles system preference', () => {
    useThemeStore.getState().setTheme('system')
    const resolved = useThemeStore.getState().getResolvedTheme()
    expect(['light', 'dark']).toContain(resolved)
  })

  it('defaults to system preference', () => {
    expect(useThemeStore.getState().preference).toBe('system')
  })

  it('resolved theme returns dark for dark OS preference', () => {
    const originalMatchMedia = window.matchMedia
    window.matchMedia = (query: string) =>
      ({
        matches: query.includes('dark'),
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }) as unknown as MediaQueryList

    useThemeStore.getState().setTheme('system')
    expect(useThemeStore.getState().getResolvedTheme()).toBe('dark')

    window.matchMedia = originalMatchMedia
  })
})

describe('persist middleware', () => {
  it('state survives localStorage serialization cycle', () => {
    useBibleStore.getState().navigateTo('genesis', 1)
    useBibleStore.getState().setActiveTranslation('acf')

    const serialized = localStorage.getItem('bible-app-bible')
    expect(serialized).toBeDefined()

    useBibleStore.setState({
      bookId: null,
      chapter: null,
      activeTranslation: 'nvi',
      comparisonTranslations: [],
      comparisonMode: false,
    })

    const parsed = JSON.parse(serialized!)
    expect(parsed.state.bookId).toBe('genesis')
    expect(parsed.state.chapter).toBe(1)
    expect(parsed.state.activeTranslation).toBe('acf')
  })

  it('study store persists correctly', () => {
    useStudyStore.getState().addHighlight({
      bookId: 'genesis',
      chapter: 1,
      startVerse: 1,
      endVerse: 1,
      color: 'rose',
    })

    const serialized = localStorage.getItem('bible-app-study')
    expect(serialized).toBeDefined()
    const parsed = JSON.parse(serialized!)
    expect(parsed.state.highlights).toHaveLength(1)
  })

  it('theme store persists correctly', () => {
    useThemeStore.getState().setTheme('dark')

    const serialized = localStorage.getItem('bible-app-theme')
    expect(serialized).toBeDefined()
    const parsed = JSON.parse(serialized!)
    expect(parsed.state.preference).toBe('dark')
  })

  it('progress store persists Set as array', () => {
    useProgressStore.getState().markChapterAsRead('genesis', 1)
    useProgressStore.getState().markChapterAsRead('genesis', 2)

    const serialized = localStorage.getItem('bible-app-progress')
    expect(serialized).toBeDefined()
    const parsed = JSON.parse(serialized!)
    expect(parsed.state.readChapters).toHaveLength(2)
  })
})

describe('multiple stores simultaneously', () => {
  it('stores do not conflict', () => {
    useBibleStore.getState().navigateTo('genesis', 1)
    useStudyStore.getState().addBookmark({
      bookId: 'genesis',
      chapter: 1,
      verse: null,
      label: 'test',
    })
    useProgressStore.getState().markChapterAsRead('genesis', 1)
    useThemeStore.getState().setTheme('dark')

    expect(useBibleStore.getState().bookId).toBe('genesis')
    expect(useStudyStore.getState().bookmarks).toHaveLength(1)
    expect(useProgressStore.getState().isChapterRead('genesis', 1)).toBe(true)
    expect(useThemeStore.getState().preference).toBe('dark')
  })
})
