import type { HighlightColor } from '@/types'

interface HighlightPickerProps {
  currentColor: HighlightColor | null
  onColorSelect: (color: HighlightColor) => void
  onRemove: () => void
}

const colors: HighlightColor[] = ['yellow', 'green', 'rose']

const colorLabels: Record<HighlightColor, string> = {
  yellow: 'amarelo',
  green: 'verde',
  rose: 'rosa',
}

export function HighlightPicker({
  currentColor,
  onColorSelect,
  onRemove,
}: HighlightPickerProps) {
  return (
    <div data-testid="highlight-picker" className="flex items-center gap-2">
      {colors.map((color) => (
        <button
          key={color}
          data-testid={`highlight-btn-${color}`}
          onClick={() => onColorSelect(color)}
          className={`highlight-btn highlight-${color} ${currentColor === color ? 'active' : ''}`}
          aria-label={`Destacar em ${colorLabels[color]}`}
          aria-pressed={currentColor === color}
          type="button"
        />
      ))}
      {currentColor && (
        <button
          data-testid="highlight-btn-remove"
          onClick={onRemove}
          className="btn-ghost"
          aria-label="Remover destaque"
          type="button"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <line x1="4" y1="4" x2="12" y2="12" />
            <line x1="12" y1="4" x2="4" y2="12" />
          </svg>
        </button>
      )}
    </div>
  )
}
