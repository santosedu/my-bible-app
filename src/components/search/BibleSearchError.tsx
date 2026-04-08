import type { BibleQueryError } from '@/types'

export interface BibleSearchErrorProps {
  error: BibleQueryError
}

export function BibleSearchError({ error }: BibleSearchErrorProps) {
  return (
    <div
      className="card border-[var(--color-warning)]"
      data-testid="bible-search-error"
      role="alert"
    >
      <div className="flex items-start gap-3">
        <svg
          className="h-5 w-5 flex-shrink-0 text-[var(--color-warning)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <p className="font-ui text-sm text-[var(--color-text-secondary)]">{error.message}</p>
      </div>
    </div>
  )
}