import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter, Routes, Route } from 'react-router'
import type { ReactNode } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { Header } from '@/components/layout/Header'
import { BottomBar } from '@/components/layout/BottomBar'
import { ThemeInitializer } from '@/components/layout/ThemeInitializer'
import { SidebarProvider } from '@/components/layout/SidebarContext'
import { useBibleStore, useThemeStore } from '@/stores'

function renderWithRouter(ui: ReactNode, { route = '/' } = {}) {
  window.history.pushState({}, 'Test', route)
  return render(
    <BrowserRouter>
      <Routes>
        <Route element={ui}>
          <Route path="*" element={<div data-testid="child-route">child</div>} />
        </Route>
      </Routes>
    </BrowserRouter>,
  )
}

function renderWithSidebar(ui: ReactNode, { route = '/' } = {}) {
  window.history.pushState({}, 'Test', route)
  return render(
    <BrowserRouter>
      <SidebarProvider>{ui}</SidebarProvider>
    </BrowserRouter>,
  )
}

beforeEach(() => {
  localStorage.clear()
  useBibleStore.setState({
    bookId: null,
    chapter: null,
    activeTranslation: 'ara',
    comparisonTranslations: [],
    comparisonMode: false,
  })
  useThemeStore.setState({ preference: 'system' })
})

describe('AppShell', () => {
  it('renders sidebar, main content, and study panel zones', () => {
    renderWithRouter(<AppShell />)
    expect(screen.getByTestId('sidebar')).toBeDefined()
    expect(screen.getByTestId('main-content')).toBeDefined()
    expect(screen.getByTestId('study-panel')).toBeDefined()
  })

  it('renders header', () => {
    renderWithRouter(<AppShell />)
    expect(screen.getByTestId('header')).toBeDefined()
  })

  it('renders bottom bar', () => {
    renderWithRouter(<AppShell />)
    expect(screen.getByTestId('bottom-bar')).toBeDefined()
  })

  it('renders child route via Outlet', () => {
    renderWithRouter(<AppShell />)
    expect(screen.getByTestId('child-route')).toBeDefined()
  })
})

describe('Header', () => {
  it('displays default title when no book is selected', () => {
    renderWithSidebar(<Header />, { route: '/' })
    expect(screen.getByText('Minha Bíblia')).toBeDefined()
  })

  it('displays current book and chapter from bibleStore', () => {
    useBibleStore.setState({ bookId: 'genesis', chapter: 1 })
    renderWithSidebar(<Header />, { route: '/genesis/1' })
    expect(screen.getByTestId('header-location')).toBeDefined()
    expect(screen.getByText('1')).toBeDefined()
  })

  it('hamburger button exists on mobile', () => {
    renderWithSidebar(<Header />)
    expect(screen.getByTestId('hamburger-btn')).toBeDefined()
  })
})

describe('BottomBar', () => {
  it('renders on mobile viewport', () => {
    renderWithSidebar(<BottomBar />)
    expect(screen.getByTestId('bottom-bar')).toBeDefined()
  })

  it('has navigation buttons', () => {
    renderWithSidebar(<BottomBar />)
    expect(screen.getByLabelText('Livros')).toBeDefined()
    expect(screen.getByLabelText('Buscar')).toBeDefined()
    expect(screen.getByLabelText('Progresso')).toBeDefined()
  })
})

describe('Sidebar', () => {
  it('opens on hamburger toggle', async () => {
    const user = userEvent.setup()
    renderWithRouter(<AppShell />)

    const hamburger = screen.getByTestId('hamburger-btn')
    await user.click(hamburger)

    await waitFor(() => {
      expect(screen.getByTestId('sidebar').classList.contains('translate-x-0')).toBe(true)
    })
  })

  it('closes on backdrop click', async () => {
    const user = userEvent.setup()
    renderWithRouter(<AppShell />)

    const hamburger = screen.getByTestId('hamburger-btn')
    await user.click(hamburger)

    await waitFor(() => {
      expect(screen.getByTestId('sidebar').classList.contains('translate-x-0')).toBe(true)
    })

    const backdrop = screen.getByLabelText('Fechar menu')
    await user.click(backdrop)

    await waitFor(() => {
      expect(screen.getByTestId('sidebar').classList.contains('-translate-x-full')).toBe(true)
    })
  })
})

describe('Theme', () => {
  it('data-theme attribute is set based on themeStore', () => {
    useThemeStore.setState({ preference: 'dark' })
    render(<BrowserRouter><ThemeInitializer /></BrowserRouter>)
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  it('data-theme updates when theme changes', async () => {
    render(<BrowserRouter><ThemeInitializer /></BrowserRouter>)

    await waitFor(() => {
      expect(document.documentElement.getAttribute('data-theme')).toBe('light')
    })

    useThemeStore.setState({ preference: 'sepia' })

    await waitFor(() => {
      expect(document.documentElement.getAttribute('data-theme')).toBe('sepia')
    })
  })
})
