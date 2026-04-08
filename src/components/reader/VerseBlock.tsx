import { memo } from 'react'
import type { Verse, HighlightColor } from '@/types'
import { CrossReferenceIndicator } from '@/components/study/CrossReferenceIndicator'

interface VerseBlockProps {
  verse: Verse
  isSelected: boolean
  highlightColor?: HighlightColor | null
  hasNote?: boolean
  hasCrossReferences?: boolean
  isTargetVerse?: boolean
  onSelect: (verseNumber: number, shiftKey: boolean) => void
  onCrossReferenceClick?: () => void
}

export const VerseBlock = memo(function VerseBlock({
  verse,
  isSelected,
  highlightColor,
  hasNote,
  hasCrossReferences,
  isTargetVerse,
  onSelect,
  onCrossReferenceClick,
}: VerseBlockProps) {
  const bgClass = highlightColor
    ? `bg-[var(--color-highlight-${highlightColor})]`
    : (isSelected ? 'bg-[var(--color-surface-raised)]' : '')

  const ringClass = isSelected
    ? 'ring-2 ring-inset ring-[var(--color-accent)]/50'
    : ''

  const targetClass = isTargetVerse ? 'verse-target-highlight' : ''

  return (
    <span
      data-testid={`verse-${verse.number}`}
      data-verse-number={verse.number}
      onClick={(e) => onSelect(verse.number, e.shiftKey)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(verse.number, false)
        }
      }}
      aria-label={`Versículo ${verse.number}`}
      aria-selected={isSelected}
      className={[
        'inline cursor-pointer rounded-sm transition-colors duration-150',
        'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--color-accent)]',
        bgClass,
        ringClass,
        targetClass,
      ].filter(Boolean).join(' ')}
    >
      <sup className="font-verse-number mr-0.5 select-none">{verse.number}</sup>
      {verse.text}{' '}
      {hasNote && (
        <span
          data-testid="note-indicator"
          className="note-indicator inline-flex align-middle"
          aria-label="Nota anexada"
          title="Nota anexada"
        >
          <svg
            width="14"
            height="14"
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
        </span>
      )}
      <CrossReferenceIndicator
        onClick={onCrossReferenceClick ?? (() => {})}
        hasCrossReferences={hasCrossReferences ?? false}
      />
    </span>
  )
})
