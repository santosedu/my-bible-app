import { useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { getBook, getVerseSync } from '@/data/bibleData'
import type { BibleRef } from '@/types'

interface CrossReferencePanelProps {
  references: BibleRef[]
  isOpen: boolean
  onClose: () => void
}

interface CrossReferenceItemProps {
  reference: BibleRef
  onNavigate: (bookId: string, chapter: number) => void
}

function CrossReferenceItem({ reference, onNavigate }: CrossReferenceItemProps) {
  const bookMeta = getBook(reference.bookId)
  const bookName = bookMeta?.name ?? reference.bookId.replace(/-/g, ' ')
  const verseText = getVerseSync(reference.bookId, reference.chapter, reference.verse)

  return (
    <div
      data-testid="cross-reference-item"
      className="border-b border-[var(--color-border)] py-3 last:border-b-0"
    >
      <button
        data-testid="cross-reference-link"
        onClick={() => onNavigate(reference.bookId, reference.chapter)}
        type="button"
        className="font-footnote text-left text-[var(--color-accent)] hover:underline"
      >
        {bookName} {reference.chapter}:{reference.verse}
      </button>
      {verseText && (
        <p
          data-testid="cross-reference-text"
          className="mt-1 font-reading text-[var(--color-text-secondary)]"
        >
          {verseText}
        </p>
      )}
    </div>
  )
}

export function CrossReferencePanel({ references, isOpen, onClose }: CrossReferencePanelProps) {
  const navigate = useNavigate()

  const handleNavigate = useCallback((bookId: string, chapter: number) => {
    navigate(`/${bookId}/${chapter}`)
    onClose()
  }, [navigate, onClose])

  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      data-testid="cross-reference-panel"
      className="flex flex-col"
    >
      <div className="mb-2 flex items-center justify-between">
        <h2
          data-testid="cross-reference-panel-title"
          className="font-ui text-sm font-semibold text-[var(--color-text)]"
        >
          Referências Cruzadas
        </h2>
        <span
          data-testid="cross-reference-panel-count"
          className="font-footnote text-[var(--color-text-muted)]"
        >
          {references.length} {references.length === 1 ? 'referência' : 'referências'}
        </span>
      </div>

      {references.length === 0 ? (
        <div data-testid="cross-reference-panel-empty" className="py-6 text-center">
          <p className="font-ui text-sm text-[var(--color-text-muted)]">
            Nenhuma referência cruzada encontrada.
          </p>
          <p className="font-footnote mt-1 text-[var(--color-text-muted)]">
            Este versículo não possui referências linkedas.
          </p>
        </div>
      ) : (
        <div data-testid="cross-reference-list">
          {references.map((ref, index) => (
            <CrossReferenceItem
              key={`${ref.bookId}-${ref.chapter}-${ref.verse}-${index}`}
              reference={ref}
              onNavigate={handleNavigate}
            />
          ))}
        </div>
      )}
    </div>
  )
}
