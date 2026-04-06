import { useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { SearchInput } from './SearchInput'
import { SearchResults } from './SearchResults'
import { getSearchResults } from '@/data/bibleData'

export function SearchPage() {
  const [searchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || ''

  const results = useMemo(() => {
    if (!initialQuery.trim()) return []
    return getSearchResults(initialQuery)
  }, [initialQuery])

  return (
    <div className="space-y-4" data-testid="search-page">
      <h1 className="font-book-title text-xl text-[var(--color-text)]">Buscar</h1>
      <SearchInput onSearch={() => {}} initialQuery={initialQuery} />
      <SearchResults results={results} query={initialQuery} />
    </div>
  )
}
