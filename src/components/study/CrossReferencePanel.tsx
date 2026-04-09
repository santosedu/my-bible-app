import { useEffect, useCallback, useRef } from 'react'
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

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  return Array.from(container.querySelectorAll<HTMLElement>(selector))
}

export function CrossReferencePanel({ references, isOpen, onClose }: CrossReferencePanelProps) {
  const navigate = useNavigate()
  const panelRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  const handleNavigate = useCallback((bookId: string, chapter: number) => {
    navigate(`/${bookId}/${chapter}`)
    onClose()
  }, [navigate, onClose])

  useEffect(() => {
    if (!isOpen) return

    previousFocusRef.current = document.activeElement as HTMLElement

    const focusFirst = () => {
      if (panelRef.current) {
        const focusable = getFocusableElements(panelRef.current)
        if (focusable.length > 0) {
          focusable[0].focus()
        } else {
          panelRef.current.focus()
        }
      }
    }

    const timer = setTimeout(focusFirst, 0)

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }

      if (e.key === 'Tab' && panelRef.current) {
        const focusable = getFocusableElements(panelRef.current)
        if (focusable.length === 0) return

        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('keydown', handleKeyDown)
      previousFocusRef.current?.focus()
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={panelRef}
      data-testid="cross-reference-panel"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cross-reference-title"
      tabIndex={-1}
      className="flex flex-col outline-none"
    >
      <div className="mb-2 flex items-center justify-between">
        <h2
          id="cross-reference-title"
          data-testid="cross-reference-panel-title"
          className="font-ui text-sm font-semibold text-[var(--color-text)]"
        >
          Referências Cruzadas
        </h2>
        <div className="flex items-center gap-2">
          <span
            data-testid="cross-reference-panel-count"
            className="font-footnote text-[var(--color-text-muted)]"
          >
            {references.length} {references.length === 1 ? 'referência' : 'referências'}
          </span>
          <button
            data-testid="cross-reference-panel-close"
            onClick={onClose}
            className="btn-ghost"
            aria-label="Fechar referências cruzadas"
            type="button"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="4" y1="4" x2="12" y2="12" />
              <line x1="12" y1="4" x2="4" y2="12" />
            </svg>
          </button>
        </div>
      </div>

      {references.length === 0 ? (
        <div data-testid="cross-reference-panel-empty" className="py-6 text-center">
          <p className="font-ui text-sm text-[var(--color-text-muted)]">
            Nenhuma referência cruzada encontrada.
          </p>
          <p className="font-footnote mt-1 text-[var(--color-text-muted)]">
            Este versículo não possui referências cruzadas.
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
