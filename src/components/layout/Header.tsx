import { useBibleStore } from '@/stores'
import { useSidebar } from './SidebarContext'
import { useNavigate } from 'react-router'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { translations } from '@/data/translations'
import type { TranslationId } from '@/types'
import { useCallback, useRef } from 'react'

export function Header() {
  const bookId = useBibleStore((s) => s.bookId)
  const chapter = useBibleStore((s) => s.chapter)
  const activeTranslation = useBibleStore((s) => s.activeTranslation)
  const setActiveTranslation = useBibleStore((s) => s.setActiveTranslation)
  const { toggle } = useSidebar()
  const navigate = useNavigate()
  const selectorRef = useRef<HTMLDivElement>(null)

  const handleTranslationSelect = useCallback(
    (id: TranslationId) => {
      setActiveTranslation(id)
    },
    [setActiveTranslation],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, currentIndex: number) => {
      const chips = selectorRef.current?.querySelectorAll('button')
      if (!chips) return

      let nextIndex = currentIndex
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        nextIndex = (currentIndex + 1) % chips.length
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        nextIndex = (currentIndex - 1 + chips.length) % chips.length
      } else if (e.key === 'Home') {
        e.preventDefault()
        nextIndex = 0
      } else if (e.key === 'End') {
        e.preventDefault()
        nextIndex = chips.length - 1
      }

      if (nextIndex !== currentIndex) {
        (chips[nextIndex] as HTMLButtonElement).focus()
      }
    },
    [],
  )

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
            {bookId ? (
              <span data-testid="header-location">
                <span className="capitalize">{bookId.replace(/-/g, ' ')}</span>
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
          <div
            ref={selectorRef}
            role="radiogroup"
            aria-label="Selecione a tradução da Bíblia"
            data-testid="header-translation-selector"
            className="hidden sm:flex gap-1"
          >
            {translations.map((t, index) => {
              const isActive = activeTranslation === t.id
              return (
                <button
                  key={t.id}
                  data-testid={`header-translation-chip-${t.id}`}
                  onClick={() => handleTranslationSelect(t.id)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className={`chip ${isActive ? 'active' : ''}`}
                  role="radio"
                  aria-checked={isActive}
                  aria-label={t.name}
                  tabIndex={isActive ? 0 : -1}
                >
                  {t.shortName}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </header>
  )
}
