import { useState, useEffect, useRef } from 'react'

interface NoteEditorProps {
  initialText?: string
  onSave: (text: string) => void
  onCancel: () => void
  onDelete?: () => void
  isEditing?: boolean
}

export function NoteEditor({
  initialText = '',
  onSave,
  onCancel,
  onDelete,
  isEditing = false,
}: NoteEditorProps) {
  const [text, setText] = useState(initialText)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  useEffect(() => {
    setText(initialText)
  }, [initialText])

  const handleSave = () => {
    const trimmed = text.trim()
    if (trimmed) {
      onSave(trimmed)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel()
    }
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSave()
    }
  }

  return (
    <div
      data-testid="note-editor"
      className="flex flex-col gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3"
    >
      <textarea
        ref={textareaRef}
        data-testid="note-editor-textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Adicione uma nota..."
        rows={3}
        className="font-footnote w-full resize-none rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-2 text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50"
        aria-label="Texto da nota"
      />
      <div className="flex items-center justify-between">
        <span className="font-footnote text-[var(--color-text-muted)]">
          Ctrl+Enter para salvar
        </span>
        <div className="flex items-center gap-2">
          {isEditing && onDelete && (
            <button
              data-testid="note-editor-delete"
              onClick={onDelete}
              className="btn-ghost text-[var(--color-text-muted)]"
              aria-label="Excluir nota"
              type="button"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <path d="M2 4h12M5.333 4V2.667a1.333 1.333 0 0 1 1.334-1.334h2.666a1.333 1.333 0 0 1 1.334 1.334V4m2 0v9.333a1.333 1.333 0 0 1-1.334 1.334H4.667a1.333 1.333 0 0 1-1.334-1.334V4h9.334z" />
              </svg>
            </button>
          )}
          <button
            data-testid="note-editor-cancel"
            onClick={onCancel}
            className="btn-ghost text-[var(--color-text-muted)]"
            aria-label="Cancelar"
            type="button"
          >
            Cancelar
          </button>
          <button
            data-testid="note-editor-save"
            onClick={handleSave}
            disabled={!text.trim()}
            className="btn-primary text-xs"
            type="button"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  )
}
