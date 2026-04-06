import { useBibleStore } from '@/stores'
import { useSidebar } from './SidebarContext'
import { useNavigate } from 'react-router'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

export function Header() {
  const { bookId, chapter } = useBibleStore()
  const { toggle } = useSidebar()
  const navigate = useNavigate()

  const bookName = bookId
    ? useBibleStore.getState().bookId
    : null

  return (
    <header
      className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur-[12px]"
      data-testid="header"
    >
      <div className="flex items-center justify-between px-4 h-14 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className="btn-ghost lg:hidden"
            aria-label="Abrir menu de livros"
            data-testid="hamburger-btn"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <line x1="3" y1="5" x2="17" y2="5" />
              <line x1="3" y1="10" x2="17" y2="10" />
              <line x1="3" y1="15" x2="17" y2="15" />
            </svg>
          </button>
          <div className="font-ui text-sm font-semibold text-[var(--color-text)]">
            {bookName ? (
              <span data-testid="header-location">
                {bookId && (
                  <span className="capitalize">{bookId.replace(/-/g, ' ')}</span>
                )}
                {chapter && (
                  <span className="text-[var(--color-text-muted)] ml-1">
                    {chapter}
                  </span>
                )}
              </span>
            ) : (
              <span>Minha Bíblia</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => navigate('/search')}
            className="btn-ghost hidden lg:flex"
            aria-label="Buscar"
            data-testid="search-btn"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <circle cx="8.5" cy="8.5" r="5" />
              <line x1="12.5" y1="12.5" x2="17" y2="17" />
            </svg>
          </button>
          <span className="text-xs text-[var(--color-text-muted)] hidden sm:inline">
            ARA
          </span>
        </div>
      </div>
    </header>
  )
}
