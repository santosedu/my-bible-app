import { memo } from 'react'

interface CrossReferenceIndicatorProps {
  onClick: () => void
  hasCrossReferences: boolean
}

export const CrossReferenceIndicator = memo(function CrossReferenceIndicator({
  onClick,
  hasCrossReferences,
}: CrossReferenceIndicatorProps) {
  if (!hasCrossReferences) return null

  return (
    <button
      data-testid="cross-reference-indicator"
      onClick={onClick}
      type="button"
      className="cross-ref-indicator ml-1 inline-flex cursor-pointer align-middle"
      aria-label="Ver referências cruzadas"
      title="Referências cruzadas"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 10h10a2 2 0 0 1 2 2v2" />
        <path d="M16 10h-10a2 2 0 0 0-2 2v2" />
        <path d="M7 5v4a2 2 0 0 0 2 2h4" />
        <path d="M13 15v-4a2 2 0 0 0-2-2h-4" />
      </svg>
    </button>
  )
})
