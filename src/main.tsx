import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import { AppShell } from '@/components/layout/AppShell'
import { ThemeInitializer } from '@/components/layout/ThemeInitializer'
import {
  RootRedirect,
  BookRedirect,
  ChapterPage,
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
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<RootRedirect />} />
        <Route path="/:bookId" element={<BookRedirect />} />
        <Route path="/:bookId/:chapter" element={<ChapterPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Route>
    </Routes>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
