import { describe, it, expect } from 'vitest'
import type { BookMeta } from '@/types'

describe('path alias resolution', () => {
  it('should resolve @/types import correctly', () => {
    const book: BookMeta = { id: 'genesis', name: 'Gênesis', abbrev: 'Gn', testament: 'old', chapters: 50 }
    expect(book.id).toBe('genesis')
    expect(book.name).toBe('Gênesis')
  })
})
