import type { BookMeta } from '@/types'
import { BookItem } from './BookItem'

interface TestamentGroupProps {
  label: string
  books: BookMeta[]
  activeBookId: string | null
}

export function TestamentGroup({ label, books, activeBookId }: TestamentGroupProps) {
  return (
    <div className="mb-4" data-testid={`testament-group-${label.toLowerCase().replace(/\s/g, '-')}`}>
      <h2 className="font-ui text-[var(--color-text-muted)] text-xs uppercase tracking-wider mb-2 px-1">
        {label}
      </h2>
      <div role="listbox" aria-label={label} className="flex flex-col gap-0.5">
        {books.map((book) => (
          <BookItem
            key={book.id}
            book={book}
            isActive={book.id === activeBookId}
          />
        ))}
      </div>
    </div>
  )
}
