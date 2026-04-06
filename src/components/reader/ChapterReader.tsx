import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useParams } from 'react-router'
import { getChapterSync, getBook } from '@/data/bibleData'
import { translations } from '@/data/translations'
import { useBibleStore, useProgressStore, useStudyStore } from '@/stores'
import { VerseBlock } from './VerseBlock'
import { ComparisonView } from './ComparisonView'
import { HighlightPicker } from '@/components/study/HighlightPicker'
import { NoteEditor } from '@/components/study/NoteEditor'
import type { Verse, TranslationId, Highlight, HighlightColor, Note } from '@/types'

function getHighlightForVerse(
  highlights: Highlight[],
  bookId: string,
  chapter: number,
  verseNumber: number,
): HighlightColor | null {
  for (const h of highlights) {
    if (
      h.bookId === bookId &&
      h.chapter === chapter &&
      verseNumber >= h.startVerse &&
      verseNumber <= h.endVerse
    ) {
      return h.color
    }
  }
  return null
}

function getHighlightCoveringRange(
  highlights: Highlight[],
  bookId: string,
  chapter: number,
  startVerse: number,
  endVerse: number,
): Highlight | null {
  return (
    highlights.find(
      (h) =>
        h.bookId === bookId &&
        h.chapter === chapter &&
        h.startVerse <= startVerse &&
        h.endVerse >= endVerse,
    ) ?? null
  )
}

function getOverlappingHighlights(
  highlights: Highlight[],
  bookId: string,
  chapter: number,
  startVerse: number,
  endVerse: number,
): Highlight[] {
  return highlights.filter(
    (h) =>
      h.bookId === bookId &&
      h.chapter === chapter &&
      !(endVerse < h.startVerse || startVerse > h.endVerse),
  )
}

function getNoteForVerseRange(
  notes: Note[],
  bookId: string,
  chapter: number,
  startVerse: number,
  endVerse: number,
): Note | null {
  return (
    notes.find(
      (n) =>
        n.bookId === bookId &&
        n.chapter === chapter &&
        n.startVerse === startVerse &&
        n.endVerse === endVerse,
    ) ?? null
  )
}

function verseHasNote(
  notes: Note[],
  bookId: string,
  chapter: number,
  verseNumber: number,
): boolean {
  return notes.some(
    (n) =>
      n.bookId === bookId &&
      n.chapter === chapter &&
      verseNumber === n.startVerse,
  )
}

interface ChapterReaderInnerProps {
  bookId: string
  chapterNum: number
}

