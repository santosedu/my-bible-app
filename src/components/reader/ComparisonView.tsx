import { useMemo, useEffect, useRef, useCallback, useState } from 'react'
import { getChapter } from '@/data/bibleData'
import { useBibleStore, useStudyStore } from '@/stores'
import { useIsMobile } from '@/hooks/useIsMobile'
import { TranslationSelector } from './TranslationSelector'
import { VerseBlock } from './VerseBlock'
import type { Verse, TranslationId, Highlight, HighlightColor } from '@/types'
import { translations } from '@/data/translations'

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

interface ComparisonViewProps {
  bookId: string
  chapterNum: number
}

interface ColumnData {
  translationId: TranslationId
  shortName: string
  verses: Verse[]
  loading: boolean
}

export function ComparisonView({ bookId, chapterNum }: ComparisonViewProps) {
  const comparisonTranslations = useBibleStore((s) => s.comparisonTranslations)
  const setComparisonTranslations = useBibleStore((s) => s.setComparisonTranslations)
  const activeTranslation = useBibleStore((s) => s.activeTranslation)
  const isMobile = useIsMobile()

  const highlights = useStudyStore((s) => s.highlights)
  const chapterHighlights = useMemo(
    () =>
      highlights.filter(
        (h) => h.bookId === bookId && h.chapter === chapterNum,
      ),
    [highlights, bookId, chapterNum],
  )

  const getVerseHighlightColor = useCallback(
    (num: number) =>
      getHighlightForVerse(chapterHighlights, bookId, chapterNum, num),
    [chapterHighlights, bookId, chapterNum],
  )

  const translationIds = useMemo((): TranslationId[] => {
    if (comparisonTranslations.length >= 2) return comparisonTranslations
    const others = translations.filter((t) => t.id !== activeTranslation)
    return [activeTranslation, others[0]?.id ?? 'ara']
  }, [comparisonTranslations, activeTranslation])

  const [verseData, setVerseData] = useState<Record<string, Verse[]>>({})

  useEffect(() => {
    translationIds.forEach(async (id) => {
      const verses = await getChapter(bookId, chapterNum, id)
      setVerseData((prev) => ({ ...prev, [id]: verses }))
    })
  }, [bookId, chapterNum, translationIds])

  const columns = useMemo((): ColumnData[] =>
    translationIds.map((id) => ({
      translationId: id,
      shortName:
        translations.find((t) => t.id === id)?.shortName ?? id.toUpperCase(),
      verses: verseData[id] ?? [],
      loading: !verseData[id],
    })),
    [translationIds, verseData],
  )

  const [mobileIndex, setMobileIndex] = useState(0)
  const scrollRefs = useRef<(HTMLDivElement | null)[]>([])
  const isScrolling = useRef(false)

  const handleScroll = useCallback((index: number) => {
    if (isScrolling.current) return
    isScrolling.current = true

    const source = scrollRefs.current[index]
    if (!source) {
      isScrolling.current = false
      return
    }

    const maxScroll = source.scrollHeight - source.clientHeight
    const ratio = maxScroll > 0 ? source.scrollTop / maxScroll : 0

    scrollRefs.current.forEach((ref, i) => {
      if (i === index || !ref) return
      const targetMax = ref.scrollHeight - ref.clientHeight
      ref.scrollTop = ratio * targetMax
    })

    requestAnimationFrame(() => {
      isScrolling.current = false
    })
  }, [])

  if (columns.length === 0) return null

  return (
    <div data-testid="comparison-view">
      <TranslationSelector
        selectedTranslations={columns.map((c) => c.translationId)}
        onSelectionChange={(ids) => {
          if (ids.length < 2) return
          setComparisonTranslations(ids)
          setMobileIndex(0)
        }}
      />

      {isMobile ? (
        <div data-testid="comparison-mobile">
          <div className="mt-3 flex gap-1">
            {columns.map((col, i) => (
              <button
                key={col.translationId}
                data-testid={`mobile-switch-${col.translationId}`}
                onClick={() => setMobileIndex(i)}
                className={`chip ${i === mobileIndex ? 'active' : ''}`}
              >
                {col.shortName}
              </button>
            ))}
          </div>
          <div className="mt-4 font-reading" data-testid="verses-container">
            {columns[mobileIndex]?.loading ? (
              <p className="text-[var(--color-text-muted)]">Carregando...</p>
            ) : (
              columns[mobileIndex]?.verses.map((verse) => (
                <VerseBlock
                  key={verse.number}
                  verse={verse}
                  isSelected={false}
                  highlightColor={getVerseHighlightColor(verse.number)}
                  onSelect={() => {}}
                />
              ))
            )}
          </div>
        </div>
      ) : (
        <div
          data-testid="comparison-desktop"
          className={`mt-4 grid gap-6 ${
            columns.length === 3 ? 'grid-cols-3' : 'grid-cols-2'
          }`}
        >
          {columns.map((col, i) => (
            <div
              key={col.translationId}
              data-testid={`comparison-column-${col.translationId}`}
            >
              <div className="font-ui text-xs text-[var(--color-text-muted)] mb-2 uppercase tracking-wider">
                {col.shortName}
              </div>
              <div
                ref={(el) => {
                  scrollRefs.current[i] = el
                }}
                onScroll={() => handleScroll(i)}
                className="font-reading overflow-y-auto max-h-[60vh] pr-2"
                data-testid={`verses-container-${col.translationId}`}
              >
                {col.loading ? (
                  <p className="text-[var(--color-text-muted)]">
                    Carregando...
                  </p>
                ) : (
                  col.verses.map((verse) => (
                    <VerseBlock
                      key={verse.number}
                      verse={verse}
                      isSelected={false}
                      highlightColor={getVerseHighlightColor(verse.number)}
                      onSelect={() => {}}
                    />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
