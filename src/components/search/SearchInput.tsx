import { useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router'

interface SearchInputProps {
  onSearch: (query: string) => void
  initialQuery?: string
}

export function SearchInput({ onSearch, initialQuery = '' }: SearchInputProps) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const urlQuery = searchParams.get('q') || ''
  const query = urlQuery || initialQuery

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    if (value.trim()) {
      navigate(`/search?q=${encodeURIComponent(value.trim())}`, { replace: true })
      onSearch(value.trim())
    } else {
      navigate('/search', { replace: true })
      onSearch('')
    }
  }, [navigate, onSearch])

  const handleClear = useCallback(() => {
    navigate('/search', { replace: true })
    onSearch('')
  }, [navigate, onSearch])

  return (
    <div className="relative" data-testid="search-input">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="text-[var(--color-text-muted)]"
        >
          <circle cx="8.5" cy="8.5" r="5" />
          <line x1="12.5" y1="12.5" x2="17" y2="17" />
        </svg>
      </div>
      <input
        type="text"
        defaultValue={query}
        onChange={handleChange}
        placeholder="Buscar na Bíblia..."
        className="w-full h-12 pl-12 pr-12 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg font-ui text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)]"
        aria-label="Buscar na Bíblia"
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
          aria-label="Limpar busca"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <line x1="3" y1="3" x2="13" y2="13" />
            <line x1="13" y1="3" x2="3" y2="13" />
          </svg>
        </button>
      )}
    </div>
  )
}
