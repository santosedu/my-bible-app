import { useNavigate } from 'react-router'
import type { SearchResult } from '@/types'

interface SearchResultsProps {
  results: SearchResult[]
  query: string
}

function highlightText(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text

  const normalizedQuery = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

  const queryWords = normalizedQuery.split(/\s+/).filter((w) => w.length >= 2)
  if (queryWords.length === 0) return text

  const regex = new RegExp(`(${queryWords.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi')
  const parts = text.split(regex)

  return parts.map((part, i) => {
    const isMatch = queryWords.some((w) => part.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(w))
    if (isMatch) {
      return <mark key={i} className="bg-[var(--color-highlight-yellow)] font-semibold">{part}</mark>
    }
    return part
  })
}

function groupByBook(results: SearchResult[]): Map<string, SearchResult[]> {
  const groups = new Map<string, SearchResult[]>()
  for (const result of results) {
    const existing = groups.get(result.bookId) || []
    existing.push(result)
    groups.set(result.bookId, existing)
  }
  return groups
}

export function SearchResults({ results, query }: SearchResultsProps) {
  const navigate = useNavigate()
  const groupedResults = groupByBook(results)

  const handleResultClick = (bookId: string, chapter: number) => {
    navigate(`/${bookId}/${chapter}`)
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center" data-testid="no-results">
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="text-[var(--color-text-muted)] mb-4"
        >
          <circle cx="20" cy="20" r="12" />
          <line x1="28" y1="28" x2="40" y2="40" />
        </svg>
        <p className="text-[var(--color-text-secondary)] font-ui">
          Nenhum resultado encontrado
        </p>
        <p className="text-[var(--color-text-muted)] text-sm mt-1">
          Tente buscar por outras palavras
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6" data-testid="search-results">
      {Array.from(groupedResults.entries()).map(([bookId, bookResults]) => {
        const bookName = bookResults[0].bookName
        return (
          <div key={bookId} className="border-b border-[var(--color-border)] pb-4 last:border-0">
            <h2 className="font-book-title text-lg text-[var(--color-text)] mb-3">
              {bookName}
            </h2>
            <div className="space-y-3">
              {bookResults.map((result) => (
                <button
                  key={`${result.bookId}-${result.chapter}-${result.verse}`}
                  onClick={() => handleResultClick(result.bookId, result.chapter)}
                  className="w-full text-left p-3 bg-[var(--color-surface)] rounded-lg hover:bg-[var(--color-surface-raised)] transition-colors"
                >
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-ui text-sm font-semibold text-[var(--color-accent)]">
                      {result.chapter}:{result.verse}
                    </span>
                  </div>
                  <p className="font-reading text-[var(--color-text)] leading-relaxed">
                    {highlightText(result.text, query)}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
