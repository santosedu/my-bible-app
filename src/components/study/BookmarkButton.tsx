import { memo, useCallback } from 'react'
import { useStudyStore } from '@/stores'

interface BookmarkButtonProps {
  bookId: string
  chapter: number
  verse?: number | null
  label?: string
  size?: 'sm' | 'md'
}

export const BookmarkButton = memo(function BookmarkButton({
  bookId,
  chapter,
  verse = null,
  label = '',
  size = 'md',
}: BookmarkButtonProps) {
  const bookmarks = useStudyStore((s) => s.bookmarks)
  const addBookmark = useStudyStore((s) => s.addBookmark)
  const removeBookmark = useStudyStore((s) => s.removeBookmark)

  const isBookmarked = bookmarks.some(
    (b) =>
      b.bookId === bookId &&
      b.chapter === chapter &&
      b.verse === verse &&
      b.label === label,
  )

  const handleClick = useCallback(() => {
    if (isBookmarked) {
      const existing = bookmarks.find(
        (b) =>
          b.bookId === bookId &&
          b.chapter === chapter &&
          b.verse === verse &&
          b.label === label,
      )
      if (existing) {
        removeBookmark(existing.id)
      }
    } else {
      addBookmark({ bookId, chapter, verse, label })
    }
  }, [
    isBookmarked,
    bookmarks,
    bookId,
    chapter,
    verse,
    label,
    addBookmark,
    removeBookmark,
  ])

  const iconSize = size === 'sm' ? 14 : 20

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`btn-ghost bookmark-toggle ${isBookmarked ? 'active' : ''}`}
      aria-label={isBookmarked ? 'Remover marcador' : 'Adicionar marcador'}
      aria-pressed={isBookmarked}
      data-testid="bookmark-button"
    >
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 20 20"
        fill="none"
        stroke={isBookmarked ? 'var(--color-bookmark)' : 'currentColor'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={isBookmarked ? 'text-[var(--color-bookmark)]' : ''}
      >
        <path d="M5 4h12a1 1 0 0 1 1 1v12l-7-3-7 3V5a1 1 0 0 1 1-1z" />
      </svg>
    </button>
  )
})