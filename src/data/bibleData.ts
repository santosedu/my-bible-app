import type {
  BibleRef,
  BibleBookData,
  BookMeta,
  SearchResult,
  Verse,
  TranslationId,
  CrossReferenceEntry,
  BookId,
} from '@/types'
import { getBookMeta } from '@/data/books'
import araData from '@/data/bible/ara'
import acfData from '@/data/bible/acf'
import nviData from '@/data/bible/nvi'
import crossReferenceData from '@/data/crossReferences/data'

const eagerlyLoadedData: Record<TranslationId, BibleBookData> = {
  ara: araData,
  acf: acfData,
  nvi: nviData,
}

export function getVerseSync(
  bookId: string,
  chapter: number,
  verse: number,
  translationId?: TranslationId,
): string | null {
  const bibleData = eagerlyLoadedData[translationId ?? 'nvi']
  const bookData = bibleData[bookId as BookId]
  if (!bookData) return null
  const chapterData = bookData[chapter]
  if (!chapterData) return null
  return chapterData[verse] ?? null
}

export async function getVerse(
  bookId: string,
  chapter: number,
  verse: number,
  translationId: TranslationId = 'nvi',
): Promise<string | null> {
  return getVerseSync(bookId, chapter, verse, translationId)
}

export function getChapterSync(
  bookId: string,
  chapter: number,
  translationId?: TranslationId,
): Verse[] {
  const bibleData = eagerlyLoadedData[translationId ?? 'nvi']
  const bookData = bibleData[bookId as BookId]
  if (!bookData) return []
  const chapterData = bookData[chapter]
  if (!chapterData) return []
  return Object.entries(chapterData).map(([num, text]) => ({
    number: Number(num),
    text: text as string,
  }))
}

export async function getChapter(
  bookId: string,
  chapter: number,
  translationId: TranslationId = 'nvi',
): Promise<Verse[]> {
  return getChapterSync(bookId, chapter, translationId)
}

export function getBook(bookId: string): BookMeta | null {
  return getBookMeta(bookId)
}

export function getCrossReferences(
  bookId: string,
  chapter: number,
  verse: number,
): BibleRef[] {
  const bookRefs = crossReferenceData[bookId]
  if (!bookRefs) return []
  const chapterRefs = bookRefs[chapter]
  if (!chapterRefs) return []
  const verseRefs = chapterRefs[verse]
  if (!verseRefs) return []

  return verseRefs.map((ref: CrossReferenceEntry) => ({
    bookId: ref.bookId,
    chapter: ref.chapter,
    verse: ref.verse,
  }))
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const MAX_RESULTS = 50

function buildInvertedIndex(): Map<string, Array<{ bookId: string; bookName: string; chapter: number; verse: number; text: string }>> {
  const index = new Map<string, Array<{ bookId: string; bookName: string; chapter: number; verse: number; text: string }>>()

  for (const bookId of Object.keys(araData)) {
    const meta = getBookMeta(bookId)
    const bookName = meta?.name ?? bookId
    const bookData = araData[bookId as BookId]
    for (const chapterStr of Object.keys(bookData)) {
      const chapter = Number(chapterStr)
      const chapterData = bookData[chapter]
      for (const verseStr of Object.keys(chapterData)) {
        const verse = Number(verseStr)
        const text = chapterData[verse]
        const normalized = normalize(text)
        const words = normalized.split(' ')
        for (const word of words) {
          if (word.length < 2) continue
          let entries = index.get(word)
          if (!entries) {
            entries = []
            index.set(word, entries)
          }
          entries.push({ bookId, bookName, chapter, verse, text })
        }
      }
    }
  }
  return index
}

let invertedIndex: Map<string, Array<{ bookId: string; bookName: string; chapter: number; verse: number; text: string }>> | null = null

function getInvertedIndex() {
  if (!invertedIndex) {
    invertedIndex = buildInvertedIndex()
  }
  return invertedIndex
}

export function getSearchResults(query: string): SearchResult[] {
  const trimmed = query.trim()
  if (!trimmed) return []

  const normalizedQuery = normalize(trimmed)
  const queryWords = normalizedQuery.split(' ').filter((w) => w.length >= 2)

  if (queryWords.length === 0) return []

  const index = getInvertedIndex()

  const isPhraseSearch = queryWords.length > 1
  let results: SearchResult[] = []

  if (isPhraseSearch) {
    const phrase = queryWords.join(' ')
    const candidates = new Map<string, { entry: { bookId: string; bookName: string; chapter: number; verse: number; text: string }; score: number }>()

    for (const word of queryWords) {
      const entries = index.get(word)
      if (!entries) continue
      for (const entry of entries) {
        const key = `${entry.bookId}:${entry.chapter}:${entry.verse}`
        const existing = candidates.get(key)
        if (existing) {
          existing.score++
        } else {
          candidates.set(key, { entry, score: 1 })
        }
      }
    }

    for (const [, { entry, score }] of candidates) {
      const normalizedText = normalize(entry.text)
      if (normalizedText.includes(phrase)) {
        results.push({
          bookId: entry.bookId,
          bookName: entry.bookName,
          chapter: entry.chapter,
          verse: entry.verse,
          text: entry.text,
          score: score * 10,
        })
      }
    }

    const singleWordResults: SearchResult[] = []
    for (const word of queryWords) {
      const entries = index.get(word)
      if (!entries) continue
      for (const entry of entries) {
        const key = `${entry.bookId}:${entry.chapter}:${entry.verse}`
        if (!results.some((r) => `${r.bookId}:${r.chapter}:${r.verse}` === key)) {
          singleWordResults.push({
            bookId: entry.bookId,
            bookName: entry.bookName,
            chapter: entry.chapter,
            verse: entry.verse,
            text: entry.text,
            score: 1,
          })
        }
      }
    }
    results = results.concat(singleWordResults)
  } else {
    const entries = index.get(queryWords[0])
    if (!entries) return []
    results = entries.map((entry) => ({
      bookId: entry.bookId,
      bookName: entry.bookName,
      chapter: entry.chapter,
      verse: entry.verse,
      text: entry.text,
      score: 1,
    }))
  }

  results.sort((a, b) => b.score - a.score)
  return results.slice(0, MAX_RESULTS)
}
