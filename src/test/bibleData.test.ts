import { describe, it, expect } from 'vitest'
import {
  getVerse,
  getChapter,
  getBook,
  getCrossReferences,
  getSearchResults,
  getVerseSync,
  getChapterSync,
} from '@/data/bibleData'
import araData from '@/data/bible/ara'

describe('BibleData', () => {
  describe('getVerseSync', () => {
    it('returns correct verse text for valid reference', () => {
      const text = getVerseSync('genesis', 1, 1)
      expect(text).toBeTruthy()
      expect(text!.length).toBeGreaterThan(0)
    })

    it('returns null for invalid bookId', () => {
      expect(getVerseSync('nonexistent-book', 1, 1)).toBeNull()
    })

    it('returns null for invalid chapter', () => {
      expect(getVerseSync('genesis', 999, 1)).toBeNull()
    })

    it('returns null for invalid verse', () => {
      expect(getVerseSync('genesis', 1, 9999)).toBeNull()
    })
  })

  describe('getVerse (async)', () => {
    it('returns verse text for default translation (ARA)', async () => {
      const text = await getVerse('genesis', 1, 1)
      expect(text).toBeTruthy()
      expect(text!.length).toBeGreaterThan(0)
    })

    it('returns verse text for ACF translation', async () => {
      const text = await getVerse('genesis', 1, 1, 'acf')
      expect(text).toBeTruthy()
      expect(text!.length).toBeGreaterThan(0)
    })

    it('returns verse text for NVI translation', async () => {
      const text = await getVerse('genesis', 1, 1, 'nvi')
      expect(text).toBeTruthy()
      expect(text!.length).toBeGreaterThan(0)
    })

    it('returns null for invalid reference', async () => {
      expect(await getVerse('invalid-book', 1, 1)).toBeNull()
    })
  })

  describe('getChapterSync', () => {
    it('returns all verses for a chapter with correct numbering', () => {
      const verses = getChapterSync('genesis', 1)
      expect(verses.length).toBeGreaterThan(0)
      expect(verses[0].number).toBe(1)
      expect(verses[0].text).toBeTruthy()
      for (let i = 1; i < verses.length; i++) {
        expect(verses[i].number).toBe(verses[i - 1].number + 1)
      }
    })

    it('returns empty array for invalid bookId', () => {
      expect(getChapterSync('nonexistent', 1)).toEqual([])
    })

    it('returns empty array for invalid chapter', () => {
      expect(getChapterSync('genesis', 999)).toEqual([])
    })
  })

  describe('getChapter (async)', () => {
    it('returns verses for default translation', async () => {
      const verses = await getChapter('genesis', 1)
      expect(verses.length).toBeGreaterThan(0)
    })

    it('returns empty array for invalid reference', async () => {
      expect(await getChapter('invalid', 1)).toEqual([])
    })
  })

  describe('getBook', () => {
    it('returns correct BookMeta for known books', () => {
      const book = getBook('genesis')
      expect(book).not.toBeNull()
      expect(book!.id).toBe('genesis')
      expect(book!.name).toBe('Gênesis')
      expect(book!.testament).toBe('old')
      expect(book!.chapters).toBe(50)
    })

    it('returns null for unknown bookId', () => {
      expect(getBook('nonexistent-book')).toBeNull()
    })

    it('returns correct meta for a New Testament book', () => {
      const book = getBook('matthew')
      expect(book).not.toBeNull()
      expect(book!.testament).toBe('new')
      expect(book!.chapters).toBe(28)
    })
  })

  describe('getCrossReferences', () => {
    it('returns array of BibleRef for verses with cross-refs', () => {
      const refs = getCrossReferences('genesis', 1, 1)
      expect(Array.isArray(refs)).toBe(true)
      expect(refs.length).toBeGreaterThan(0)
      expect(refs[0]).toHaveProperty('bookId')
      expect(refs[0]).toHaveProperty('chapter')
      expect(refs[0]).toHaveProperty('verse')
    })

    it('returns empty array for verses without cross-refs', () => {
      const refs = getCrossReferences('genesis', 999, 999)
      expect(refs).toEqual([])
    })

    it('returns empty array for invalid book', () => {
      const refs = getCrossReferences('nonexistent', 1, 1)
      expect(refs).toEqual([])
    })
  })

  describe('getSearchResults', () => {
    it('returns matching verses for single word query', () => {
      const results = getSearchResults('Deus')
      expect(results.length).toBeGreaterThan(0)
      expect(results.length).toBeLessThanOrEqual(50)
      expect(results[0]).toHaveProperty('bookId')
      expect(results[0]).toHaveProperty('bookName')
      expect(results[0]).toHaveProperty('chapter')
      expect(results[0]).toHaveProperty('verse')
      expect(results[0]).toHaveProperty('text')
      expect(results[0]).toHaveProperty('score')
      expect(results[0].text.length).toBeGreaterThan(0)
    })

    it('returns phrase matches first for multi-word query', () => {
      const results = getSearchResults('No princípio criou')
      expect(results.length).toBeGreaterThan(0)
      expect(results[0].text.toLowerCase()).toContain('no princípio criou')
    })

    it('caps results at 50', () => {
      const results = getSearchResults('e')
      expect(results.length).toBeLessThanOrEqual(50)
    })

    it('returns empty array for empty query', () => {
      expect(getSearchResults('')).toEqual([])
      expect(getSearchResults('   ')).toEqual([])
    })

    it('returns empty array for query with only short words', () => {
      expect(getSearchResults('a')).toEqual([])
    })

    it('results are sorted by score descending', () => {
      const results = getSearchResults('amor')
      for (let i = 1; i < results.length; i++) {
        expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score)
      }
    })
  })
})

describe('BibleData - Integration', () => {
  it('loads BibleData module for ARA translation without throwing', () => {
    expect(araData).toBeDefined()
    expect(Object.keys(araData).length).toBe(66)
    expect(araData.genesis).toBeDefined()
    expect(araData.genesis[1]).toBeDefined()
    expect(araData.genesis[1][1]).toBeTruthy()
  })

  it('all 66 books have data', () => {
    expect(Object.keys(araData).length).toBe(66)
  })
})
