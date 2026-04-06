import { useProgressStore } from '@/stores'
import { testamentGroups, getTotalChapters } from '@/data/books'
import type { BookMeta } from '@/types'

type ReadStatus = 'none' | 'partial' | 'full'

function getReadStatus(read: number, total: number): ReadStatus {
  if (read === 0) return 'none'
  if (read === total) return 'full'
  return 'partial'
}

interface BookProgressItemProps {
  book: BookMeta
}

function BookProgressItem({ book }: BookProgressItemProps) {
  const getProgress = useProgressStore((s) => s.getBookProgress)
  const progress = getProgress(book.id)
  const status = getReadStatus(progress.read, progress.total)

  const statusClasses: Record<ReadStatus, string> = {
    none: 'opacity-50',
    partial: 'opacity-100',
    full: 'bg-[var(--color-surface)]',
  }

  return (
    <div
      data-testid="book-progress-item"
      data-book-id={book.id}
      data-status={status}
      className={`flex items-center justify-between rounded-lg p-2 ${statusClasses[status]}`}
    >
      <div className="flex items-center gap-2">
        <span className="font-ui text-sm text-[var(--color-text)]">
          {book.name}
        </span>
        <span className="font-footnote text-[var(--color-text-muted)]">
          {book.abbrev}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-12 overflow-hidden rounded-full bg-[var(--color-bg)]">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              status === 'full' ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-accent)]/60'
            }`}
            style={{ width: `${(progress.read / progress.total) * 100}%` }}
          />
        </div>
        <span
          data-testid="book-progress-fraction"
          className={`font-ui text-xs ${
            status === 'none'
              ? 'text-[var(--color-text-muted)]'
              : status === 'full'
                ? 'text-[var(--color-accent)]'
                : 'text-[var(--color-text-secondary)]'
          }`}
        >
          {progress.read}/{progress.total}
        </span>
      </div>
    </div>
  )
}

export function ProgressPanel() {
  const readChapters = useProgressStore((s) => s.readChapters)
  const totalRead = readChapters.size
  const totalChapters = getTotalChapters()

  const percentage = totalChapters > 0
    ? ((totalRead / totalChapters) * 100).toFixed(1)
    : '0.0'

  return (
    <div data-testid="progress-panel" className="flex flex-col gap-4">
      <div
        data-testid="progress-panel-header"
        className="flex flex-col gap-2 rounded-lg bg-[var(--color-surface)] p-4"
      >
        <h2
          data-testid="progress-panel-title"
          className="font-ui text-lg font-semibold text-[var(--color-text)]"
        >
          Progresso de Leitura
        </h2>
        <p className="font-footnote text-[var(--color-text-muted)]">
          {totalRead} de {totalChapters} capítulos lidos ({percentage}%)
        </p>
      </div>

      {testamentGroups.map((group) => (
        <div key={group.testament} data-testid="progress-group" data-testament={group.testament}>
          <h3
            data-testid="progress-group-label"
            className="mb-2 font-ui text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]"
          >
            {group.label}
          </h3>
          <div
            data-testid="progress-group-list"
            className="flex flex-col gap-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-2"
          >
            {group.books.map((book) => (
              <BookProgressItem key={book.id} book={book} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
