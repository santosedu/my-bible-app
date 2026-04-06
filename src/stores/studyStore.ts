import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Highlight, HighlightColor, Note, Bookmark } from '@/types'

interface StudyState {
  highlights: Highlight[]
  notes: Note[]
  bookmarks: Bookmark[]
}

interface StudyActions {
  addHighlight: (highlight: Omit<Highlight, 'id' | 'createdAt'>) => void
  removeHighlight: (id: string) => void
  editHighlightColor: (id: string, color: HighlightColor) => void
  addNote: (note: Omit<Note, 'id' | 'updatedAt'>) => void
  updateNote: (id: string, text: string) => void
  deleteNote: (id: string) => void
  addBookmark: (bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => void
  removeBookmark: (id: string) => void
  updateBookmarkLabel: (id: string, label: string) => void
}

type StudyStore = StudyState & StudyActions

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

export const useStudyStore = create<StudyStore>()(
  persist(
    (set) => ({
      highlights: [],
      notes: [],
      bookmarks: [],

      addHighlight: (highlight) =>
        set((state) => ({
          highlights: [
            ...state.highlights,
            { ...highlight, id: generateId(), createdAt: Date.now() },
          ],
        })),

      removeHighlight: (id) =>
        set((state) => ({
          highlights: state.highlights.filter((h) => h.id !== id),
        })),

      editHighlightColor: (id, color) =>
        set((state) => ({
          highlights: state.highlights.map((h) =>
            h.id === id ? { ...h, color } : h,
          ),
        })),

      addNote: (note) =>
        set((state) => ({
          notes: [
            ...state.notes,
            { ...note, id: generateId(), updatedAt: Date.now() },
          ],
        })),

      updateNote: (id, text) =>
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id ? { ...n, text, updatedAt: Date.now() } : n,
          ),
        })),

      deleteNote: (id) =>
        set((state) => ({
          notes: state.notes.filter((n) => n.id !== id),
        })),

      addBookmark: (bookmark) =>
        set((state) => ({
          bookmarks: [
            ...state.bookmarks,
            { ...bookmark, id: generateId(), createdAt: Date.now() },
          ],
        })),

      removeBookmark: (id) =>
        set((state) => ({
          bookmarks: state.bookmarks.filter((b) => b.id !== id),
        })),

      updateBookmarkLabel: (id, label) =>
        set((state) => ({
          bookmarks: state.bookmarks.map((b) =>
            b.id === id ? { ...b, label } : b,
          ),
        })),
    }),
    {
      name: 'bible-app-study',
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
    },
  ),
)
