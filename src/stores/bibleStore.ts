import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { TranslationId } from '@/types'

interface BibleState {
  bookId: string | null
  chapter: number | null
  activeTranslation: TranslationId
  comparisonTranslations: TranslationId[]
  comparisonMode: boolean
}

interface BibleActions {
  setBook: (bookId: string) => void
  setChapter: (chapter: number) => void
  setActiveTranslation: (id: TranslationId) => void
  toggleComparisonMode: () => void
  setComparisonTranslations: (ids: TranslationId[]) => void
  navigateTo: (bookId: string, chapter: number) => void
}

type BibleStore = BibleState & BibleActions

export const useBibleStore = create<BibleStore>()(
  persist(
    (set) => ({
      bookId: null,
      chapter: null,
      activeTranslation: 'ara' as TranslationId,
      comparisonTranslations: [] as TranslationId[],
      comparisonMode: false,

      setBook: (bookId) => set({ bookId }),
      setChapter: (chapter) => set({ chapter }),
      setActiveTranslation: (id) => set({ activeTranslation: id }),
      toggleComparisonMode: () =>
        set((state) => ({ comparisonMode: !state.comparisonMode })),
      setComparisonTranslations: (ids) =>
        set({ comparisonTranslations: ids }),
      navigateTo: (bookId, chapter) => set({ bookId, chapter }),
    }),
    {
      name: 'bible-app-bible',
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
        bookId: state.bookId,
        chapter: state.chapter,
        activeTranslation: state.activeTranslation,
        comparisonMode: state.comparisonMode,
        comparisonTranslations: state.comparisonTranslations,
      }),
    },
  ),
)
