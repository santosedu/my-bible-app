import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router'
import userEvent from '@testing-library/user-event'
import { CrossReferenceIndicator } from '@/components/study/CrossReferenceIndicator'
import { CrossReferencePanel } from '@/components/study/CrossReferencePanel'
import type { BibleRef } from '@/types'

function renderWithRouter(ui: React.ReactElement) {
  return render(<BrowserRouter>{ui}</BrowserRouter>)
}

describe('CrossReferenceIndicator', () => {
  it('renders nothing when hasCrossReferences is false', () => {
    const onClick = vi.fn()
    render(<CrossReferenceIndicator onClick={onClick} hasCrossReferences={false} />)
    
    expect(screen.queryByTestId('cross-reference-indicator')).toBeNull()
  })

  it('does not call onClick when hasCrossReferences is false', () => {
    const onClick = vi.fn()
    render(<CrossReferenceIndicator onClick={onClick} hasCrossReferences={false} />)
    
    expect(onClick).not.toHaveBeenCalled()
  })

  it('renders indicator when hasCrossReferences is true', () => {
    const onClick = vi.fn()
    render(<CrossReferenceIndicator onClick={onClick} hasCrossReferences={true} />)
    
    expect(screen.getByTestId('cross-reference-indicator')).toBeDefined()
  })

  it('calls onClick when indicator is clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<CrossReferenceIndicator onClick={onClick} hasCrossReferences={true} />)
    
    const indicator = screen.getByTestId('cross-reference-indicator')
    await user.click(indicator)
    
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('has correct aria attributes', () => {
    const onClick = vi.fn()
    render(<CrossReferenceIndicator onClick={onClick} hasCrossReferences={true} />)
    
    const indicator = screen.getByTestId('cross-reference-indicator')
    expect(indicator.getAttribute('aria-label')).toBe('Ver referências cruzadas')
    expect(indicator.getAttribute('title')).toBe('Referências cruzadas')
    expect(indicator.getAttribute('type')).toBe('button')
  })
})

describe('CrossReferencePanel', () => {
  const mockReferences: BibleRef[] = [
    { bookId: 'genesis', chapter: 1, verse: 1 },
    { bookId: 'john', chapter: 1, verse: 1 },
  ]

  it('renders nothing when isOpen is false', () => {
    const onClose = vi.fn()
    renderWithRouter(
      <CrossReferencePanel references={mockReferences} isOpen={false} onClose={onClose} />
    )
    
    expect(screen.queryByTestId('cross-reference-panel')).toBeNull()
  })

  it('renders panel when isOpen is true', () => {
    const onClose = vi.fn()
    renderWithRouter(
      <CrossReferencePanel references={mockReferences} isOpen={true} onClose={onClose} />
    )
    
    expect(screen.getByTestId('cross-reference-panel')).toBeDefined()
  })

  it('displays title and count', () => {
    const onClose = vi.fn()
    renderWithRouter(
      <CrossReferencePanel references={mockReferences} isOpen={true} onClose={onClose} />
    )
    
    expect(screen.getByTestId('cross-reference-panel-title')).toBeDefined()
    expect(screen.getByTestId('cross-reference-panel-count')).toBeDefined()
  })

  it('displays all references with book/chapter/verse', () => {
    const onClose = vi.fn()
    renderWithRouter(
      <CrossReferencePanel references={mockReferences} isOpen={true} onClose={onClose} />
    )
    
    const items = screen.getAllByTestId('cross-reference-item')
    expect(items).toHaveLength(2)
  })

  it('displays verse text for each reference', () => {
    const onClose = vi.fn()
    renderWithRouter(
      <CrossReferencePanel references={mockReferences} isOpen={true} onClose={onClose} />
    )
    
    const textElements = screen.getAllByTestId('cross-reference-text')
    expect(textElements.length).toBeGreaterThan(0)
  })

  it('shows empty state when no references', () => {
    const onClose = vi.fn()
    renderWithRouter(
      <CrossReferencePanel references={[]} isOpen={true} onClose={onClose} />
    )
    
    expect(screen.getByTestId('cross-reference-panel-empty')).toBeDefined()
  })

  it('closes on Escape key', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    renderWithRouter(
      <CrossReferencePanel references={mockReferences} isOpen={true} onClose={onClose} />
    )
    
    await user.keyboard('{Escape}')
    
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('navigates to referenced passage when clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <MemoryRouter initialEntries={['/genesis/1']}>
        <Routes>
          <Route path="/:bookId/:chapter" element={
            <CrossReferencePanel references={mockReferences} isOpen={true} onClose={onClose} />
          } />
        </Routes>
      </MemoryRouter>,
    )
    
    const links = screen.getAllByTestId('cross-reference-link')
    await user.click(links[0])
    
    expect(onClose).toHaveBeenCalled()
  })
})
