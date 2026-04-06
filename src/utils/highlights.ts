import type { Highlight, HighlightColor } from '@/types'

export function getHighlightForVerse(
  highlights: Highlight[],
  bookId: string,
  chapter: number,
  verseNumber: number,
): HighlightColor | null {
  for (const h of highlights) {
    if (
      h.bookId === bookId &&
      h.chapter === chapter &&
      verseNumber >= h.startVerse &&
      verseNumber <= h.endVerse
    ) {
      return h.color
    }
  }
  return null
}
