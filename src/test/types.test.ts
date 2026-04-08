import { describe, it, expect } from 'vitest'
import type {
  Verse,
  BibleRef,
  SearchResult,
  HighlightColor,
  Highlight,
  Note,
  Bookmark,
  BookId,
  TranslationId,
  BibleBookData,
  BookMeta,
  TranslationMeta,
  BibleTranslation,
  CrossReferenceEntry,
  CrossReferenceMap,
  BibleChapterResult,
  BibleQueryError,
  BibleQueryResult,
} from '@/types'

describe('Type exports', () => {
  it('exports all types without errors', () => {
    const verse: Verse = { number: 1, text: 'In the beginning' }
    expect(verse.number).toBe(1)
    expect(typeof verse.text).toBe('string')

    const ref: BibleRef = { bookId: 'genesis', chapter: 1, verse: 1 }
    expect(ref.bookId).toBe('genesis')

    const result: SearchResult = {
      bookId: 'genesis',
      bookName: 'Gênesis',
      chapter: 1,
      verse: 1,
      text: 'In the beginning',
      score: 1,
    }
    expect(result.score).toBe(1)
  })

  it('HighlightColor contains exactly yellow, green, blue, red, purple', () => {
    const validColors: HighlightColor[] = ['yellow', 'green', 'blue', 'red', 'purple']
    expect(validColors).toHaveLength(5)

    const highlight: Highlight = {
      id: 'test',
      bookId: 'genesis',
      chapter: 1,
      startVerse: 1,
      endVerse: 3,
      color: 'blue',
      createdAt: Date.now(),
    }
    expect(['yellow', 'green', 'blue', 'red', 'purple']).toContain(highlight.color)
  })

  it('Note type works correctly', () => {
    const note: Note = {
      id: 'test',
      bookId: 'john',
      chapter: 3,
      startVerse: 16,
      endVerse: null,
      text: 'For God so loved the world',
      updatedAt: Date.now(),
    }
    expect(note.endVerse).toBeNull()
    expect(typeof note.text).toBe('string')
  })

  it('Bookmark type works correctly', () => {
    const bookmark: Bookmark = {
      id: 'test',
      bookId: 'psalms',
      chapter: 23,
      verse: 1,
      label: 'The Lord is my shepherd',
      createdAt: Date.now(),
    }
    expect(bookmark.verse).toBe(1)
  })

  it('TranslationId contains exactly ara, acf, nvi', () => {
    const validIds: TranslationId[] = ['ara', 'acf', 'nvi']
    expect(validIds).toHaveLength(3)

    const meta: TranslationMeta = {
      id: 'ara',
      name: 'Almeida Revista e Atualizada',
      shortName: 'ARA',
      language: 'pt-BR',
    }
    expect(meta.id).toBe('ara')
  })

  it('BookMeta type works correctly', () => {
    const book: BookMeta = {
      id: 'genesis',
      name: 'Gênesis',
      abbrev: 'Gn',
      testament: 'old',
      chapters: 50,
    }
    expect(book.chapters).toBe(50)
    expect(book.testament).toBe('old')
  })

  it('BibleTranslation type works correctly', () => {
    const data = {
      genesis: { 1: { 1: 'In the beginning' } },
    } as unknown as BibleBookData

    const translation: BibleTranslation = {
      id: 'ara',
      name: 'Almeida Revista e Atualizada',
      shortName: 'ARA',
      language: 'pt-BR',
      data,
    }
    expect(translation.data).toBeDefined()
  })

  it('CrossReferenceMap type works correctly', () => {
    const entry: CrossReferenceEntry = {
      bookId: 'romans',
      chapter: 8,
      verse: 28,
    }
    expect(entry.bookId).toBe('romans')

    const map: CrossReferenceMap = {
      genesis: {
        1: {
          1: [entry],
        },
      },
    }
    expect(map.genesis[1][1]).toHaveLength(1)
  })

  it('BookId is a string union with 66 books', () => {
    const bookIds: BookId[] = [
      'genesis', 'exodus', 'leviticus', 'numbers', 'deuteronomy',
      'joshua', 'judges', 'ruth', '1-samuel', '2-samuel',
      '1-kings', '2-kings', '1-chronicles', '2-chronicles',
      'ezra', 'nehemiah', 'esther', 'job', 'psalms', 'proverbs',
      'ecclesiastes', 'song-of-solomon', 'isaiah', 'jeremiah',
      'lamentations', 'ezekiel', 'daniel', 'hosea', 'joel', 'amos',
      'obadiah', 'jonah', 'micah', 'nahum', 'habakkuk',
      'zephaniah', 'haggai', 'zechariah', 'malachi',
      'matthew', 'mark', 'luke', 'john', 'acts', 'romans',
      '1-corinthians', '2-corinthians', 'galatians', 'ephesians',
      'philippians', 'colossians', '1-thessalonians', '2-thessalonians',
      '1-timothy', '2-timothy', 'titus', 'philemon', 'hebrews',
      'james', '1-peter', '2-peter', '1-john', '2-john', '3-john',
      'jude', 'revelation',
    ]
    expect(bookIds).toHaveLength(66)
  })
})

describe('BibleQueryResult types', () => {
  it('BibleChapterResult accepts correct shape', () => {
    const chapterResult: BibleChapterResult = {
      type: 'chapter',
      bookId: 'genesis',
      chapter: 1,
      displayName: 'Gênesis 1',
    }
    expect(chapterResult.type).toBe('chapter')
    expect(chapterResult.bookId).toBe('genesis')
    expect(chapterResult.chapter).toBe(1)
    expect(chapterResult.displayName).toBe('Gênesis 1')
  })

  it('BibleQueryError accepts book_not_found errorKind', () => {
    const error: BibleQueryError = {
      type: 'error',
      errorKind: 'book_not_found',
      message: 'Livro não encontrado',
    }
    expect(error.type).toBe('error')
    expect(error.errorKind).toBe('book_not_found')
    expect(error.message).toBe('Livro não encontrado')
  })

  it('BibleQueryError accepts chapter_out_of_range errorKind', () => {
    const error: BibleQueryError = {
      type: 'error',
      errorKind: 'chapter_out_of_range',
      message: 'Capítulo não existe',
    }
    expect(error.errorKind).toBe('chapter_out_of_range')
  })

  it('BibleQueryError accepts invalid_format errorKind', () => {
    const error: BibleQueryError = {
      type: 'error',
      errorKind: 'invalid_format',
      message: 'Formato inválido',
    }
    expect(error.errorKind).toBe('invalid_format')
  })

  it('BibleQueryResult union accepts BibleChapterResult', () => {
    const result: BibleQueryResult = {
      type: 'chapter',
      bookId: 'john',
      chapter: 3,
      displayName: 'João 3',
    }
    expect(result.type).toBe('chapter')
  })

  it('BibleQueryResult union accepts BibleQueryError', () => {
    const result: BibleQueryResult = {
      type: 'error',
      errorKind: 'book_not_found',
      message: 'Not found',
    }
    expect(result.type).toBe('error')
  })

  it('BibleQueryResult union accepts null', () => {
    const result: BibleQueryResult = null
    expect(result).toBeNull()
  })

  it('BibleChapterResult can be used as BibleQueryResult', () => {
    const toResult = (chapter: BibleChapterResult): BibleQueryResult => chapter
    const result = toResult({
      type: 'chapter',
      bookId: 'romans',
      chapter: 8,
      displayName: 'Romanos 8',
    })
    expect((result as BibleChapterResult).type).toBe('chapter')
  })
})
