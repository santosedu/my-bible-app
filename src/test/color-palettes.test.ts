import { describe, it, expect, beforeEach } from 'vitest'
import '../index.css'

const COLOR_TOKENS = [
  '--color-bg-value',
  '--color-surface-value',
  '--color-surface-raised-value',
  '--color-text-value',
  '--color-text-secondary-value',
  '--color-text-muted-value',
  '--color-verse-number-value',
  '--color-accent-value',
  '--color-highlight-yellow-value',
  '--color-highlight-green-value',
  '--color-highlight-rose-value',
  '--color-border-value',
]

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

function getContrastRatio(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1)
  const rgb2 = hexToRgb(hex2)
  if (!rgb1 || !rgb2) return 0

  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b)
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b)

  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)

  return (lighter + 0.05) / (darker + 0.05)
}

const themeColors: Record<string, Record<string, string>> = {
  green: {
    '--color-bg-value': '#F8F9FA',
    '--color-text-value': '#081C15',
    '--color-accent-value': '#2D6A4F',
  },
  blue: {
    '--color-bg-value': '#FAF9F6',
    '--color-text-value': '#03045E',
    '--color-accent-value': '#0077B6',
  },
  orange: {
    '--color-bg-value': '#FFFDF9',
    '--color-text-value': '#3D2800',
    '--color-accent-value': '#CC6A00',
  },
}

describe('Green Theme Color Tokens', () => {
  beforeEach(() => {
    document.documentElement.setAttribute('data-theme', 'green')
  })

  it('defines all 12 color tokens on :root', () => {
    const style = getComputedStyle(document.documentElement)
    COLOR_TOKENS.forEach((token) => {
      const value = style.getPropertyValue(token).trim()
      expect(value).toBeDefined()
      expect(value).not.toBe('')
    })
  })

  it('meets WCAG AA contrast for text on background', () => {
    const bg = themeColors.green['--color-bg-value']
    const text = themeColors.green['--color-text-value']
    const ratio = getContrastRatio(text, bg)
    expect(ratio).toBeGreaterThanOrEqual(4.5)
  })

  it('meets WCAG AA contrast for accent on background', () => {
    const bg = themeColors.green['--color-bg-value']
    const accent = themeColors.green['--color-accent-value']
    const ratio = getContrastRatio(accent, bg)
    expect(ratio).toBeGreaterThanOrEqual(3)
  })
})

describe('Blue Theme Color Tokens', () => {
  beforeEach(() => {
    document.documentElement.setAttribute('data-theme', 'blue')
  })

  it('defines all 12 color tokens on :root', () => {
    const style = getComputedStyle(document.documentElement)
    COLOR_TOKENS.forEach((token) => {
      const value = style.getPropertyValue(token).trim()
      expect(value).toBeDefined()
      expect(value).not.toBe('')
    })
  })

  it('meets WCAG AA contrast for text on background', () => {
    const bg = themeColors.blue['--color-bg-value']
    const text = themeColors.blue['--color-text-value']
    const ratio = getContrastRatio(text, bg)
    expect(ratio).toBeGreaterThanOrEqual(4.5)
  })

  it('meets WCAG AA contrast for accent on background', () => {
    const bg = themeColors.blue['--color-bg-value']
    const accent = themeColors.blue['--color-accent-value']
    const ratio = getContrastRatio(accent, bg)
    expect(ratio).toBeGreaterThanOrEqual(3)
  })
})

describe('Orange Theme Color Tokens', () => {
  beforeEach(() => {
    document.documentElement.setAttribute('data-theme', 'orange')
  })

  it('defines all 12 color tokens on :root', () => {
    const style = getComputedStyle(document.documentElement)
    COLOR_TOKENS.forEach((token) => {
      const value = style.getPropertyValue(token).trim()
      expect(value).toBeDefined()
      expect(value).not.toBe('')
    })
  })

  it('meets WCAG AA contrast for text on background', () => {
    const bg = themeColors.orange['--color-bg-value']
    const text = themeColors.orange['--color-text-value']
    const ratio = getContrastRatio(text, bg)
    expect(ratio).toBeGreaterThanOrEqual(4.5)
  })

  it('meets WCAG AA contrast for accent on background', () => {
    const bg = themeColors.orange['--color-bg-value']
    const accent = themeColors.orange['--color-accent-value']
    const ratio = getContrastRatio(accent, bg)
    expect(ratio).toBeGreaterThanOrEqual(3)
  })
})

describe('CSS variable integration', () => {
  it('green theme applies correct values to computed styles', () => {
    document.documentElement.setAttribute('data-theme', 'green')
    const style = getComputedStyle(document.documentElement)
    expect(style.getPropertyValue('--color-bg-value').trim()).toBe('#F8F9FA')
    expect(style.getPropertyValue('--color-accent-value').trim()).toBe('#2D6A4F')
  })

  it('blue theme applies correct values to computed styles', () => {
    document.documentElement.setAttribute('data-theme', 'blue')
    const style = getComputedStyle(document.documentElement)
    expect(style.getPropertyValue('--color-bg-value').trim()).toBe('#FAF9F6')
    expect(style.getPropertyValue('--color-accent-value').trim()).toBe('#0077B6')
  })

  it('orange theme applies correct values to computed styles', () => {
    document.documentElement.setAttribute('data-theme', 'orange')
    const style = getComputedStyle(document.documentElement)
    expect(style.getPropertyValue('--color-bg-value').trim()).toBe('#FFFDF9')
    expect(style.getPropertyValue('--color-accent-value').trim()).toBe('#CC6A00')
  })
})