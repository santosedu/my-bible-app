import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ErrorBoundary } from '@/components/layout/ErrorBoundary'

function BuggyComponent({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>No error</div>
}

describe('ErrorBoundary', () => {
  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    )
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('catches React errors and displays fallback UI', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    render(
      <ErrorBoundary>
        <BuggyComponent shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Algo deu errado')).toBeInTheDocument()
    expect(screen.getByText('Ocorreu um erro inesperado. Por favor, recarregue a página.')).toBeInTheDocument()
    expect(screen.getByText(/Test error/)).toBeInTheDocument()
    
    consoleError.mockRestore()
  })

  it('provides a reload button to recover', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const reloadMock = vi.fn()
    vi.stubGlobal('location', { reload: reloadMock })

    render(
      <ErrorBoundary>
        <BuggyComponent shouldThrow={true} />
      </ErrorBoundary>
    )

    const reloadButton = screen.getByRole('button', { name: /Recarregar página/i })
    expect(reloadButton).toBeInTheDocument()

    fireEvent.click(reloadButton)
    expect(reloadMock).toHaveBeenCalled()

    consoleError.mockRestore()
    vi.unstubAllGlobals()
  })

  it('has proper ARIA role for error announcement', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    render(
      <ErrorBoundary>
        <BuggyComponent shouldThrow={true} />
      </ErrorBoundary>
    )

    const errorContainer = screen.getByRole('alert')
    expect(errorContainer).toBeInTheDocument()
    
    consoleError.mockRestore()
  })
})