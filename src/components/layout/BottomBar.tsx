import { useNavigate } from 'react-router'
import { useSidebar } from './SidebarContext'

export function BottomBar() {
  const navigate = useNavigate()
  const { toggle } = useSidebar()
  return (
    <nav
      className="sticky bottom-0 z-50 border-t border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur-[12px] lg:hidden"
      data-testid="bottom-bar"
    >
      <div className="flex items-center justify-around h-14 px-4">
        <button
          onClick={toggle}
          className="btn-ghost flex flex-col items-center gap-0.5"
          aria-label="Livros"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h4a2 2 0 012 2v10a1.5 1.5 0 00-1.5-1.5H4V4z" />
            <path d="M16 4h-4a2 2 0 00-2 2v10a1.5 1.5 0 011.5-1.5H16V4z" />
          </svg>
          <span className="text-[10px] font-ui text-[var(--color-text-muted)]">Livros</span>
        </button>
        <button
          onClick={() => navigate('/search')}
          className="btn-ghost flex flex-col items-center gap-0.5"
          aria-label="Buscar"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="8.5" cy="8.5" r="5" />
            <line x1="12.5" y1="12.5" x2="17" y2="17" />
          </svg>
          <span className="text-[10px] font-ui text-[var(--color-text-muted)]">Buscar</span>
        </button>
        <button
          onClick={() => navigate('/progress')}
          className="btn-ghost flex flex-col items-center gap-0.5"
          aria-label="Progresso"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 16l4-4 4 4 6-6" />
            <path d="M17 10v4h-4" />
          </svg>
          <span className="text-[10px] font-ui text-[var(--color-text-muted)]">Progresso</span>
        </button>
      </div>
    </nav>
  )
}
