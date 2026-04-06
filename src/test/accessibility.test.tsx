import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter, Routes, Route } from 'react-router'
import { AppShell } from '@/components/layout/AppShell'
import { useBibleStore, useThemeStore } from '@/stores'

function renderWithRouter(ui: React.ReactNode, { route = '/' } = {}) {
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

describe('Accessibility - Keyboard Navigation', () => {
  it('sidebar books are interactive and selectable', async () => {
    const user = userEvent.setup()
    renderWithRouter(<AppShell />)

    const hamburger = screen.getByTestId('hamburger-btn')
    await user.click(hamburger)

    await waitFor(() => {
      expect(screen.getByTestId('sidebar').classList.contains('translate-x-0')).toBe(true)
    })

    const firstBook = screen.getByTestId('book-item-genesis')
    expect(firstBook).toBeVisible()
    expect(firstBook).toHaveAttribute('aria-selected', 'false')

    await user.click(firstBook)
  })

  it('Escape closes sidebar', async () => {
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

describe('Accessibility - ARIA', () => {
  it('all interactive elements have accessible names', () => {
    renderWithRouter(<AppShell />)

    expect(screen.getByLabelText('Abrir menu de livros')).toBeDefined()
    expect(screen.getByLabelText('Selecionar tema')).toBeDefined()
    expect(screen.getByLabelText('Livros')).toBeDefined()
    expect(screen.getAllByLabelText('Buscar').length).toBeGreaterThan(0)
    expect(screen.getByLabelText('Progresso')).toBeDefined()
  })

  it('theme toggle has radiogroup role', () => {
    renderWithRouter(<AppShell />)
    const themeToggle = screen.getByRole('radiogroup', { name: 'Selecionar tema' })
    expect(themeToggle).toBeDefined()
  })

  it('sidebar has accessible label', () => {
    renderWithRouter(<AppShell />)
    const sidebar = screen.getByTestId('sidebar')
    expect(sidebar).toHaveAttribute('aria-label', 'Lista de livros')
  })

  it('book list has accessible name', () => {
    renderWithRouter(<AppShell />)
    const bookList = screen.getByTestId('book-list')
    expect(bookList).toHaveAttribute('aria-label', 'Navegação de livros')
  })
})

describe('Accessibility - Focus Management', () => {
  it('focus moves to sidebar when opened', async () => {
    const user = userEvent.setup()
    renderWithRouter(<AppShell />)

    const hamburger = screen.getByTestId('hamburger-btn')
    await user.click(hamburger)

    await waitFor(() => {
      const sidebar = screen.getByTestId('sidebar')
      const firstButton = sidebar.querySelector('button')
      expect(document.activeElement).toBe(firstButton)
    })
  })

  it('focus returns to hamburger when sidebar closes', async () => {
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
      expect(document.activeElement).toBe(hamburger)
    })
  })
})

describe('Responsive Layout', () => {
  it('renders correctly at mobile viewport', () => {
    Object.defineProperty(window, 'innerWidth', { value: 320, writable: true })
    Object.defineProperty(window, 'innerHeight', { value: 568, writable: true })

    renderWithRouter(<AppShell />)

    expect(screen.getByTestId('hamburger-btn')).toBeVisible()
    expect(screen.getByTestId('bottom-bar')).toBeVisible()
    expect(screen.getByTestId('sidebar')).toBeDefined()
  })

  it('renders correctly at tablet viewport', () => {
    Object.defineProperty(window, 'innerWidth', { value: 768, writable: true })
    Object.defineProperty(window, 'innerHeight', { value: 1024, writable: true })

    renderWithRouter(<AppShell />)

    expect(screen.getByTestId('sidebar')).toBeDefined()
  })

  it('renders correctly at desktop viewport', () => {
    Object.defineProperty(window, 'innerWidth', { value: 1280, writable: true })
    Object.defineProperty(window, 'innerHeight', { value: 800, writable: true })

    renderWithRouter(<AppShell />)

    expect(screen.getByTestId('sidebar')).toBeDefined()
    expect(screen.getByTestId('study-panel')).toBeDefined()
  })
})