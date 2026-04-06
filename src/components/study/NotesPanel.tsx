import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { useStudyStore } from '@/stores'
import { getBook } from '@/data/bibleData'
import { NoteEditor } from './NoteEditor'
import type { Note } from '@/types'

function formatVerseRange(startVerse: number, endVerse: number | null): string {
  if (endVerse === null || startVerse === endVerse) {
    return `v. ${startVerse}`
  }
  return `vv. ${startVerse}–${endVerse}`
}

function formatTimestamp(updatedAt: number): string {
  const date = new Date(updatedAt)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

interface NoteCardProps {
  note: Note
  onUpdate: (id: string, text: string) => void
  onDelete: (id: string) => void
}

function NoteCard({ note, onUpdate, onDelete }: NoteCardProps) {
  const [editing, setEditing] = useState(false)
  const navigate = useNavigate()
  const bookMeta = getBook(note.bookId)
  const bookName = bookMeta?.name ?? note.bookId.replace(/-/g, ' ')

  const handleNavigate = () => {
    navigate(`/${note.bookId}/${note.chapter}`)
  }

  return (
    <div
      data-testid="note-card"
      data-note-id={note.id}
      className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3"
    >
      <div className="mb-2 flex items-center justify-between">
        <button
          data-testid="note-card-reference"
          onClick={handleNavigate}
          className="font-ui text-xs text-[var(--color-accent)] hover:underline"
          type="button"
        >
          {bookName} {note.chapter} — {formatVerseRange(note.startVerse, note.endVerse)}
        </button>
        <span className="font-footnote text-[var(--color-text-muted)]">
          {formatTimestamp(note.updatedAt)}
        </span>
      </div>

      {editing ? (
        <NoteEditor
          initialText={note.text}
          onSave={(text) => {
            onUpdate(note.id, text)
            setEditing(false)
          }}
          onCancel={() => setEditing(false)}
          onDelete={() => {
            onDelete(note.id)
            setEditing(false)
          }}
          isEditing
        />
      ) : (
        <>
          <p
            data-testid="note-card-text"
            className="font-footnote whitespace-pre-wrap text-[var(--color-text-secondary)]"
          >
            {note.text}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <button
              data-testid="note-card-edit"
              onClick={() => setEditing(true)}
              className="btn-ghost text-[var(--color-text-muted)]"
              type="button"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11.333 2A2.667 2.667 0 0 1 14 4.667v8.666A2.667 2.667 0 0 1 11.333 16H4.667A2.667 2.667 0 0 1 2 13.333V4.667A2.667 2.667 0 0 1 4.667 2h6.666z" />
                <path d="M10.333 2.333L13.667 5.667" />
              </svg>
              Editar
            </button>
            <button
              data-testid="note-card-delete"
              onClick={() => onDelete(note.id)}
              className="btn-ghost text-[var(--color-text-muted)]"
              type="button"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <path d="M2 4h12M5.333 4V2.667a1.333 1.333 0 0 1 1.334-1.334h2.666a1.333 1.333 0 0 1 1.334 1.334V4m2 0v9.333a1.333 1.333 0 0 1-1.334 1.334H4.667a1.333 1.333 0 0 1-1.334-1.334V4h9.334z" />
              </svg>
              Excluir
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export function NotesPanel() {
  const notes = useStudyStore((s) => s.notes)
  const updateNote = useStudyStore((s) => s.updateNote)
  const deleteNote = useStudyStore((s) => s.deleteNote)

  const sortedNotes = useMemo(
    () =>
      [...notes].sort((a, b) => b.updatedAt - a.updatedAt),
    [notes],
  )

  if (notes.length === 0) {
    return (
      <div data-testid="notes-panel-empty" className="py-8 text-center">
        <p className="font-ui text-sm text-[var(--color-text-muted)]">
          Nenhuma nota ainda.
        </p>
        <p className="font-footnote mt-1 text-[var(--color-text-muted)]">
          Selecione um versículo e adicione uma nota.
        </p>
      </div>
    )
  }

  return (
    <div data-testid="notes-panel" className="flex flex-col gap-3">
      <div className="mb-1 flex items-center justify-between">
        <h2
          data-testid="notes-panel-title"
          className="font-ui text-sm font-semibold text-[var(--color-text)]"
        >
          Minhas Notas
        </h2>
        <span
          data-testid="notes-panel-count"
          className="font-footnote text-[var(--color-text-muted)]"
        >
          {notes.length} {notes.length === 1 ? 'nota' : 'notas'}
        </span>
      </div>
      {sortedNotes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onUpdate={updateNote}
          onDelete={deleteNote}
        />
      ))}
    </div>
  )
}
