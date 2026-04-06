import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router'
import { AppShell } from '@/components/layout/AppShell'

describe('App', () => {
  it('renders app shell with main content area', () => {
    render(
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>,
    )
    expect(screen.getByTestId('main-content')).toBeInTheDocument()
  })
})
