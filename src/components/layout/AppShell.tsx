import { Outlet } from 'react-router'
import { SidebarProvider, useSidebar } from './SidebarContext'
import { Header } from './Header'
import { BottomBar } from './BottomBar'
import { BookList } from '@/components/navigation/BookList'
import { BookmarksPanel } from '@/components/study/BookmarksPanel'

function Sidebar() {
  const { isOpen, close } = useSidebar()
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={close}
          onKeyDown={(e) => e.key === 'Escape' && close()}
          role="button"
          tabIndex={-1}
          aria-label="Fechar menu"
        />
      )}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-72 overflow-y-auto border-r border-[var(--color-border)] bg-[var(--color-bg)] transition-transform duration-300 ease-in-out lg:relative lg:z-auto lg:translate-x-0 lg:border-r ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        data-testid="sidebar"
      >
        <div className="p-4 pt-16 lg:pt-4">
          <BookList />
        </div>
      </aside>
    </>
  )
}

function StudyPanelPlaceholder() {
  return (
    <aside
      className="hidden xl:block w-80 border-l border-[var(--color-border)] bg-[var(--color-bg)] overflow-y-auto"
      data-testid="study-panel"
    >
      <div className="p-4">
        <BookmarksPanel />
      </div>
    </aside>
  )
}

function AppShellInner() {
  return (
    <div className="flex h-dvh flex-col bg-[var(--color-bg)] text-[var(--color-text)]">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main
          className="flex-1 overflow-y-auto"
          data-testid="main-content"
        >
          <div className="mx-auto max-w-3xl px-6 py-7">
            <Outlet />
          </div>
        </main>
        <StudyPanelPlaceholder />
      </div>
      <BottomBar />
    </div>
  )
}

export function AppShell() {
  return (
    <SidebarProvider>
      <AppShellInner />
    </SidebarProvider>
  )
}
