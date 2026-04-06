import { describe, it, expect } from 'vitest'
import {
  books,
  getAllBooks,
  getBookById,
  getBookMeta,
  getBooksByTestament,
  testamentGroups,
} from '@/data/books'

describe('Books Data', () => {
  it('getAllBooks returns exactly 66 books', () => {
    expect(getAllBooks()).toHaveLength(66)
  })

  it('books array has exactly 66 entries', () => {
    expect(books).toHaveLength(66)
  })

  it('getAllBooks returns the same reference as books', () => {
    expect(getAllBooks()).toBe(books)
  })

  describe('getBooksByTestament', () => {
    it('returns 39 Old Testament books', () => {
      const oldTestament = getBooksByTestament('old')
      expect(oldTestament).toHaveLength(39)
      oldTestament.forEach((book) => {
        expect(book.testament).toBe('old')
      })
    })

    it('returns 27 New Testament books', () => {
      const newTestament = getBooksByTestament('new')
      expect(newTestament).toHaveLength(27)
      newTestament.forEach((book) => {
        expect(book.testament).toBe('new')
      })
    })

    it('OT + NT total equals 66', () => {
      const total = getBooksByTestament('old').length + getBooksByTestament('new').length
      expect(total).toBe(66)
    })
  })

  describe('getBookById', () => {
    it("returns Genesis with name 'Gênesis' and 50 chapters", () => {
      const genesis = getBookById('genesis')
      expect(genesis).toBeDefined()
      expect(genesis!.id).toBe('genesis')
      expect(genesis!.name).toBe('Gênesis')
      expect(genesis!.abbrev).toBe('Gn')
      expect(genesis!.testament).toBe('old')
      expect(genesis!.chapters).toBe(50)
    })

    it("returns Revelation with name 'Apocalipse' and 22 chapters", () => {
      const revelation = getBookById('revelation')
      expect(revelation).toBeDefined()
      expect(revelation!.id).toBe('revelation')
      expect(revelation!.name).toBe('Apocalipse')
      expect(revelation!.abbrev).toBe('Ap')
      expect(revelation!.testament).toBe('new')
      expect(revelation!.chapters).toBe(22)
    })

    it('returns undefined for unknown id', () => {
      expect(getBookById('nonexistent')).toBeUndefined()
    })

    it('returns undefined for empty string', () => {
      expect(getBookById('')).toBeUndefined()
    })
  })

  describe('getBookMeta', () => {
    it('returns null for unknown id', () => {
      expect(getBookMeta('nonexistent')).toBeNull()
    })

    it('returns the same book as getBookById for known ids', () => {
      const meta = getBookMeta('genesis')
      const byId = getBookById('genesis')
      expect(meta).toEqual(byId)
    })
  })

  describe('data integrity', () => {
    it('every book has a non-empty Portuguese name', () => {
      books.forEach((book) => {
        expect(book.name.length).toBeGreaterThan(0)
      })
    })

    it('every book has a non-empty abbreviation', () => {
      books.forEach((book) => {
        expect(book.abbrev.length).toBeGreaterThan(0)
      })
    })

    it('every book has a positive chapter count', () => {
      books.forEach((book) => {
        expect(book.chapters).toBeGreaterThan(0)
      })
    })

    it('no duplicate bookIds exist', () => {
      const ids = books.map((b) => b.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })

    it('all bookIds are lowercase with no accents or spaces', () => {
      const validIdPattern = /^[a-z0-9-]+$/
      books.forEach((book) => {
        expect(book.id).toMatch(validIdPattern)
      })
    })

    it('all books have valid testament value', () => {
      books.forEach((book) => {
        expect(['old', 'new']).toContain(book.testament)
      })
    })
  })

  describe('testament groups', () => {
    it('has exactly 2 groups', () => {
      expect(testamentGroups).toHaveLength(2)
    })

    it('first group is Old Testament', () => {
      expect(testamentGroups[0].testament).toBe('old')
      expect(testamentGroups[0].label).toBe('Antigo Testamento')
      expect(testamentGroups[0].books).toHaveLength(39)
    })

    it('second group is New Testament', () => {
      expect(testamentGroups[1].testament).toBe('new')
      expect(testamentGroups[1].label).toBe('Novo Testamento')
      expect(testamentGroups[1].books).toHaveLength(27)
    })

    it('group books match getBooksByTestament results', () => {
      for (const group of testamentGroups) {
        expect(group.books).toEqual(getBooksByTestament(group.testament))
      }
    })
  })

  describe('specific book spot checks', () => {
    const spotChecks: Array<{ id: string; name: string; chapters: number; testament: 'old' | 'new' }> = [
      { id: 'psalms', name: 'Salmos', chapters: 150, testament: 'old' },
      { id: 'isaiah', name: 'Isaías', chapters: 66, testament: 'old' },
      { id: 'matthew', name: 'Mateus', chapters: 28, testament: 'new' },
      { id: 'john', name: 'João', chapters: 21, testament: 'new' },
      { id: 'acts', name: 'Atos', chapters: 28, testament: 'new' },
      { id: 'romans', name: 'Romanos', chapters: 16, testament: 'new' },
      { id: 'obadiah', name: 'Obadias', chapters: 1, testament: 'old' },
      { id: '2-john', name: '2 João', chapters: 1, testament: 'new' },
      { id: '3-john', name: '3 João', chapters: 1, testament: 'new' },
      { id: 'philemon', name: 'Filemom', chapters: 1, testament: 'new' },
    ]

    spotChecks.forEach(({ id, name, chapters, testament }) => {
      it(`${id} has correct metadata`, () => {
        const book = getBookById(id)
        expect(book).toBeDefined()
        expect(book!.name).toBe(name)
        expect(book!.chapters).toBe(chapters)
        expect(book!.testament).toBe(testament)
      })
    })
  })
})
