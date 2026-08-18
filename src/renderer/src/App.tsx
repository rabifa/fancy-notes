import { useState } from 'react'
import { Titlebar, Sidebar, TipTapEditor, EditorFooter, OnboardingModal } from './components'
import useVault from './hooks/useVault'
import useNotes from './hooks/useNotes'

export const App = () => {
  const { vaultState, selectVaultFolder, selectActiveVault } = useVault()

  const {
    notes,
    activeNotePath,
    activeNote,
    activeNoteContent,
    searchQuery,
    saveStatus,
    setSearchQuery,
    selectNote,
    createNote,
    deleteNote,
    renameNote,
    toggleFavorite,
    exportTxt,
    handleContentChange
  } = useNotes(vaultState.activeVaultPath)

  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)

  const handleCreateNote = async () => {
    // Creates a new markdown note by default. Users can change text formatting or rename it.
    await createNote('Sem Titulo', 'md')
  }

  const handleDeleteNote = async () => {
    if (activeNotePath) {
      const confirmDelete = window.confirm('Tem certeza que deseja mover esta nota para a lixeira?')
      if (confirmDelete) {
        await deleteNote(activeNotePath)
      }
    }
  }

  const handleDuplicateNote = async () => {
    if (activeNote && activeNotePath) {
      const copyTitle = `${activeNote.title} Copia`
      const newNote = await createNote(copyTitle, activeNote.extension.replace('.', ''))
      if (newNote) {
        // Save the content of the copied note into the newly created copy
        await window.api.vault.saveNote(newNote.path, activeNoteContent)
        // Select the new duplicated note
        await selectNote(newNote.path)
      }
    }
  }

  const handleExportTxt = async () => {
    if (activeNotePath) {
      const exportedPath = await exportTxt()
      if (exportedPath) {
        window.alert(`Nota exportada com sucesso para:\n${exportedPath}`)
      }
    }
  }

  const handleStatsChange = (words: number, chars: number) => {
    setWordCount(words)
    setCharCount(chars)
  }

  const activeVaultPath = vaultState.activeVaultPath

  return (
    <div className="app-container">
      <Titlebar />

      <div className="main-content">
        {isSidebarOpen && (
          <Sidebar
            vaultState={vaultState}
            notes={notes}
            activeNotePath={activeNotePath}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectNote={selectNote}
            onToggleFavorite={toggleFavorite}
            onSelectVault={selectActiveVault}
            onAddVault={selectVaultFolder}
            onCreateNote={handleCreateNote}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        )}

        <div className="editor-panel-wrapper">
          <TipTapEditor
            notePath={activeNotePath}
            noteTitle={activeNote ? activeNote.title : null}
            noteContent={activeNoteContent}
            noteExtension={activeNote ? activeNote.extension : '.md'}
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            onDeleteNote={handleDeleteNote}
            onDuplicateNote={handleDuplicateNote}
            onExportTxt={handleExportTxt}
            onCreateNote={handleCreateNote}
            onRenameNote={renameNote}
            onContentChange={handleContentChange}
            onStatsChange={handleStatsChange}
          />

          {activeNotePath && (
            <EditorFooter
              wordCount={wordCount}
              charCount={charCount}
              saveStatus={saveStatus}
              noteExtension={activeNote ? activeNote.extension : null}
            />
          )}
        </div>
      </div>

      <OnboardingModal isOpen={activeVaultPath === null} onSelectFolder={selectVaultFolder} />
    </div>
  )
}

export default App
