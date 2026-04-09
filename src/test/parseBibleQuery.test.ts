import { describe, it, expect } from 'vitest'
import { parseBibleQuery } from '@/utils/parseBibleQuery'

function expectChapter(result: ReturnType<typeof parseBibleQuery>) {
  expect(result).not.toBeNull()
  if (result && result.type === 'chapter') return result
  throw new Error('Expected chapter result')
}

function expectError(result: ReturnType<typeof parseBibleQuery>) {
  expect(result).not.toBeNull()
  if (result && result.type === 'error') return result
  throw new Error('Expected error result')
}

describe('parseBibleQuery', () => {
  describe('valid chapter references', () => {
    it('parses full name: João 3 -> chapter result', () => {
      const result = parseBibleQuery('João 3')
      const r = expectChapter(result)
      expect(r.type).toBe('chapter')
      expect(r.bookId).toBe('john')
      expect(r.chapter).toBe(3)
      expect(r.displayName).toBe('João 3')
    })

    it('parses abbreviation: Sl 23 -> chapter result', () => {
      const result = parseBibleQuery('Sl 23')
      const r = expectChapter(result)
      expect(r.bookId).toBe('psalms')
      expect(r.chapter).toBe(23)
      expect(r.displayName).toBe('Salmos 23')
    })

    it('parses numbered book: 1 Coríntios 13 -> chapter result', () => {
      const result = parseBibleQuery('1 Coríntios 13')
      const r = expectChapter(result)
      expect(r.bookId).toBe('1-corinthians')
      expect(r.chapter).toBe(13)
      expect(r.displayName).toBe('1 Coríntios 13')
    })

    it('parses Gênesis 1', () => {
      const result = parseBibleQuery('Gênesis 1')
      const r = expectChapter(result)
      expect(r.bookId).toBe('genesis')
      expect(r.chapter).toBe(1)
    })

    it('parses Apocalipse 22', () => {
      const result = parseBibleQuery('Apocalipse 22')
      const r = expectChapter(result)
      expect(r.bookId).toBe('revelation')
      expect(r.chapter).toBe(22)
    })
  })

  describe('case-insensitive matching', () => {
    it('parses lowercase: joão 3', () => {
      const result = parseBibleQuery('joão 3')
      const r = expectChapter(result)
      expect(r.bookId).toBe('john')
      expect(r.chapter).toBe(3)
    })

    it('parses all caps: JOÃO 3', () => {
      const result = parseBibleQuery('JOÃO 3')
      const r = expectChapter(result)
      expect(r.bookId).toBe('john')
    })
  })

  describe('diacritics-insensitive matching', () => {
    it('parses Genesis 1 (without diacritics)', () => {
      const result = parseBibleQuery('Genesis 1')
      const r = expectChapter(result)
      expect(r.bookId).toBe('genesis')
      expect(r.chapter).toBe(1)
    })

    it('parses Joao 3 (without diacritics)', () => {
      const result = parseBibleQuery('Joao 3')
      const r = expectChapter(result)
      expect(r.bookId).toBe('john')
      expect(r.chapter).toBe(3)
    })
  })

  describe('extra whitespace handling', () => {
    it('parses João   3 (extra spaces)', () => {
      const result = parseBibleQuery('João   3')
      const r = expectChapter(result)
      expect(r.bookId).toBe('john')
      expect(r.chapter).toBe(3)
    })

    it('parses 1   Coríntios 13 (extra spaces)', () => {
      const result = parseBibleQuery('1   Coríntios 13')
      const r = expectChapter(result)
      expect(r.bookId).toBe('1-corinthians')
      expect(r.chapter).toBe(13)
    })
  })

  describe('ordinal variants', () => {
    it('parses Primeiro Coríntios 13', () => {
      const result = parseBibleQuery('Primeiro Coríntios 13')
      const r = expectChapter(result)
      expect(r.bookId).toBe('1-corinthians')
      expect(r.chapter).toBe(13)
    })

    it('parses Primeiro Samuel 1', () => {
      const result = parseBibleQuery('Primeiro Samuel 1')
      const r = expectChapter(result)
      expect(r.bookId).toBe('1-samuel')
      expect(r.chapter).toBe(1)
    })
  })

  describe('dot separator variants', () => {
    it('parses 1. Coríntios 13', () => {
      const result = parseBibleQuery('1. Coríntios 13')
      const r = expectChapter(result)
      expect(r.bookId).toBe('1-corinthians')
      expect(r.chapter).toBe(13)
    })
  })

  describe('error: book not found', () => {
    it('returns book_not_found for unknown book: ApocalipseX 1', () => {
      const result = parseBibleQuery('ApocalipseX 1')
      const r = expectError(result)
      expect(r.errorKind).toBe('book_not_found')
    })

    it('returns book_not_found for invalid book name: XYZ 1', () => {
      const result = parseBibleQuery('XYZ 1')
      const r = expectError(result)
      expect(r.errorKind).toBe('book_not_found')
    })

    it('returns book_not_found for partial match: Abc 1', () => {
      const result = parseBibleQuery('Abc 1')
      const r = expectError(result)
      expect(r.errorKind).toBe('book_not_found')
    })
  })

  describe('error: chapter out of range', () => {
    it('returns chapter_out_of_range: João 50 (max 21)', () => {
      const result = parseBibleQuery('João 50')
      const r = expectError(result)
      expect(r.errorKind).toBe('chapter_out_of_range')
    })

    it('returns chapter_out_of_range: João 0 (chapter zero)', () => {
      const result = parseBibleQuery('João 0')
      const r = expectError(result)
      expect(r.errorKind).toBe('chapter_out_of_range')
    })

    it('returns chapter_out_of_range: Gênesis 51 (max 50)', () => {
      const result = parseBibleQuery('Gênesis 51')
      const r = expectError(result)
      expect(r.errorKind).toBe('chapter_out_of_range')
    })

    it('returns chapter_out_of_range: Apocalipse 23 (max 22)', () => {
      const result = parseBibleQuery('Apocalipse 23')
      const r = expectError(result)
      expect(r.errorKind).toBe('chapter_out_of_range')
    })

    it('returns null for negative chapter number', () => {
      const result = parseBibleQuery('João -1')
      expect(result).toBeNull()
    })
  })

  describe('not a bible reference -> null', () => {
    it('returns null for book name only: João', () => {
      const result = parseBibleQuery('João')
      expect(result).toBeNull()
    })

    it('returns null for empty string', () => {
      const result = parseBibleQuery('')
      expect(result).toBeNull()
    })

    it('returns null for whitespace-only string', () => {
      const result = parseBibleQuery('   ')
      expect(result).toBeNull()
    })

    it('returns null for number-only input: 42', () => {
      const result = parseBibleQuery('42')
      expect(result).toBeNull()
    })

    it('returns null for regular text query: amor', () => {
      const result = parseBibleQuery('amor')
      expect(result).toBeNull()
    })

    it('returns null for phrase without chapter: palavra de deus', () => {
      const result = parseBibleQuery('palavra de deus')
      expect(result).toBeNull()
    })

    it('returns null for text with leading/trailing spaces but no chapter number', () => {
      const result = parseBibleQuery('  João  ')
      expect(result).toBeNull()
    })
  })

  describe('edge cases', () => {
    it('handles very large chapter numbers', () => {
      const result = parseBibleQuery('João 999')
      const r = expectError(result)
      expect(r.errorKind).toBe('chapter_out_of_range')
    })

    it('handles leading zeros in chapter number', () => {
      const result = parseBibleQuery('João 003')
      const r = expectChapter(result)
      expect(r.chapter).toBe(3)
    })
  })
})
