import { useEffect } from 'react'
import { useThemeStore } from '@/stores'

export function ThemeInitializer() {
  const preference = useThemeStore((s) => s.preference)
  const getResolvedTheme = useThemeStore((s) => s.getResolvedTheme)

  useEffect(() => {
    const theme = getResolvedTheme()
    document.documentElement.setAttribute('data-theme', theme)
  }, [preference, getResolvedTheme])

  useEffect(() => {
    if (preference !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      const theme = useThemeStore.getState().getResolvedTheme()
      document.documentElement.setAttribute('data-theme', theme)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [preference])

  return null
}
