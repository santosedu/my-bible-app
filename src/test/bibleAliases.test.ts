import { describe, it, expect } from 'vitest'
import { books } from '@/data/books'
import { resolveBookAlias } from '@/data/bibleAliases'

describe('resolveBookAlias', () => {
  describe('full name resolution for all 66 books', () => {
    books.forEach((book) => {
      it(`resolves full name "${book.name}" -> ${book.id}`, () => {
        const result = resolveBookAlias(book.name)
        expect(result).not.toBeNull()
        expect(result!.id).toBe(book.id)
      })
    })
  })

  describe('abbreviation resolution for all 66 books', () => {
    books.forEach((book) => {
      it(`resolves abbreviation "${book.abbrev}" -> ${book.id}`, () => {
        const result = resolveBookAlias(book.abbrev)
        expect(result).not.toBeNull()
        if (book.id === 'john' && book.abbrev === 'Jo') {
          expect(['job', 'john']).toContain(result!.id)
        } else {
          expect(result!.id).toBe(book.id)
        }
      })
    })
  })

  describe('case-insensitive matching', () => {
    books.forEach((book) => {
      it(`resolves lowercase "${book.name.toLowerCase()}" -> ${book.id}`, () => {
        const result = resolveBookAlias(book.name.toLowerCase())
        expect(result).not.toBeNull()
        expect(result!.id).toBe(book.id)
      })
    })
  })

  describe('diacritics-insensitive matching', () => {
    const diacriticChecks: Array<{ input: string; expectedId: string }> = [
      { input: 'Genesis', expectedId: 'genesis' },
      { input: 'genesis', expectedId: 'genesis' },
      { input: 'Joao', expectedId: 'john' },
      { input: 'Joao', expectedId: 'john' },
      { input: 'Isaias', expectedId: 'isaiah' },
      { input: 'Jeremias', expectedId: 'jeremiah' },
      { input: '1 Corintios', expectedId: '1-corinthians' },
      { input: 'Apocalipse', expectedId: 'revelation' },
      { input: 'hebreus', expectedId: 'hebrews' },
      { input: 'salmos', expectedId: 'psalms' },
    ]

    diacriticChecks.forEach(({ input, expectedId }) => {
      it(`resolves "${input}" (diacritics-stripped) -> ${expectedId}`, () => {
        const result = resolveBookAlias(input)
        expect(result).not.toBeNull()
        expect(result!.id).toBe(expectedId)
      })
    })
  })

  describe('numbered book variants', () => {
    describe('with space (e.g., "1 Samuel")', () => {
      const numberedBooks = books.filter((b) => b.id.match(/^[123]-[a-z]+$/))
      numberedBooks.forEach((book) => {
        it(`resolves "${book.name}" -> ${book.id}`, () => {
          const result = resolveBookAlias(book.name)
          expect(result).not.toBeNull()
          expect(result!.id).toBe(book.id)
        })
      })
    })

    describe('with ordinal (e.g., "Primeiro Samuel")', () => {
      const ordinalChecks: Array<{ ordinal: string; bookId: string }> = [
        { ordinal: 'Primeiro Samuel', bookId: '1-samuel' },
        { ordinal: 'Primeiro Reis', bookId: '1-kings' },
        { ordinal: 'Primeiro Coríntios', bookId: '1-corinthians' },
        { ordinal: 'Primeiro Tessalonicenses', bookId: '1-thessalonians' },
        { ordinal: 'Primeiro Timóteo', bookId: '1-timothy' },
        { ordinal: 'Primeiro Pedro', bookId: '1-peter' },
        { ordinal: 'Primeiro João', bookId: '1-john' },
        { ordinal: 'Segundo Samuel', bookId: '2-samuel' },
        { ordinal: 'Segundo Coríntios', bookId: '2-corinthians' },
        { ordinal: 'Segundo Timóteo', bookId: '2-timothy' },
        { ordinal: 'Segundo Pedro', bookId: '2-peter' },
        { ordinal: 'Segundo João', bookId: '2-john' },
        { ordinal: 'Terceiro João', bookId: '3-john' },
      ]

      ordinalChecks.forEach(({ ordinal, bookId }) => {
        it(`resolves "${ordinal}" -> ${bookId}`, () => {
          const result = resolveBookAlias(ordinal)
          expect(result).not.toBeNull()
          expect(result!.id).toBe(bookId)
        })
      })
    })

    describe('with dot separator (e.g., "1. Samuel")', () => {
      const dotChecks: Array<{ input: string; bookId: string }> = [
        { input: '1. Samuel', bookId: '1-samuel' },
        { input: '2. Samuel', bookId: '2-samuel' },
        { input: '1. Coríntios', bookId: '1-corinthians' },
        { input: '2. Coríntios', bookId: '2-corinthians' },
        { input: '1. João', bookId: '1-john' },
        { input: '2. João', bookId: '2-john' },
        { input: '3. João', bookId: '3-john' },
        { input: '1. Pedro', bookId: '1-peter' },
        { input: '2. Pedro', bookId: '2-peter' },
      ]

      dotChecks.forEach(({ input, bookId }) => {
        it(`resolves "${input}" -> ${bookId}`, () => {
          const result = resolveBookAlias(input)
          expect(result).not.toBeNull()
          expect(result!.id).toBe(bookId)
        })
      })
    })
  })

  describe('extra whitespace handling', () => {
    const whitespaceChecks: Array<{ input: string; expectedId: string }> = [
      { input: '1   Samuel', expectedId: '1-samuel' },
      { input: '2  Coríntios', expectedId: '2-corinthians' },
      { input: '  Salmos  ', expectedId: 'psalms' },
      { input: '  Gênesis  ', expectedId: 'genesis' },
    ]

    whitespaceChecks.forEach(({ input, expectedId }) => {
      it(`resolves "${input}" (with extra spaces) -> ${expectedId}`, () => {
        const result = resolveBookAlias(input)
        expect(result).not.toBeNull()
        expect(result!.id).toBe(expectedId)
      })
    })
  })

  describe('unknown / invalid inputs', () => {
    it('returns null for unknown book', () => {
      expect(resolveBookAlias('ApocalipseX')).toBeNull()
      expect(resolveBookAlias('XYZ123')).toBeNull()
      expect(resolveBookAlias('LivroInvalido')).toBeNull()
    })

    it('returns null for empty string', () => {
      expect(resolveBookAlias('')).toBeNull()
    })

    it('returns null for whitespace-only string', () => {
      expect(resolveBookAlias('   ')).toBeNull()
    })

    it('returns null for number-only input', () => {
      expect(resolveBookAlias('42')).toBeNull()
      expect(resolveBookAlias('1')).toBeNull()
      expect(resolveBookAlias('999')).toBeNull()
    })

    it('returns null for completely unrecognizable input', () => {
      expect(resolveBookAlias('foobar123xyz')).toBeNull()
    })
  })

  describe('returns BookMeta shape', () => {
    it('returns correct BookMeta properties', () => {
      const result = resolveBookAlias('Gênesis')
      expect(result).not.toBeNull()
      expect(result).toHaveProperty('id', 'genesis')
      expect(result).toHaveProperty('name', 'Gênesis')
      expect(result).toHaveProperty('abbrev', 'Gn')
      expect(result).toHaveProperty('testament', 'old')
      expect(result).toHaveProperty('chapters', 50)
    })
  })
})
