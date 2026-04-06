import { useNavigate } from 'react-router'
import { useProgressStore } from '@/stores'

interface ChapterGridProps {
  bookId: string
  totalChapters: number
}

export function ChapterGrid({ bookId, totalChapters }: ChapterGridProps) {
  const navigate = useNavigate()
  const isChapterRead = useProgressStore((s) => s.isChapterRead)

  const chapters = Array.from({ length: totalChapters }, (_, i) => i + 1)

  function handleChapterClick(chapter: number) {
    navigate(`/${bookId}/${chapter}`)
  }

  return (
    <div
      className="grid grid-cols-5 gap-3 sm:grid-cols-7 md:grid-cols-8 lg:grid-cols-10"
      role="grid"
      aria-label="Seleção de capítulo"
      data-testid="chapter-grid"
    >
      {chapters.map((chapter) => {
        const read = isChapterRead(bookId, chapter)
        return (
          <button
            key={chapter}
            onClick={() => handleChapterClick(chapter)}
            className={`chip relative ${read ? 'active' : ''}`}
            role="gridcell"
            aria-label={`Capítulo ${chapter}${read ? ', já lido' : ''}`}
            data-testid={`chapter-btn-${chapter}`}
          >
            {chapter}
            {read && (
              <span
                className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-green-500"
                aria-hidden="true"
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