function ChapterReaderInner({ bookId, chapterNum }: ChapterReaderInnerProps) {
  const setBook = useBibleStore((s) => s.setBook)
  const setChapter = useBibleStore((s) => s.setChapter)
  const comparisonMode = useBibleStore((s) => s.comparisonMode)
  const comparisonTranslations = useBibleStore((s) => s.comparisonTranslations)
  const activeTranslation = useBibleStore((s) => s.activeTranslation)
  const setComparisonTranslations = useBibleStore(
    (s) => s.setComparisonTranslations,
  )
  const toggleComparisonMode = useBibleStore((s) => s.toggleComparisonMode)
  const markChapterAsRead = useProgressStore((s) => s.markChapterAsRead)
  const highlights = useStudyStore((s) => s.highlights)
  const notes = useStudyStore((s) => s.notes)
  const addHighlight = useStudyStore((s) => s.addHighlight)
  const removeHighlight = useStudyStore((s) => s.removeHighlight)
  const editHighlightColor = useStudyStore((s) => s.editHighlightColor)
  const addNote = useStudyStore((s) => s.addNote)
  const updateNote = useStudyStore((s) => s.updateNote)
  const deleteNote = useStudyStore((s) => s.deleteNote)

  const chapterHighlights = useMemo(
    () =>
      highlights.filter(
        (h) => h.bookId === bookId && h.chapter === chapterNum,
      ),
    [highlights, bookId, chapterNum],
  )

  const chapterNotes = useMemo(
    () =>
      notes.filter((n) => n.bookId === bookId && n.chapter === chapterNum),
    [notes, bookId, chapterNum],
  )

  const verses: Verse[] = useMemo(
    () => getChapterSync(bookId, chapterNum),
    [bookId, chapterNum],
  )

  const bookName = useMemo(() => {
    const meta = getBook(bookId)
    return (
      meta?.name ??
      bookId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    )
  }, [bookId])

  const [selectedAnchor, setSelectedAnchor] = useState<number | null>(null)
  const [selectionRange, setSelectionRange] = useState<{
    start: number
    end: number
  } | null>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setBook(bookId)
    setChapter(chapterNum)
  }, [bookId, chapterNum, setBook, setChapter])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    let userHasScrolled = false
    const container =
      sentinel.closest('[data-testid="main-content"]') ?? window
    const onScroll = () => {
      userHasScrolled = true
    }
    container.addEventListener('scroll', onScroll, { passive: true })

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && userHasScrolled) {
          markChapterAsRead(bookId, chapterNum)
        }
      },
      { threshold: 0.8 },
    )
    observer.observe(sentinel)
    return () => {
      observer.disconnect()
      container.removeEventListener('scroll', onScroll)
    }
  }, [bookId, chapterNum, markChapterAsRead])

  const clearSelection = useCallback(() => {
    setSelectedAnchor(null)
    setSelectionRange(null)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        clearSelection()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [clearSelection])

  const handleVerseSelect = useCallback(
    (verseNumber: number, shiftKey: boolean) => {
      if (shiftKey && selectedAnchor !== null) {
        setSelectionRange({
          start: Math.min(selectedAnchor, verseNumber),
          end: Math.max(selectedAnchor, verseNumber),
        })
      } else {
        setSelectedAnchor(verseNumber)
        setSelectionRange({ start: verseNumber, end: verseNumber })
      }
    },
    [selectedAnchor],
  )

  const handleToggleComparison = useCallback(() => {
    if (!comparisonMode && comparisonTranslations.length < 2) {
      const others = translations.filter((t) => t.id !== activeTranslation)
      setComparisonTranslations([
        activeTranslation,
        others[0]?.id ?? 'ara',
      ] as TranslationId[])
    }
    toggleComparisonMode()
  }, [
    comparisonMode,
    comparisonTranslations,
    activeTranslation,
    setComparisonTranslations,
    toggleComparisonMode,
  ])

  const currentHighlight = useMemo(() => {
    if (!selectionRange) return null
    return getHighlightCoveringRange(
      chapterHighlights,
      bookId,
      chapterNum,
      selectionRange.start,
      selectionRange.end,
    )
  }, [selectionRange, chapterHighlights, bookId, chapterNum])

  const currentHighlightColor = currentHighlight?.color ?? null

  const handleHighlightColorSelect = useCallback(
    (color: HighlightColor) => {
      if (!selectionRange) return

      if (currentHighlight) {
        editHighlightColor(currentHighlight.id, color)
      } else {
        const overlapping = getOverlappingHighlights(
          chapterHighlights,
          bookId,
          chapterNum,
          selectionRange.start,
          selectionRange.end,
        )
        overlapping.forEach((h) => removeHighlight(h.id))
        addHighlight({
          bookId,
          chapter: chapterNum,
          startVerse: selectionRange.start,
          endVerse: selectionRange.end,
          color,
        })
      }

      clearSelection()
    },
    [
      selectionRange,
      currentHighlight,
      chapterHighlights,
      bookId,
      chapterNum,
      editHighlightColor,
      addHighlight,
      removeHighlight,
      clearSelection,
    ],
  )

  const handleHighlightRemove = useCallback(() => {
    if (!selectionRange) return

    if (currentHighlight) {
      removeHighlight(currentHighlight.id)
    }

    clearSelection()
  }, [selectionRange, currentHighlight, removeHighlight, clearSelection])

  const currentNote = useMemo(() => {
    if (!selectionRange) return null
    return getNoteForVerseRange(
      chapterNotes,
      bookId,
      chapterNum,
      selectionRange.start,
      selectionRange.end,
    )
  }, [selectionRange, chapterNotes, bookId, chapterNum])

  const handleNoteSave = useCallback(
    (text: string) => {
      if (!selectionRange) return

      if (currentNote) {
        updateNote(currentNote.id, text)
      } else {
        addNote({
          bookId,
          chapter: chapterNum,
          startVerse: selectionRange.start,
          endVerse: selectionRange.end,
          text,
        })
      }

      clearSelection()
    },
    [
      selectionRange,
      currentNote,
      bookId,
      chapterNum,
      updateNote,
      addNote,
      clearSelection,
    ],
  )

  const handleNoteDelete = useCallback(() => {
    if (!currentNote) return
    deleteNote(currentNote.id)
    clearSelection()
  }, [currentNote, deleteNote, clearSelection])

  const isVerseSelected = useCallback(
    (num: number) => {
      if (!selectionRange) return false
      return num >= selectionRange.start && num <= selectionRange.end
    },
    [selectionRange],
  )

  const getVerseHighlightColor = useCallback(
    (num: number) =>
      getHighlightForVerse(chapterHighlights, bookId, chapterNum, num),
    [chapterHighlights, bookId, chapterNum],
  )

  const getVerseHasNote = useCallback(
    (num: number) => verseHasNote(chapterNotes, bookId, chapterNum, num),
    [chapterNotes, bookId, chapterNum],
  )

  if (verses.length === 0) {
    return (
      <div data-testid="chapter-reader-empty" className="py-12 text-center">
        <p className="font-ui text-[var(--color-text-muted)]">
          Capítulo não encontrado.
        </p>
      </div>
    )
  }

  return (
    <div data-testid="chapter-reader">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-book-title" data-testid="chapter-heading">
          {bookName} {chapterNum}
        </h1>
        <button
          data-testid="comparison-toggle"
          onClick={handleToggleComparison}
          className={`chip ${comparisonMode ? 'active' : ''}`}
          aria-label={
            comparisonMode
              ? 'Desativar modo comparação'
              : 'Ativar modo comparação'
          }
          aria-pressed={comparisonMode}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="mr-1"
          >
            <rect x="1" y="2" width="5" height="12" rx="1" />
            <rect x="10" y="2" width="5" height="12" rx="1" />
          </svg>
          Comparar
        </button>
      </div>

      {comparisonMode ? (
        <ComparisonView bookId={bookId} chapterNum={chapterNum} />
      ) : (
        <>
          {selectionRange && (
            <div className="mb-4 flex flex-col items-center gap-3">
              <div
                className="flex items-center justify-center"
                data-testid="highlight-action-bar"
              >
                <HighlightPicker
                  currentColor={currentHighlightColor}
                  onColorSelect={handleHighlightColorSelect}
                  onRemove={handleHighlightRemove}
                />
                <button
                  data-testid="note-toggle-btn"
                  onClick={() => {}}
                  className="btn-ghost ml-2 flex items-center gap-1"
                  aria-label="Adicionar nota"
                  type="button"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H9.5A3.5 3.5 0 0 0 6 5.5v6.357A3.5 3.5 0 0 0 9.5 15h3.5l1-1.5" />
                    <path d="M10 12.5V10h2" />
                    <path d="M10 10h2v2.5" />
                  </svg>
                  Nota
                </button>
              </div>
              <div data-testid="note-editor-container">
                <NoteEditor
                  initialText={currentNote?.text ?? ''}
                  onSave={handleNoteSave}
                  onCancel={clearSelection}
                  onDelete={currentNote ? handleNoteDelete : undefined}
                  isEditing={!!currentNote}
                />
              </div>
            </div>
          )}
          <div className="font-reading" data-testid="verses-container">
            {verses.map((verse) => (
              <VerseBlock
                key={verse.number}
                verse={verse}
                isSelected={isVerseSelected(verse.number)}
                highlightColor={getVerseHighlightColor(verse.number)}
                hasNote={getVerseHasNote(verse.number)}
                onSelect={handleVerseSelect}
              />
            ))}
          </div>
        </>
      )}
      <div ref={sentinelRef} className="h-1" data-testid="scroll-sentinel" />
    </div>
  )
}

export function ChapterReader() {
  const { bookId, chapter: chapterParam } = useParams<{
    bookId: string
    chapter: string
  }>()

  if (!bookId || !chapterParam) {
    return (
      <div data-testid="chapter-reader-empty" className="py-12 text-center">
        <p className="font-ui text-[var(--color-text-muted)]">
          Selecione um livro e capítulo para começar a leitura.
        </p>
      </div>
    )
  }

  const chapterNum = Number(chapterParam)
  if (isNaN(chapterNum)) {
    return (
      <div data-testid="chapter-reader-empty" className="py-12 text-center">
        <p className="font-ui text-[var(--color-text-muted)]">
          Capítulo inválido.
        </p>
      </div>
    )
  }

  return (
    <ChapterReaderInner
      key={`${bookId}:${chapterNum}`}
      bookId={bookId}
      chapterNum={chapterNum}
    />
  )
}
