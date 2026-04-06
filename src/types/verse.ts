export interface Verse {
  number: number
  text: string
}

export interface BibleRef {
  bookId: string
  chapter: number
  verse: number
}

export interface SearchResult {
  bookId: string
  bookName: string
  chapter: number
  verse: number
  text: string
  score: number
}
