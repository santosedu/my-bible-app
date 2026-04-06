import type { TranslationId, TranslationMeta } from '@/types'

export const translations: TranslationMeta[] = [
  { id: 'ara', name: 'Almeida Revista e Atualizada', shortName: 'ARA', language: 'pt-BR' },
  { id: 'acf', name: 'Almeida Corrigida Fiel', shortName: 'ACF', language: 'pt-BR' },
  { id: 'nvi', name: 'Nova Versão Internacional', shortName: 'NVI', language: 'pt-BR' },
]

export const defaultTranslationId: TranslationId = 'nvi'

const translationMap = new Map<TranslationId, TranslationMeta>()
for (const t of translations) {
  translationMap.set(t.id, t)
}

export function getTranslationMeta(id: TranslationId): TranslationMeta | null {
  return translationMap.get(id) ?? null
}
