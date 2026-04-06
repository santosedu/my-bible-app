import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useBibleStore } from '@/stores'
import { ChapterReader } from '@/components/reader/ChapterReader'
import { ChapterGrid } from '@/components/navigation/ChapterGrid'
import { ProgressPage as ProgressPageComponent } from '@/components/progress/ProgressPage'
import { getBookMeta } from '@/data/books'

export function RootRedirect() {
  const navigate = useNavigate()
  const bookId = useBibleStore((s) => s.bookId)
  const chapter = useBibleStore((s) => s.chapter)

  useEffect(() => {
    if (bookId && chapter) {
      navigate(`/${bookId}/${chapter}`, { replace: true })
    } else if (bookId) {
      navigate(`/${bookId}`, { replace: true })
    } else {
      navigate('/genesis', { replace: true })
    }
  }, [navigate, bookId, chapter])

  return null
}

export function ChapterSelectionPage() {
  const { bookId } = useParams<{ bookId: string }>()
  const book = bookId ? getBookMeta(bookId) : null

  if (!book) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-6">
        <p className="font-ui text-text-secondary">Livro não encontrado</p>
      </div>
    )
  }

  const testamentLabel = book.testament === 'old' ? 'Antigo Testamento' : 'Novo Testamento'

  return (
    <div className="px-6 py-8" data-testid="chapter-selection-page">
      <h1 className="font-book-title mb-1">{book.name}</h1>
      <p className="font-ui text-text-secondary mb-8">
        {testamentLabel} &middot; {book.chapters} capítulos
      </p>
      <ChapterGrid bookId={book.id} totalChapters={book.chapters} />
    </div>
  )
}

export function ChapterPage() {
  return <ChapterReader />
}

export function ProgressPage() {
  return <ProgressPageComponent />
}
