import type { BookMeta } from '@/types'
import { books } from '@/data/books'
import { normalize } from '@/utils/normalize'

const DIGIT_TO_ORDINAL: Record<string, string> = {
  '1': 'primeiro',
  '2': 'segundo',
  '3': 'terceiro',
}

type AliasSource = 'name' | 'abbrev' | 'ordinal' | 'dot'

interface AliasEntry {
  book: BookMeta
  source: AliasSource
  original: string
}

function buildAliasMap(): Map<string, AliasEntry[]> {
  const map = new Map<string, AliasEntry[]>()

  function add(key: string, book: BookMeta, source: AliasSource, original: string) {
    const existing = map.get(key)
    if (existing) {
      if (!existing.some((e) => e.book.id === book.id && e.source === source)) {
        existing.push({ book, source, original })
      }
    } else {
      map.set(key, [{ book, source, original }])
    }
  }

  for (const book of books) {
    add(normalize(book.name), book, 'name', book.name)
    add(normalize(book.abbrev), book, 'abbrev', book.abbrev)

    if (book.name.startsWith('1 ') || book.name.startsWith('2 ') || book.name.startsWith('3 ')) {
      const [prefix, ...rest] = book.name.split(' ')
      const ordinal = DIGIT_TO_ORDINAL[prefix]
      if (ordinal) {
        const restText = rest.join(' ')
        add(normalize(`${ordinal} ${restText}`), book, 'ordinal', `${ordinal} ${restText}`)
        add(normalize(`${prefix}. ${restText}`), book, 'dot', `${prefix}. ${restText}`)
        add(normalize(`${prefix}.${restText}`), book, 'dot', `${prefix}.${restText}`)
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

  const lowerInput = input.trim().toLowerCase()

  const SOURCE_PRIORITY: AliasSource[] = ['abbrev', 'name', 'ordinal', 'dot']
  for (const source of SOURCE_PRIORITY) {
    const matches = entries.filter((e) => e.source === source)
    if (matches.length === 1) return matches[0].book
    if (matches.length > 1) {
      const exact = matches.find((e) => e.original.toLowerCase() === lowerInput)
      if (exact) return exact.book
      return matches[0].book
    }
  }

  return entries[0].book
}
