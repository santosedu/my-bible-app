import type { BibleQueryResult, BibleChapterResult, BibleQueryError } from '@/types'
import { resolveBookAlias } from '@/data/bibleAliases'
import { normalize } from '@/utils/normalize'

function extractTrailingNumber(input: string): { number: number; remaining: string } | null {
  const tokens = input.split(' ').filter((t) => t.length > 0)
  if (tokens.length === 0) return null

  const lastToken = tokens[tokens.length - 1]
  if (!/^\d+$/.test(lastToken)) return null

  const number = parseInt(lastToken, 10)
  if (isNaN(number)) return null

  const remaining = tokens.slice(0, -1).join(' ')
  return { number, remaining }
}

export function parseBibleQuery(input: string): BibleQueryResult {
  if (!input || !input.trim()) {
    return null
  }

  const normalized = normalize(input)

  if (/^\d+$/.test(normalized)) {
    return null
  }

  const extracted = extractTrailingNumber(normalized)
  if (!extracted) {
    return null
  }

  const { number: chapter, remaining: bookName } = extracted

  if (!bookName || bookName.trim() === '') {
    return null
  }

  const bookMeta = resolveBookAlias(bookName)

  if (!bookMeta) {
    const error: BibleQueryError = {
      type: 'error',
      errorKind: 'book_not_found',
      message: 'Livro não encontrado. Verifique a digitação e tente novamente.',
    }
    return error
  }

  if (chapter < 1 || chapter > bookMeta.chapters) {
    const error: BibleQueryError = {
      type: 'error',
      errorKind: 'chapter_out_of_range',
      message: `Capítulo ${chapter} não existe em ${bookMeta.name}. Este livro possui ${bookMeta.chapters} capítulos.`,
    }
    return error
  }

  const result: BibleChapterResult = {
    type: 'chapter',
    bookId: bookMeta.id,
    chapter,
    displayName: `${bookMeta.name} ${chapter}`,
  }

  return result
}