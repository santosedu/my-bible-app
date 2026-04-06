export type HighlightColor = 'yellow' | 'green' | 'rose'

export interface Highlight {
  id: string
  bookId: string
  chapter: number
  startVerse: number
  endVerse: number
  color: HighlightColor
  createdAt: number
}

export interface Note {
  id: string
  bookId: string
  chapter: number
  startVerse: number
  endVerse: number | null
  text: string
  updatedAt: number
}

export interface Bookmark {
  id: string
  bookId: string
  chapter: number
  verse: number | null
  label: string
  createdAt: number
}
