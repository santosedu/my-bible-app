import { describe, it, expect } from 'vitest'
import type { PlaceholderType } from '@/types'

describe('path alias resolution', () => {
  it('should resolve @/types import correctly', () => {
    const placeholder: PlaceholderType = { id: '1', name: 'test' }
    expect(placeholder.id).toBe('1')
    expect(placeholder.name).toBe('test')
  })
})
