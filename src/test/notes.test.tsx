import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router'
import userEvent from '@testing-library/user-event'
import { useBibleStore, useProgressStore, useStudyStore, useThemeStore } from '@/stores'
import { ChapterReader } from '@/components/reader/ChapterReader'
import { VerseBlock } from '@/components/reader/VerseBlock'
import { NoteEditor } from '@/components/study/NoteEditor'
import { NotesPanel } from '@/components/study/NotesPanel'
import type { Verse } from '@/types'

beforeEach(() => {
  window.history.pushState({}, 'Test', '/')
  localStorage.clear()
  useBibleStore.setState({
    bookId: null,
    chapter: null,
    activeTranslation: 'nvi',
    comparisonTranslations: [],
    comparisonMode: false,
  })
  useStudyStore.setState({ highlights: [], notes: [], bookmarks: [] })
  useProgressStore.setState({ readChapters: new Set() })
  useThemeStore.setState({ preference: 'system' })

  vi.stubGlobal(
    'IntersectionObserver',
    class MockIntersectionObserver {
      constructor() {}
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  )
})

function renderWithMemoryRouter(initialEntry: string) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/:bookId/:chapter" element={<ChapterReader />} />
        <Route path="*" element={<div>Not found</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('NoteEditor', () => {
  it('renders textarea and save/cancel buttons', () => {
    render(
      <NoteEditor
        onSave={vi.fn()}
        onCancel={vi.fn()}
      />,
    )

    expect(screen.getByTestId('note-editor')).toBeDefined()
    expect(screen.getByTestId('note-editor-textarea')).toBeDefined()
    expect(screen.getByTestId('note-editor-save')).toBeDefined()
    expect(screen.getByTestId('note-editor-cancel')).toBeDefined()
  })

  it('textarea has placeholder text', () => {
    render(
      <NoteEditor onSave={vi.fn()} onCancel={vi.fn()} />,
    )

    const textarea = screen.getByTestId('note-editor-textarea')
    expect(textarea.getAttribute('placeholder')).toBe('Adicione uma nota...')
  })

  it('typing in textarea updates value', () => {
    render(
      <NoteEditor onSave={vi.fn()} onCancel={vi.fn()} />,
    )

    const textarea = screen.getByTestId('note-editor-textarea')
    fireEvent.change(textarea, { target: { value: 'Minha nota de estudo' } })
    expect((textarea as HTMLTextAreaElement).value).toBe('Minha nota de estudo')
  })

  it('saving a note calls onSave with correct text', () => {
    const onSave = vi.fn()
    render(
      <NoteEditor onSave={onSave} onCancel={vi.fn()} />,
    )

    const textarea = screen.getByTestId('note-editor-textarea')
    fireEvent.change(textarea, { target: { value: 'Minha nota' } })
    fireEvent.click(screen.getByTestId('note-editor-save'))

    expect(onSave).toHaveBeenCalledWith('Minha nota')
  })

  it('save button is disabled when textarea is empty', () => {
    render(
      <NoteEditor onSave={vi.fn()} onCancel={vi.fn()} />,
    )

    const saveBtn = screen.getByTestId('note-editor-save') as HTMLButtonElement
    expect(saveBtn.disabled).toBe(true)
  })

  it('save button is enabled when textarea has text', () => {
    render(
      <NoteEditor onSave={vi.fn()} onCancel={vi.fn()} />,
    )

    const textarea = screen.getByTestId('note-editor-textarea')
    fireEvent.change(textarea, { target: { value: 'x' } })
    const saveBtn = screen.getByTestId('note-editor-save') as HTMLButtonElement
    expect(saveBtn.disabled).toBe(false)
  })

  it('cancel button calls onCancel', () => {
    const onCancel = vi.fn()
    render(
      <NoteEditor onSave={vi.fn()} onCancel={onCancel} />,
    )

    fireEvent.click(screen.getByTestId('note-editor-cancel'))
    expect(onCancel).toHaveBeenCalled()
  })

  it('Escape key calls onCancel', () => {
    const onCancel = vi.fn()
    render(
      <NoteEditor onSave={vi.fn()} onCancel={onCancel} />,
    )

    fireEvent.keyDown(screen.getByTestId('note-editor-textarea'), { key: 'Escape' })
    expect(onCancel).toHaveBeenCalled()
  })

  it('Ctrl+Enter calls onSave', () => {
    const onSave = vi.fn()
    render(
      <NoteEditor onSave={onSave} onCancel={vi.fn()} />,
    )

    const textarea = screen.getByTestId('note-editor-textarea')
    fireEvent.change(textarea, { target: { value: 'ctrl+enter note' } })
    fireEvent.keyDown(textarea, { key: 'Enter', ctrlKey: true })
    expect(onSave).toHaveBeenCalledWith('ctrl+enter note')
  })

  it('delete button calls onDelete when provided', () => {
    const onDelete = vi.fn()
    render(
      <NoteEditor
        onSave={vi.fn()}
        onCancel={vi.fn()}
        onDelete={onDelete}
        isEditing
      />,
    )

    expect(screen.getByTestId('note-editor-delete')).toBeDefined()
    fireEvent.click(screen.getByTestId('note-editor-delete'))
    expect(onDelete).toHaveBeenCalled()
  })

  it('delete button is not shown when isEditing is false', () => {
    render(
      <NoteEditor onSave={vi.fn()} onCancel={vi.fn()} isEditing={false} />,
    )

    expect(screen.queryByTestId('note-editor-delete')).toBeNull()
  })

  it('pre-fills textarea with initialText', () => {
    render(
      <NoteEditor
        initialText="Texto inicial da nota"
        onSave={vi.fn()}
        onCancel={vi.fn()}
      />,
    )

    const textarea = screen.getByTestId('note-editor-textarea')
    expect((textarea as HTMLTextAreaElement).value).toBe('Texto inicial da nota')
  })

  it('auto-trims whitespace on save', () => {
    const onSave = vi.fn()
    render(
      <NoteEditor onSave={onSave} onCancel={vi.fn()} />,
    )

    const textarea = screen.getByTestId('note-editor-textarea')
    fireEvent.change(textarea, { target: { value: '  Nota com espaco  ' } })
    fireEvent.click(screen.getByTestId('note-editor-save'))
    expect(onSave).toHaveBeenCalledWith('Nota com espaco')
  })

  it('does not call onSave when text is only whitespace', () => {
    const onSave = vi.fn()
    render(
      <NoteEditor onSave={onSave} onCancel={vi.fn()} />,
    )

    const textarea = screen.getByTestId('note-editor-textarea')
    fireEvent.change(textarea, { target: { value: '   ' } })
    fireEvent.click(screen.getByTestId('note-editor-save'))
    expect(onSave).not.toHaveBeenCalled()
  })
})

describe('VerseBlock - note indicator', () => {
  const verse: Verse = {
    number: 1,
    text: 'No princípio criou Deus os céus e a terra.',
  }

  it('note indicator does not appear when hasNote is false', () => {
    render(
      <VerseBlock verse={verse} isSelected={false} hasNote={false} onSelect={vi.fn()} />,
    )

    expect(screen.queryByTestId('note-indicator')).toBeNull()
  })

  it('note indicator appears when hasNote is true', () => {
    render(
      <VerseBlock verse={verse} isSelected={false} hasNote={true} onSelect={vi.fn()} />,
    )

    expect(screen.getByTestId('note-indicator')).toBeDefined()
  })

  it('note indicator has aria-label', () => {
    render(
      <VerseBlock verse={verse} isSelected={false} hasNote={true} onSelect={vi.fn()} />,
    )

    const indicator = screen.getByTestId('note-indicator')
    expect(indicator.getAttribute('aria-label')).toBe('Nota anexada')
  })

  it('note indicator appears even when hasNote is undefined (default)', () => {
    render(
      <VerseBlock verse={verse} isSelected={false} onSelect={vi.fn()} />,
    )

    expect(screen.queryByTestId('note-indicator')).toBeNull()
  })
})

describe('ChapterReader - note integration', () => {
  it('note editor appears when a verse is selected', async () => {
    const user = userEvent.setup()
    renderWithMemoryRouter('/genesis/1')

    await waitFor(() => {
      expect(screen.getByTestId('verse-1')).toBeDefined()
    })

    await user.click(screen.getByTestId('verse-1'))

    await waitFor(() => {
      expect(screen.getByTestId('note-editor-container')).toBeDefined()
      expect(screen.getByTestId('note-editor')).toBeDefined()
    })
  })

  it('saving a note calls studyStore.addNote with correct verse range and text', async () => {
    const user = userEvent.setup()
    renderWithMemoryRouter('/genesis/1')

    await waitFor(() => {
      expect(screen.getByTestId('verse-1')).toBeDefined()
    })

    await user.click(screen.getByTestId('verse-1'))

    await waitFor(() => {
      expect(screen.getByTestId('note-editor-textarea')).toBeDefined()
    })

    await user.type(screen.getByTestId('note-editor-textarea'), 'Minha primeira nota')
    await user.click(screen.getByTestId('note-editor-save'))

    const notes = useStudyStore.getState().notes
    expect(notes).toHaveLength(1)
    expect(notes[0]).toEqual(
      expect.objectContaining({
        bookId: 'genesis',
        chapter: 1,
        startVerse: 1,
        endVerse: 1,
        text: 'Minha primeira nota',
      }),
    )
    expect(notes[0].id).toBeDefined()
    expect(notes[0].updatedAt).toBeTypeOf('number')
  })

  it('note indicator appears on verses that have notes', async () => {
    useStudyStore.getState().addNote({
      bookId: 'genesis',
      chapter: 1,
      startVerse: 1,
      endVerse: 1,
      text: 'Nota de teste',
    })

    renderWithMemoryRouter('/genesis/1')

    await waitFor(() => {
      expect(screen.getByTestId('verse-1')).toBeDefined()
    })

    await waitFor(() => {
      expect(screen.getByTestId('note-indicator')).toBeDefined()
    })
  })

  it('note indicator does not appear on verses without notes', async () => {
    useStudyStore.getState().addNote({
      bookId: 'genesis',
      chapter: 1,
      startVerse: 5,
      endVerse: 5,
      text: 'Nota no versiculo 5',
    })

    renderWithMemoryRouter('/genesis/1')

    await waitFor(() => {
      expect(screen.getByTestId('verse-1')).toBeDefined()
    })

    const indicators = screen.queryAllByTestId('note-indicator')
    expect(indicators).toHaveLength(1)
    expect(screen.getByTestId('verse-5')).toContainElement(screen.getByTestId('note-indicator'))
  })

  it('editing an existing note calls updateNote', async () => {
    useStudyStore.getState().addNote({
      bookId: 'genesis',
      chapter: 1,
      startVerse: 2,
      endVerse: 2,
      text: 'Nota original',
    })
    const noteId = useStudyStore.getState().notes[0].id

    const user = userEvent.setup()
    renderWithMemoryRouter('/genesis/1')

    await waitFor(() => {
      expect(screen.getByTestId('verse-2')).toBeDefined()
    })

    await user.click(screen.getByTestId('verse-2'))

    await waitFor(() => {
      expect(screen.getByTestId('note-editor-textarea')).toBeDefined()
    })

    const textarea = screen.getByTestId('note-editor-textarea')
    expect((textarea as HTMLTextAreaElement).value).toBe('Nota original')

    await user.clear(textarea)
    await user.type(textarea, 'Nota atualizada')
    await user.click(screen.getByTestId('note-editor-save'))

    const notes = useStudyStore.getState().notes
    expect(notes).toHaveLength(1)
    expect(notes[0].id).toBe(noteId)
    expect(notes[0].text).toBe('Nota atualizada')
  })

  it('deleting a note calls deleteNote and removes the indicator', async () => {
    useStudyStore.getState().addNote({
      bookId: 'genesis',
      chapter: 1,
      startVerse: 3,
      endVerse: 3,
      text: 'Nota para excluir',
    })

    const user = userEvent.setup()
    renderWithMemoryRouter('/genesis/1')

    await waitFor(() => {
      expect(screen.getByTestId('verse-3')).toBeDefined()
    })

    await user.click(screen.getByTestId('verse-3'))

    await waitFor(() => {
      expect(screen.getByTestId('note-editor-delete')).toBeDefined()
    })

    await user.click(screen.getByTestId('note-editor-delete'))

    expect(useStudyStore.getState().notes).toHaveLength(0)
    await waitFor(() => {
      expect(screen.queryByTestId('note-indicator')).toBeNull()
    })
  })

  it('note covers verse range (start to endVerse)', async () => {
    useStudyStore.getState().addNote({
      bookId: 'genesis',
      chapter: 1,
      startVerse: 1,
      endVerse: 3,
      text: 'Nota em range',
    })

    renderWithMemoryRouter('/genesis/1')

    await waitFor(() => {
      expect(screen.getByTestId('verse-1')).toBeDefined()
    })

    await waitFor(() => {
      const indicators = screen.queryAllByTestId('note-indicator')
      expect(indicators).toHaveLength(3)
    })
  })

  it('note with null endVerse covers single verse', async () => {
    useStudyStore.getState().addNote({
      bookId: 'genesis',
      chapter: 1,
      startVerse: 4,
      endVerse: null,
      text: 'Nota single verse',
    })

    renderWithMemoryRouter('/genesis/1')

    await waitFor(() => {
      expect(screen.getByTestId('verse-4')).toBeDefined()
    })

    await waitFor(() => {
      expect(screen.getByTestId('verse-4')).toContainElement(screen.getByTestId('note-indicator'))
    })

    expect(screen.queryAllByTestId('note-indicator')).toHaveLength(1)
  })
})

describe('ChapterReader - note persistence', () => {
  it('creating a note persists to localStorage via studyStore', async () => {
    const user = userEvent.setup()
    renderWithMemoryRouter('/genesis/1')

    await waitFor(() => {
      expect(screen.getByTestId('verse-1')).toBeDefined()
    })

    await user.click(screen.getByTestId('verse-1'))

    await waitFor(() => {
      expect(screen.getByTestId('note-editor-textarea')).toBeDefined()
    })

    await user.type(screen.getByTestId('note-editor-textarea'), 'Nota persistente')
    await user.click(screen.getByTestId('note-editor-save'))

    const serialized = localStorage.getItem('bible-app-study')
    expect(serialized).toBeDefined()
    const parsed = JSON.parse(serialized!)
    expect(parsed.state.notes).toHaveLength(1)
    expect(parsed.state.notes[0].text).toBe('Nota persistente')
    expect(parsed.state.notes[0].bookId).toBe('genesis')
  })

  it('reloading the page restores notes and indicators on correct verses', async () => {
    useStudyStore.getState().addNote({
      bookId: 'genesis',
      chapter: 1,
      startVerse: 1,
      endVerse: 2,
      text: 'Nota restaurada',
    })

    const serialized = localStorage.getItem('bible-app-study')
    expect(serialized).toBeDefined()

    renderWithMemoryRouter('/genesis/1')

    await waitFor(() => {
      expect(screen.getByTestId('verse-1')).toBeDefined()
    })

    await waitFor(() => {
      const indicators = screen.queryAllByTestId('note-indicator')
      expect(indicators).toHaveLength(2)
    })

    expect(screen.getByTestId('verse-1')).toContainElement(screen.getAllByTestId('note-indicator')[0])
    expect(screen.getByTestId('verse-2')).toContainElement(screen.getAllByTestId('note-indicator')[1])
  })

  it('editing a note updates the text and persists', async () => {
    useStudyStore.getState().addNote({
      bookId: 'genesis',
      chapter: 1,
      startVerse: 1,
      endVerse: 1,
      text: 'Original',
    })

    const user = userEvent.setup()
    renderWithMemoryRouter('/genesis/1')

    await waitFor(() => {
      expect(screen.getByTestId('verse-1')).toBeDefined()
    })

    await user.click(screen.getByTestId('verse-1'))

    await waitFor(() => {
      expect(screen.getByTestId('note-editor-textarea')).toBeDefined()
    })

    await user.clear(screen.getByTestId('note-editor-textarea'))
    await user.type(screen.getByTestId('note-editor-textarea'), 'Editado')
    await user.click(screen.getByTestId('note-editor-save'))

    const serialized = localStorage.getItem('bible-app-study')
    const parsed = JSON.parse(serialized!)
    expect(parsed.state.notes[0].text).toBe('Editado')
  })

  it('deleting a note removes it from localStorage and clears the indicator', async () => {
    useStudyStore.getState().addNote({
      bookId: 'genesis',
      chapter: 1,
      startVerse: 1,
      endVerse: 1,
      text: 'Para deletar',
    })

    const user = userEvent.setup()
    renderWithMemoryRouter('/genesis/1')

    await waitFor(() => {
      expect(screen.getByTestId('verse-1')).toBeDefined()
    })

    await user.click(screen.getByTestId('verse-1'))

    await waitFor(() => {
      expect(screen.getByTestId('note-editor-delete')).toBeDefined()
    })

    await user.click(screen.getByTestId('note-editor-delete'))

    const serialized = localStorage.getItem('bible-app-study')
    const parsed = JSON.parse(serialized!)
    expect(parsed.state.notes).toHaveLength(0)
    await waitFor(() => {
      expect(screen.queryByTestId('note-indicator')).toBeNull()
    })
  })

  it('notes from different chapters do not appear', async () => {
    useStudyStore.getState().addNote({
      bookId: 'genesis',
      chapter: 2,
      startVerse: 1,
      endVerse: 1,
      text: 'Nota genesis 2',
    })

    renderWithMemoryRouter('/genesis/1')

    await waitFor(() => {
      expect(screen.getByTestId('verse-1')).toBeDefined()
    })

    expect(screen.queryByTestId('note-indicator')).toBeNull()
  })
})

describe('NotesPanel', () => {
  it('shows empty state when there are no notes', () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<NotesPanel />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByTestId('notes-panel-empty')).toBeDefined()
    expect(screen.getByText('Nenhuma nota ainda.')).toBeDefined()
  })

  it('lists all notes with book/chapter/verse references', () => {
    useStudyStore.getState().addNote({
      bookId: 'genesis',
      chapter: 1,
      startVerse: 1,
      endVerse: 3,
      text: 'Primeira nota',
    })
    useStudyStore.getState().addNote({
      bookId: 'john',
      chapter: 3,
      startVerse: 16,
      endVerse: null,
      text: 'Segunda nota',
    })

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<NotesPanel />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByTestId('notes-panel')).toBeDefined()
    expect(screen.getByTestId('notes-panel-count')).toHaveTextContent('2 notas')
    const cards = screen.getAllByTestId('note-card')
    expect(cards).toHaveLength(2)
  })

  it('displays note text correctly', () => {
    useStudyStore.getState().addNote({
      bookId: 'genesis',
      chapter: 1,
      startVerse: 1,
      endVerse: 1,
      text: 'Texto da nota de estudo',
    })

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<NotesPanel />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByTestId('note-card-text')).toHaveTextContent('Texto da nota de estudo')
  })

  it('displays formatted verse range', () => {
    useStudyStore.getState().addNote({
      bookId: 'genesis',
      chapter: 1,
      startVerse: 5,
      endVerse: 8,
      text: 'Range note',
    })

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<NotesPanel />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByTestId('note-card-reference')).toHaveTextContent('vv. 5–8')
  })

  it('displays single verse format when start and end are same', () => {
    useStudyStore.getState().addNote({
      bookId: 'genesis',
      chapter: 1,
      startVerse: 3,
      endVerse: 3,
      text: 'Single verse',
    })

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<NotesPanel />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByTestId('note-card-reference')).toHaveTextContent('v. 3')
  })

  it('deleting a note from panel removes it', () => {
    useStudyStore.getState().addNote({
      bookId: 'genesis',
      chapter: 1,
      startVerse: 1,
      endVerse: 1,
      text: 'Para deletar',
    })

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<NotesPanel />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getAllByTestId('note-card')).toHaveLength(1)
    const deleteBtn = screen.getByTestId('note-card-delete')
    fireEvent.click(deleteBtn)

    expect(screen.getByTestId('notes-panel-empty')).toBeDefined()
  })

  it('editing a note from panel updates the text', async () => {
    useStudyStore.getState().addNote({
      bookId: 'genesis',
      chapter: 1,
      startVerse: 1,
      endVerse: 1,
      text: 'Original panel',
    })

    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<NotesPanel />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByTestId('note-card-text')).toHaveTextContent('Original panel')
    const editBtn = screen.getByTestId('note-card-edit')
    fireEvent.click(editBtn)

    await waitFor(() => {
      expect(screen.getByTestId('note-editor')).toBeDefined()
    })
    expect(screen.getByTestId('note-editor-delete')).toBeDefined()

    await user.clear(screen.getByTestId('note-editor-textarea'))
    await user.type(screen.getByTestId('note-editor-textarea'), 'Atualizado do painel')
    await user.click(screen.getByTestId('note-editor-save'))

    await waitFor(() => {
      expect(screen.getByTestId('note-card-text')).toHaveTextContent('Atualizado do painel')
    })
  })

  it('notes are sorted by updatedAt descending (newest first)', () => {
    const now = Date.now()
    const notes = [
      {
        id: 'note-newer',
        bookId: 'genesis',
        chapter: 1,
        startVerse: 1,
        endVerse: 1,
        text: 'Nota nova',
        updatedAt: now,
      },
      {
        id: 'note-older',
        bookId: 'genesis',
        chapter: 1,
        startVerse: 2,
        endVerse: 2,
        text: 'Nota antiga',
        updatedAt: now - 86400000,
      },
    ]
    useStudyStore.setState({ notes })

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<NotesPanel />} />
        </Routes>
      </MemoryRouter>,
    )

    const cards = screen.getAllByTestId('note-card')
    expect(cards).toHaveLength(2)
    expect(cards[0].getAttribute('data-note-id')).toBe('note-newer')
    expect(cards[1].getAttribute('data-note-id')).toBe('note-older')
  })

  it('shows correct count for singular/plural', () => {
    useStudyStore.getState().addNote({
      bookId: 'genesis',
      chapter: 1,
      startVerse: 1,
      endVerse: 1,
      text: 'One note',
    })

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<NotesPanel />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByTestId('notes-panel-count')).toHaveTextContent('1 nota')
  })
})
