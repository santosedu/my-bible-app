import { useNavigate } from 'react-router'
import { useSidebar } from '@/components/layout/SidebarContext'
import type { BookMeta } from '@/types'

interface BookItemProps {
  book: BookMeta
  isActive: boolean
}

export function BookItem({ book, isActive }: BookItemProps) {
  const navigate = useNavigate()
  const { close } = useSidebar()

  function handleClick() {
    navigate(`/${book.id}`)
    close()
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      handleClick()
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault()
      const next = e.currentTarget.nextElementSibling as HTMLElement | null
      next?.focus()
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault()
      const prev = e.currentTarget.previousElementSibling as HTMLElement | null
      prev?.focus()
    }
  }

  return (
    <button
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`btn-nav w-full text-left text-sm ${
        isActive ? 'active' : ''
      }`}
      role="option"
      aria-selected={isActive}
      data-testid={`book-item-${book.id}`}
    >
      {book.abbrev}
    </button>
  )
}
