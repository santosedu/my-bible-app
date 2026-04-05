import { describe, it, expect, beforeEach } from 'vitest'
import '../index.css'

const CSS_TOKENS: Record<string, string> = {
  bg: '--color-bg-value',
  surface: '--color-surface-value',
  'surface-raised': '--color-surface-raised-value',
  text: '--color-text-value',
  'text-secondary': '--color-text-secondary-value',
  'text-muted': '--color-text-muted-value',
  'verse-number': '--color-verse-number-value',
  accent: '--color-accent-value',
  'highlight-yellow': '--color-highlight-yellow-value',
  'highlight-green': '--color-highlight-green-value',
  'highlight-rose': '--color-highlight-rose-value',
  border: '--color-border-value',
}

const LIGHT_THEME: Record<string, string> = {
  bg: '#F5F0E8',
  surface: '#EDE8DE',
  'surface-raised': '#FAF7F2',
  text: '#2C1810',
  'text-secondary': '#6B5B4E',
  'text-muted': '#9C8E80',
  'verse-number': '#B8A99A',
  accent: '#C49A6C',
  'highlight-yellow': '#F5E6B8',
  'highlight-green': '#D4E8D0',
  'highlight-rose': '#F0D4D4',
  border: '#DDD5C9',
}

const DARK_THEME: Record<string, string> = {
  bg: '#1A1714',
  surface: '#252220',
  'surface-raised': '#2E2B28',
  text: '#E8DFD0',
  'text-secondary': '#A89B8C',
  'text-muted': '#7A6F63',
  'verse-number': '#5C534A',
  accent: '#D4A96A',
  'highlight-yellow': '#3D3520',
  'highlight-green': '#1F3320',
  'highlight-rose': '#3A2020',
  border: '#3A3633',
}

const SEPIA_THEME: Record<string, string> = {
  bg: '#F0E4CC',
  surface: '#E6D9BF',
  'surface-raised': '#F5EDDA',
  text: '#3E2F1C',
  'text-secondary': '#6B5740',
  'text-muted': '#9A876E',
  'verse-number': '#B09878',
  accent: '#B8864E',
  'highlight-yellow': '#E8D4A0',
  'highlight-green': '#C8DBBD',
  'highlight-rose': '#E8C8C8',
  border: '#D4C8AE',
}

function getComputedToken(tokenName: string, element: HTMLElement): string {
  return getComputedStyle(element).getPropertyValue(tokenName).trim()
}

function getAllStyleSheetsText(): string {
  const sheets = document.styleSheets
  let text = ''
  for (let i = 0; i < sheets.length; i++) {
    try {
      const rules = sheets[i].cssRules
      for (let j = 0; j < rules.length; j++) {
        text += rules[j].cssText
      }
    } catch {
      // cross-origin stylesheets may throw
    }
  }
  return text
}

describe('Design System: CSS Custom Properties', () => {
  let root: HTMLElement

  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme')
    root = document.documentElement
  })

  it('all CSS custom properties are defined in :root with correct light theme default values', () => {
    for (const [name, expected] of Object.entries(LIGHT_THEME)) {
      const cssVar = CSS_TOKENS[name]
      const actual = getComputedToken(cssVar, root)
      expect(actual, `Token ${name} should be ${expected}`).toBe(expected)
    }
  })

  it('dark theme overrides all color tokens when data-theme="dark" is set', () => {
    root.setAttribute('data-theme', 'dark')
    for (const [name, expected] of Object.entries(DARK_THEME)) {
      const cssVar = CSS_TOKENS[name]
      const actual = getComputedToken(cssVar, root)
      expect(actual, `Dark token ${name} should be ${expected}`).toBe(expected)
    }
  })

  it('sepia theme overrides all color tokens when data-theme="sepia" is set', () => {
    root.setAttribute('data-theme', 'sepia')
    for (const [name, expected] of Object.entries(SEPIA_THEME)) {
      const cssVar = CSS_TOKENS[name]
      const actual = getComputedToken(cssVar, root)
      expect(actual, `Sepia token ${name} should be ${expected}`).toBe(expected)
    }
  })

  it('typography tokens match DESIGN.md spec', () => {
    const style = getComputedStyle(root)

    expect(style.getPropertyValue('--font-reading').trim()).toContain('Crimson Pro')
    expect(style.getPropertyValue('--font-ui').trim()).toContain('DM Sans')
    expect(style.getPropertyValue('--fs-base').trim()).toBe('18px')
    expect(style.getPropertyValue('--fs-verse-number').trim()).toBe('0.65em')
    expect(style.getPropertyValue('--fs-book-title').trim()).toBe('1.6rem')
    expect(style.getPropertyValue('--fs-chapter-title').trim()).toBe('1.15rem')
    expect(style.getPropertyValue('--fs-ui').trim()).toBe('0.875rem')
    expect(style.getPropertyValue('--fs-footnote').trim()).toBe('0.8rem')
    expect(style.getPropertyValue('--leading-reading').trim()).toBe('1.9')
    expect(style.getPropertyValue('--max-w-reading').trim()).toBe('65ch')
  })

  it('prefers-reduced-motion media query is present in CSS', () => {
    const cssString = getAllStyleSheetsText()
    expect(cssString).toContain('prefers-reduced-motion')
    expect(cssString).toContain('transition-duration: 0.01ms')
    expect(cssString).toContain('animation-duration: 0.01ms')
  })

  it('theme attribute change triggers correct token updates in the DOM', () => {
    const bgToken = CSS_TOKENS.bg

    const lightValue = getComputedToken(bgToken, root)
    expect(lightValue).toBe(LIGHT_THEME.bg)

    root.setAttribute('data-theme', 'dark')
    const darkValue = getComputedToken(bgToken, root)
    expect(darkValue).toBe(DARK_THEME.bg)
    expect(darkValue).not.toBe(lightValue)

    root.setAttribute('data-theme', 'sepia')
    const sepiaValue = getComputedToken(bgToken, root)
    expect(sepiaValue).toBe(SEPIA_THEME.bg)
    expect(sepiaValue).not.toBe(darkValue)

    root.removeAttribute('data-theme')
    const restoredValue = getComputedToken(bgToken, root)
    expect(restoredValue).toBe(LIGHT_THEME.bg)
  })

  it('radius tokens are defined correctly', () => {
    const style = getComputedStyle(root)

    expect(style.getPropertyValue('--radius-pill').trim()).toBe('9999px')
    expect(style.getPropertyValue('--radius-md').trim()).toBe('8px')
    expect(style.getPropertyValue('--radius-lg').trim()).toBe('16px')
    expect(style.getPropertyValue('--radius-circle').trim()).toBe('32px')
  })

  it('all three theme selectors are present in the CSS', () => {
    const cssString = getAllStyleSheetsText()
    expect(cssString).toContain('[data-theme="dark"]')
    expect(cssString).toContain('[data-theme="sepia"]')
  })
})
