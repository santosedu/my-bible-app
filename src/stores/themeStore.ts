import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type ThemePreference = 'light' | 'dark' | 'sepia' | 'green' | 'blue' | 'orange' | 'system'
export type ResolvedTheme = 'light' | 'dark' | 'sepia' | 'green' | 'blue' | 'orange'

interface ThemeState {
  preference: ThemePreference
}

interface ThemeActions {
  setTheme: (theme: ThemePreference) => void
  getResolvedTheme: () => ResolvedTheme
}

type ThemeStore = ThemeState & ThemeActions

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function resolveTheme(preference: ThemePreference): ResolvedTheme {
  if (preference === 'system') return getSystemTheme()
  return preference
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      preference: 'system' as ThemePreference,

      setTheme: (theme) => set({ preference: theme }),

      getResolvedTheme: () => resolveTheme(get().preference),
    }),
    {
      name: 'bible-app-theme',
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
