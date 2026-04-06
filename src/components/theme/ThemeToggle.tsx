import { useThemeStore, type ThemePreference } from '@/stores'

const themeOptions: { value: ThemePreference; label: string; icon: React.ReactNode }[] = [
  {
    value: 'light',
    label: 'Claro',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="9" cy="9" r="4" />
        <line x1="9" y1="1" x2="9" y2="4" />
        <line x1="9" y1="14" x2="9" y2="17" />
        <line x1="1" y1="9" x2="4" y2="9" />
        <line x1="14" y1="9" x2="17" y2="9" />
        <line x1="3.34" y1="3.34" x2="5.46" y2="5.46" />
        <line x1="12.54" y1="12.54" x2="14.66" y2="14.66" />
        <line x1="3.34" y1="14.66" x2="5.46" y2="12.54" />
        <line x1="12.54" y1="5.46" x2="14.66" y2="3.34" />
      </svg>
    ),
  },
  {
    value: 'dark',
    label: 'Escuro',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M15.5 10.5A7 7 0 1 1 7.5 3a5 5 0 0 0 8 7z" />
      </svg>
    ),
  },
  {
    value: 'sepia',
    label: 'Sepia',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="9" cy="9" r="7" />
        <path d="M9 2v14" />
        <path d="M2 9h14" />
      </svg>
    ),
  },
  {
    value: 'system',
    label: 'Sistema',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <rect x="2" y="3" width="14" height="10" rx="1" />
        <line x1="6" y1="12" x2="12" y2="12" />
        <line x1="9" y1="9" x2="9" y2="10" />
      </svg>
    ),
  },
]

export function ThemeToggle() {
  const preference = useThemeStore((s) => s.preference)
  const setTheme = useThemeStore((s) => s.setTheme)

  return (
    <div
      role="radiogroup"
      aria-label="Selecionar tema"
      className="flex items-center gap-1 p-1 bg-[var(--color-surface)] rounded-lg"
    >
      {themeOptions.map((option) => (
        <button
          key={option.value}
          role="radio"
          aria-checked={preference === option.value}
          aria-label={option.label}
          onClick={() => setTheme(option.value)}
          className={`
            flex items-center justify-center w-9 h-9 rounded-md
            transition-colors duration-0.2
            ${preference === option.value 
              ? 'bg-[var(--color-accent)] text-white' 
              : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)]'
            }
          `}
          title={option.label}
        >
          {option.icon}
        </button>
      ))}
    </div>
  )
}
