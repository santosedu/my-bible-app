import type { BookMeta } from '@/types'
import { books } from '@/data/books'

function normalize(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/\s+/g, ' ')
}

const DIGIT_TO_ORDINAL: Record<string, string> = {
  '1': 'primeiro',
  '2': 'segundo',
  '3': 'terceiro',
}

type AliasSource = 'name' | 'abbrev' | 'ordinal' | 'dot'

interface AliasEntry {
  book: BookMeta
  source: AliasSource
}

function buildAliasMap(): Map<string, AliasEntry[]> {
  const map = new Map<string, AliasEntry[]>()

  function add(key: string, book: BookMeta, source: AliasSource) {
    const existing = map.get(key)
    if (existing) {
      if (!existing.some((e) => e.book.id === book.id && e.source === source)) {
        existing.push({ book, source })
      }
    } else {
      map.set(key, [{ book, source }])
    }
  }

  for (const book of books) {
    add(normalize(book.name), book, 'name')
    add(normalize(book.abbrev), book, 'abbrev')

    if (book.name.startsWith('1 ') || book.name.startsWith('2 ') || book.name.startsWith('3 ')) {
      const [prefix, ...rest] = book.name.split(' ')
      const ordinal = DIGIT_TO_ORDINAL[prefix]
      if (ordinal) {
        const restText = rest.join(' ')
        add(normalize(`${ordinal} ${restText}`), book, 'ordinal')
        add(normalize(`${prefix}. ${restText}`), book, 'dot')
      }
    }
  }

  return map
}

const aliasMap = buildAliasMap()

export function resolveBookAlias(input: string): BookMeta | null {
  if (!input || !input.trim()) return null
  const normalized = normalize(input)
  if (!normalized || /^\d+$/.test(normalized)) return null

  const entries = aliasMap.get(normalized)
  if (!entries || entries.length === 0) return null
  if (entries.length === 1) return entries[0].book

  const SOURCE_PRIORITY: AliasSource[] = ['abbrev', 'name', 'ordinal', 'dot']
  for (const source of SOURCE_PRIORITY) {
    const match = entries.find((e) => e.source === source)
    if (match) return match.book
  }

  return entries[0].book
}
