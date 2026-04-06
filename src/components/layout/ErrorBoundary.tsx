import { Component, type ReactNode, type ErrorInfo } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  handleClearAndReload = () => {
    try {
      localStorage.clear()
    } catch {
      // ignore storage errors
    }
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-[var(--color-bg)]"
        >
          <div className="max-w-md">
            <h1 className="font-book-title text-[var(--color-text)] mb-4">
              Algo deu errado
            </h1>
            <p className="font-ui text-[var(--color-text-secondary)] mb-6">
              Ocorreu um erro inesperado. Por favor, recarregue a página.
            </p>
            {this.state.error && (
              <p className="font-footnote text-[var(--color-text-muted)] mb-6">
                Erro: {this.state.error.message}
              </p>
            )}
            <div className="flex gap-3">
              <button
                onClick={this.handleReload}
                className="btn-primary"
                type="button"
              >
                Recarregar página
              </button>
              <button
                onClick={this.handleClearAndReload}
                className="btn-ghost"
                type="button"
              >
                Limpar dados e recarregar
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}