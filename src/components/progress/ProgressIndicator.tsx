import { getBookMeta } from '@/data/books'
import { useProgressStore } from '@/stores'
import type { BookMeta } from '@/types'

export type { BookMeta }

export type ReadStatus = 'none' | 'partial' | 'full'

function getReadStatus(read: number, total: number): ReadStatus {
  if (read === 0) return 'none'
  if (read === total) return 'full'
  return 'partial'
}

interface ProgressIndicatorProps {
  bookId: string
  showLabel?: boolean
}

export function ProgressIndicator({ bookId, showLabel = true }: ProgressIndicatorProps) {
  const bookMeta = getBookMeta(bookId)
  const getProgress = useProgressStore((s) => s.getBookProgress)
  const progress = getProgress(bookId)
  const status = getReadStatus(progress.read, progress.total)

  const statusClasses: Record<ReadStatus, string> = {
    none: 'text-[var(--color-text-muted)]',
    partial: 'text-[var(--color-accent)]',
    full: 'text-[var(--color-accent)]',
  }

  return (
    <div
      data-testid="progress-indicator"
      data-book-id={bookId}
      data-read={progress.read}
      data-total={progress.total}
      className="flex items-center gap-2"
    >
      {showLabel && bookMeta && (
        <span className="font-ui text-xs text-[var(--color-text-secondary)]">
          {bookMeta.name}
        </span>
      )}
      <div className="flex items-center gap-1.5">
        <div
          data-testid="progress-bar"
          className="h-1.5 w-16 overflow-hidden rounded-full bg-[var(--color-surface)]"
        >
          <div
            data-testid="progress-fill"
            className={`h-full rounded-full transition-all duration-300 ${
              status === 'full' ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-accent)]/60'
            }`}
            style={{ width: `${(progress.read / progress.total) * 100}%` }}
          />
        </div>
        <span
          data-testid="progress-fraction"
          className={`font-ui text-xs ${statusClasses[status]}`}
        >
          {progress.read}/{progress.total}
        </span>
      </div>
    </div>
  )
}
