import { useBibleStore } from '@/stores'
import { testamentGroups } from '@/data/books'
import { TestamentGroup } from './TestamentGroup'

export function BookList() {
  const bookId = useBibleStore((s) => s.bookId)

  return (
    <nav aria-label="Navegação de livros" data-testid="book-list">
      {testamentGroups.map((group) => (
        <TestamentGroup
          key={group.testament}
          label={group.label}
          books={group.books}
          activeBookId={bookId}
        />
      ))}
    </nav>
  )
}
