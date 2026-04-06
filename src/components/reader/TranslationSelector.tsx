import { translations } from '@/data/translations'
import type { TranslationId } from '@/types'

interface TranslationSelectorProps {
  selectedTranslations: TranslationId[]
  onSelectionChange: (ids: TranslationId[]) => void
}

export function TranslationSelector({
  selectedTranslations,
  onSelectionChange,
}: TranslationSelectorProps) {
  function handleToggle(id: TranslationId) {
    const isSelected = selectedTranslations.includes(id)
    if (isSelected) {
      if (selectedTranslations.length <= 2) return
      onSelectionChange(selectedTranslations.filter((t) => t !== id))
    } else {
      if (selectedTranslations.length >= 3) return
      onSelectionChange([...selectedTranslations, id])
    }
  }

  return (
    <div
      data-testid="translation-selector"
      role="group"
      aria-label="Selecione traduções para comparar"
      className="flex gap-2 flex-wrap"
    >
      {translations.map((t) => {
        const isActive = selectedTranslations.includes(t.id)
        return (
          <button
            key={t.id}
            data-testid={`translation-chip-${t.id}`}
            onClick={() => handleToggle(t.id)}
            className={`chip ${isActive ? 'active' : ''}`}
            role="radio"
            aria-checked={isActive}
            aria-label={t.name}
          >
            {t.shortName}
          </button>
        )
      })}
    </div>
  )
}
