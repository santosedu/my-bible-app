import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import { AppShell } from '@/components/layout/AppShell'
import { ThemeInitializer } from '@/components/layout/ThemeInitializer'
import { ErrorBoundary } from '@/components/layout/ErrorBoundary'
import {
  RootRedirect,
  ChapterSelectionPage,
  ChapterPage,
  ProgressPage,
} from '@/components/pages'
import { SearchPage } from '@/components/search/SearchPage'
import './index.css'

export function AppLayout() {
  return (
    <>
      <ThemeInitializer />
      <AppShell />
    </>
  )
}

export function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<RootRedirect />} />
          <Route path="/:bookId" element={<ChapterSelectionPage />} />
          <Route path="/:bookId/:chapter" element={<ChapterPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/progress" element={<ProgressPage />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
