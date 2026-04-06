import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { ThemeInitializer } from '@/components/layout/ThemeInitializer'
import { useThemeStore } from '@/stores'
import { BrowserRouter } from 'react-router'

beforeEach(() => {
  localStorage.clear()
  useThemeStore.setState({ preference: 'system' })
  cleanup()
})

function renderWithRouter(component: React.ReactNode) {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('ThemeToggle', () => {
  it('renders seven theme options', () => {
    renderWithRouter(<ThemeToggle />)
    
    expect(screen.getByRole('radio', { name: /claro/i })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /escuro/i })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /sepia/i })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /verde/i })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /azul/i })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /laranja/i })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /sistema/i })).toBeInTheDocument()
  })

  it('has radiogroup with aria-label', () => {
    renderWithRouter(<ThemeToggle />)
    
    expect(screen.getByRole('radiogroup', { name: /selecionar tema/i })).toBeInTheDocument()
  })

  it('starts with system option selected', () => {
    renderWithRouter(<ThemeToggle />)
    
    const systemBtn = screen.getByRole('radio', { name: /sistema/i })
    expect(systemBtn).toHaveAttribute('aria-checked', 'true')
  })

  it('selecting light theme updates store', () => {
    renderWithRouter(<ThemeToggle />)
    
    fireEvent.click(screen.getByRole('radio', { name: /claro/i }))
    expect(useThemeStore.getState().preference).toBe('light')
  })

  it('selecting dark theme updates store', () => {
    renderWithRouter(<ThemeToggle />)
    
    fireEvent.click(screen.getByRole('radio', { name: /escuro/i }))
    expect(useThemeStore.getState().preference).toBe('dark')
  })

  it('selecting sepia theme updates store', () => {
    renderWithRouter(<ThemeToggle />)
    
    fireEvent.click(screen.getByRole('radio', { name: /sepia/i }))
    expect(useThemeStore.getState().preference).toBe('sepia')
  })

  it('selecting system theme updates store', () => {
    useThemeStore.getState().setTheme('dark')
    renderWithRouter(<ThemeToggle />)
    
    fireEvent.click(screen.getByRole('radio', { name: /sistema/i }))
    expect(useThemeStore.getState().preference).toBe('system')
  })

  it('selecting green theme updates store', () => {
    renderWithRouter(<ThemeToggle />)
    
    fireEvent.click(screen.getByRole('radio', { name: /verde/i }))
    expect(useThemeStore.getState().preference).toBe('green')
  })

  it('selecting blue theme updates store', () => {
    renderWithRouter(<ThemeToggle />)
    
    fireEvent.click(screen.getByRole('radio', { name: /azul/i }))
    expect(useThemeStore.getState().preference).toBe('blue')
  })

  it('selecting orange theme updates store', () => {
    renderWithRouter(<ThemeToggle />)
    
    fireEvent.click(screen.getByRole('radio', { name: /laranja/i }))
    expect(useThemeStore.getState().preference).toBe('orange')
  })
})

describe('ThemeInitializer', () => {
  it('sets data-theme attribute on mount', () => {
    useThemeStore.getState().setTheme('light')
    
    renderWithRouter(<ThemeInitializer />)
    
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })

  it('updates data-theme when preference changes to explicit theme', async () => {
    useThemeStore.getState().setTheme('light')
    const { rerender } = renderWithRouter(<ThemeInitializer />)
    
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
    
    useThemeStore.getState().setTheme('dark')
    rerender(<ThemeInitializer />)
    
    await new Promise(resolve => setTimeout(resolve, 50))
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  it('resolves to OS preference when system is selected', () => {
    const originalMatchMedia = window.matchMedia
    window.matchMedia = vi.fn((query: string) => ({
      matches: query.includes('dark'),
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: () => false,
    })) as unknown as (query: string) => MediaQueryList

    useThemeStore.getState().setTheme('system')
    renderWithRouter(<ThemeInitializer />)
    
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    
    window.matchMedia = originalMatchMedia
  })

  it('sets data-theme to green when green theme is selected', () => {
    useThemeStore.getState().setTheme('green')
    renderWithRouter(<ThemeInitializer />)
    
    expect(document.documentElement.getAttribute('data-theme')).toBe('green')
  })

  it('sets data-theme to blue when blue theme is selected', () => {
    useThemeStore.getState().setTheme('blue')
    renderWithRouter(<ThemeInitializer />)
    
    expect(document.documentElement.getAttribute('data-theme')).toBe('blue')
  })

  it('sets data-theme to orange when orange theme is selected', () => {
    useThemeStore.getState().setTheme('orange')
    renderWithRouter(<ThemeInitializer />)
    
    expect(document.documentElement.getAttribute('data-theme')).toBe('orange')
  })
})

describe('OS preference change listener', () => {
  it('listens for OS changes when theme is system', () => {
    const originalMatchMedia = window.matchMedia
    const mockAddEventListener = vi.fn()
    const mockRemoveEventListener = vi.fn()
    
    window.matchMedia = vi.fn((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener,
      dispatchEvent: () => false,
    })) as unknown as (query: string) => MediaQueryList

    useThemeStore.getState().setTheme('system')
    renderWithRouter(<ThemeInitializer />)
    
    expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function))
    
    window.matchMedia = originalMatchMedia
  })

  it('does not listen when theme is explicit', () => {
    const originalMatchMedia = window.matchMedia
    const mockAddEventListener = vi.fn()
    
    window.matchMedia = vi.fn((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: mockAddEventListener,
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })) as unknown as (query: string) => MediaQueryList

    useThemeStore.getState().setTheme('dark')
    renderWithRouter(<ThemeInitializer />)
    
    expect(mockAddEventListener).not.toHaveBeenCalled()
    
    window.matchMedia = originalMatchMedia
  })
})

describe('theme persistence', () => {
  it('persists across page reload via localStorage', () => {
    useThemeStore.getState().setTheme('sepia')
    
    const serialized = localStorage.getItem('bible-app-theme')
    expect(serialized).toBeDefined()
    
    const parsed = JSON.parse(serialized!)
    expect(parsed.state.preference).toBe('sepia')
  })

  it('persists green theme across page reload', () => {
    useThemeStore.getState().setTheme('green')
    
    const serialized = localStorage.getItem('bible-app-theme')
    expect(serialized).toBeDefined()
    
    const parsed = JSON.parse(serialized!)
    expect(parsed.state.preference).toBe('green')
  })

  it('persists blue theme across page reload', () => {
    useThemeStore.getState().setTheme('blue')
    
    const serialized = localStorage.getItem('bible-app-theme')
    expect(serialized).toBeDefined()
    
    const parsed = JSON.parse(serialized!)
    expect(parsed.state.preference).toBe('blue')
  })

  it('persists orange theme across page reload', () => {
    useThemeStore.getState().setTheme('orange')
    
    const serialized = localStorage.getItem('bible-app-theme')
    expect(serialized).toBeDefined()
    
    const parsed = JSON.parse(serialized!)
    expect(parsed.state.preference).toBe('orange')
  })

  it('manual override persists and overrides OS preference', () => {
    useThemeStore.getState().setTheme('dark')
    
    useThemeStore.setState({ preference: 'system' as const })
    
    useThemeStore.getState().setTheme('dark')
    expect(useThemeStore.getState().preference).toBe('dark')
  })
})


