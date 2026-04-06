import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'
import type { ReactNode } from 'react'

interface SidebarContextValue {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
  sidebarRef: React.RefObject<HTMLElement | null>
}

const SidebarContext = createContext<SidebarContextValue | null>(null)

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const sidebarRef = useRef<HTMLElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  const open = useCallback(() => {
    previousFocusRef.current = document.activeElement as HTMLElement
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setTimeout(() => {
      previousFocusRef.current?.focus()
    }, 0)
  }, [])

  const toggle = useCallback(() => {
    if (isOpen) {
      setIsOpen(false)
      setTimeout(() => {
        previousFocusRef.current?.focus()
      }, 0)
    } else {
      previousFocusRef.current = document.activeElement as HTMLElement
      setIsOpen(true)
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen && sidebarRef.current) {
      const focusable = sidebarRef.current.querySelector<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
      focusable?.focus()
    }
  }, [isOpen])

  return (
    <SidebarContext.Provider value={{ isOpen, open, close, toggle, sidebarRef }}>
      {children}
    </SidebarContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSidebar() {
  const ctx = useContext(SidebarContext)
  if (!ctx) throw new Error('useSidebar must be used within SidebarProvider')
  return ctx
}
