import { useMemo, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router'
import { SearchInput } from './SearchInput'
import { SearchResults } from './SearchResults'
import { BibleSearchError } from './BibleSearchError'
import { getSearchResults } from '@/data/bibleData'
import { useBibleStore } from '@/stores'
import { parseBibleQuery } from '@/utils/parseBibleQuery'

export function SearchPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const initialQuery = searchParams.get('q') || ''
  const activeTranslation = useBibleStore((s) => s.activeTranslation)

  const parsedResult = useMemo(() => parseBibleQuery(initialQuery), [initialQuery])

  useEffect(() => {
    if (parsedResult?.type === 'chapter') {
      navigate(`/${parsedResult.bookId}/${parsedResult.chapter}`, { replace: true })
    }
  }, [parsedResult, navigate])

  const results = useMemo(() => {
    if (!initialQuery.trim()) return []
    if (parsedResult?.type === 'chapter' || parsedResult?.type === 'error') return []
    return getSearchResults(initialQuery, activeTranslation)
  }, [initialQuery, activeTranslation, parsedResult])

  const showError = parsedResult?.type === 'error'
  const showResults = parsedResult === null && initialQuery.trim().length > 0

  return (
    <div className="space-y-4" data-testid="search-page">
      <h1 className="font-book-title text-xl text-[var(--color-text)]">Buscar</h1>
      <SearchInput onSearch={() => {}} initialQuery={initialQuery} />
      {showError && <BibleSearchError error={parsedResult} />}
      {showResults && <SearchResults results={results} query={initialQuery} />}
    </div>
  )
}
