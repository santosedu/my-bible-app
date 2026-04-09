import { useState } from 'react'
import { BookmarksPanel } from '@/components/study/BookmarksPanel'
import { NotesPanel } from '@/components/study/NotesPanel'

type StudyTab = 'bookmarks' | 'notes'

interface StudyPanelProps {
  defaultTab?: StudyTab
}

export function StudyPanel({ defaultTab = 'bookmarks' }: StudyPanelProps) {
  const [activeTab, setActiveTab] = useState<StudyTab>(defaultTab)

  return (
    <div data-testid="study-panel" className="flex flex-col h-full">
      <div className="flex gap-1 mb-3" role="tablist" aria-label="Painel de estudo">
        <button
          data-testid="study-tab-bookmarks"
          role="tab"
          aria-selected={activeTab === 'bookmarks'}
          aria-controls="study-panel-bookmarks"
          onClick={() => setActiveTab('bookmarks')}
          className={`chip ${activeTab === 'bookmarks' ? 'active' : ''}`}
        >
          Marcadores
        </button>
        <button
          data-testid="study-tab-notes"
          role="tab"
          aria-selected={activeTab === 'notes'}
          aria-controls="study-panel-notes"
          onClick={() => setActiveTab('notes')}
          className={`chip ${activeTab === 'notes' ? 'active' : ''}`}
        >
          Notas
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'bookmarks' ? (
          <div id="study-panel-bookmarks" role="tabpanel">
            <BookmarksPanel />
          </div>
        ) : (
          <div id="study-panel-notes" role="tabpanel">
            <NotesPanel />
          </div>
        )}
      </div>
    </div>
  )
}
