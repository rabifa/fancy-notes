import React, { useCallback, useEffect, useRef, useState } from 'react'
import SearchBar from './SearchBar'
import NoteCard from './NoteCard'
import VaultSelector from './VaultSelector'
import { NoteMetadata, VaultState } from '../../types/vault'

const MIN_SIDEBAR_WIDTH = 170
const MAX_SIDEBAR_WIDTH = 400
const DEFAULT_SIDEBAR_WIDTH = 320
const SIDEBAR_WIDTH_STORAGE_KEY = 'sidebarWidth'

const clampWidth = (width: number): number =>
  Math.min(MAX_SIDEBAR_WIDTH, Math.max(MIN_SIDEBAR_WIDTH, width))

interface SidebarProps {
  vaultState: VaultState
  notes: NoteMetadata[]
  activeNotePath: string | null
  searchQuery: string
  onSearchChange: (query: string) => void
  onSelectNote: (notePath: string) => void
  onToggleFavorite: (notePath: string) => void
  onSelectVault: (path: string) => void
  onAddVault: () => void
  onRenameNote: (notePath: string, newTitle: string) => void
  onDeleteNote: (notePath: string) => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  vaultState,
  notes,
  activeNotePath,
  searchQuery,
  onSearchChange,
  onSelectNote,
  onToggleFavorite,
  onSelectVault,
  onAddVault,
  onRenameNote,
  onDeleteNote
}) => {
  const [width, setWidth] = useState<number>(() => {
    const stored = Number(window.localStorage.getItem(SIDEBAR_WIDTH_STORAGE_KEY))
    return clampWidth(stored || DEFAULT_SIDEBAR_WIDTH)
  })
  const dragStateRef = useRef<{ startX: number; startWidth: number } | null>(null)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragStateRef.current) return
    const { startX, startWidth } = dragStateRef.current
    setWidth(clampWidth(startWidth + (e.clientX - startX)))
  }, [])

  const handleMouseUp = useCallback(() => {
    dragStateRef.current = null
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }, [handleMouseMove])

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault()
    dragStateRef.current = { startX: e.clientX, startWidth: width }
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }

  useEffect(() => {
    window.localStorage.setItem(SIDEBAR_WIDTH_STORAGE_KEY, String(width))
  }, [width])

  // Clean up listeners if the component unmounts mid-drag
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  return (
    <>
      <div className="sidebar" style={{ width }}>
        <div className="sidebar-header">
          <SearchBar value={searchQuery} onChange={onSearchChange} />
        </div>

        <div className="sidebar-note-list scrollbar-custom">
          {notes.length === 0 ? (
            <div className="sidebar-empty">
              {vaultState.activeVaultPath
                ? 'Nenhuma nota encontrada.'
                : 'Selecione um Vault para começar.'}
            </div>
          ) : (
            notes.map((note) => (
              <NoteCard
                key={note.path}
                note={note}
                isActive={note.path === activeNotePath}
                onClick={() => onSelectNote(note.path)}
                onToggleFavorite={() => onToggleFavorite(note.path)}
                onRename={(newTitle) => onRenameNote(note.path, newTitle)}
                onDelete={() => onDeleteNote(note.path)}
              />
            ))
          )}
        </div>

        <div className="sidebar-footer">
          <VaultSelector
            vaultState={vaultState}
            onSelectVault={onSelectVault}
            onAddVault={onAddVault}
          />
        </div>
      </div>
      <div className="sidebar-resize-handle" onMouseDown={handleResizeStart} />
    </>
  )
}

export default Sidebar
