import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { getTotalChapters } from '@/data/books'

interface ProgressState {
  readChapters: Set<string>
}

interface ProgressActions {
  markChapterAsRead: (bookId: string, chapter: number) => void
  isChapterRead: (bookId: string, chapter: number) => boolean
  getBookProgress: (bookId: string) => { read: number; total: number }
  getOverallProgress: () => { read: number; total: number }
}

type ProgressStore = ProgressState & ProgressActions

function chapterKey(bookId: string, chapter: number): string {
  return `${bookId}:${chapter}`
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      readChapters: new Set<string>(),

      markChapterAsRead: (bookId, chapter) =>
        set((state) => {
          const next = new Set(state.readChapters)
          next.add(chapterKey(bookId, chapter))
          return { readChapters: next }
        }),

      isChapterRead: (bookId, chapter) =>
        get().readChapters.has(chapterKey(bookId, chapter)),

      getBookProgress: (bookId) => {
        const total = getTotalChapters(bookId)
        let read = 0
        const prefix = `${bookId}:`
        for (const key of get().readChapters) {
          if (key.startsWith(prefix)) read++
        }
        return { read, total }
      },

      getOverallProgress: () => {
        const total = getTotalChapters()
        return { read: get().readChapters.size, total }
      },
    }),
    {
      name: 'bible-app-progress',
      storage: createJSONStorage(() => {
        try {
          return localStorage
        } catch {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          }
        }
      }),
      partialize: (state) => ({
        readChapters: Array.from(state.readChapters),
      }),
      merge: (persisted, current) => {
        const p = persisted as { readChapters?: string[] } | undefined
        return {
          ...current,
          readChapters: new Set(p?.readChapters ?? []),
        }
      },
    },
  ),
)
