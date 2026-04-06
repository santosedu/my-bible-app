import { useMemo } from 'react'
import { useNavigate } from 'react-router'
import { useStudyStore } from '@/stores'
import { getBook } from '@/data/bibleData'
import type { Bookmark } from '@/types'

function formatTimestamp(createdAt: number): string {
  const date = new Date(createdAt)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function formatBookmarkReference(book: Bookmark): string {
  let ref = `${book.chapter}`
  if (book.verse !== null) {
    ref += `:${book.verse}`
  }
  if (book.label) {
    ref += ` — ${book.label}`
  }
  return ref
}

interface BookmarkCardProps {
  bookmark: Bookmark
  onRemove: (id: string) => void
}

function BookmarkCard({ bookmark, onRemove }: BookmarkCardProps) {
  const navigate = useNavigate()
  const bookMeta = getBook(bookmark.bookId)
  const bookName = bookMeta?.name ?? bookmark.bookId.replace(/-/g, ' ')

  const handleNavigate = () => {
    navigate(`/${bookmark.bookId}/${bookmark.chapter}`)
  }

  return (
    <div
      data-testid="bookmark-card"
      data-bookmark-id={bookmark.id}
      className="relative rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3"
    >
      <div className="absolute right-0 top-0">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="var(--color-bookmark)"
          className="opacity-60"
        >
          <path d="M0 0h24v24L12 18 0 24V0z" />
        </svg>
      </div>
      <div className="mb-2 flex items-center justify-between pr-4">
        <button
          data-testid="bookmark-card-reference"
          onClick={handleNavigate}
          className="font-ui text-xs text-[var(--color-accent)] hover:underline"
          type="button"
        >
          {bookName} {formatBookmarkReference(bookmark)}
        </button>
        <span className="font-footnote text-[var(--color-text-muted)]">
          {formatTimestamp(bookmark.createdAt)}
        </span>
      </div>
      {bookmark.label && (
        <p className="font-footnote text-[var(--color-text-secondary)]">
          {bookmark.label}
        </p>
      )}
      <div className="mt-2">
        <button
          data-testid="bookmark-card-remove"
          onClick={() => onRemove(bookmark.id)}
          className="btn-ghost text-[var(--color-text-muted)]"
          type="button"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <path d="M2 4h12M5.333 4V2.667a1.333 1.333 0 0 1 1.334-1.334h2.666a1.333 1.333 0 0 1 1.334 1.334V4m2 0v9.333a1.333 1.333 0 0 1-1.334 1.334H4.667a1.333 1.333 0 0 1-1.334-1.334V4h9.334z" />
          </svg>
          Remover
        </button>
      </div>
    </div>
  )
}

export function BookmarksPanel() {
  const bookmarks = useStudyStore((s) => s.bookmarks)
  const removeBookmark = useStudyStore((s) => s.removeBookmark)

  const sortedBookmarks = useMemo(
    () =>
      [...bookmarks].sort((a, b) => b.createdAt - a.createdAt),
    [bookmarks],
  )

  if (bookmarks.length === 0) {
    return (
      <div data-testid="bookmarks-panel-empty" className="py-8 text-center">
        <p className="font-ui text-sm text-[var(--color-text-muted)]">
          Nenhum marcador ainda.
        </p>
        <p className="font-footnote mt-1 text-[var(--color-text-muted)]">
          Adicione marcadores aos seus versículos favoritos.
        </p>
      </div>
    )
  }

  return (
    <div data-testid="bookmarks-panel" className="flex flex-col gap-3">
      <div className="mb-1 flex items-center justify-between">
        <h2
          data-testid="bookmarks-panel-title"
          className="font-ui text-sm font-semibold text-[var(--color-text)]"
        >
          Meus Marcadores
        </h2>
        <span
          data-testid="bookmarks-panel-count"
          className="font-footnote text-[var(--color-text-muted)]"
        >
          {bookmarks.length} {bookmarks.length === 1 ? 'marcador' : 'marcadores'}
        </span>
      </div>
      {sortedBookmarks.map((bookmark) => (
        <BookmarkCard
          key={bookmark.id}
          bookmark={bookmark}
          onRemove={removeBookmark}
        />
      ))}
    </div>
  )
}