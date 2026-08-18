import React from 'react'
import { Plus, ListCollapse } from 'lucide-react'
import SearchBar from './SearchBar'
import NoteCard from './NoteCard'
import VaultSelector from './VaultSelector'
import { NoteMetadata, VaultState } from '../../types/vault'

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
  onCreateNote: () => void
  onToggleSidebar?: () => void
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
  onCreateNote,
  onToggleSidebar
}) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title-bar">
          <span className="sidebar-title">NOTAS</span>
          <div className="sidebar-header-actions">
            <button className="sidebar-action-btn" onClick={onCreateNote} title="Nova Nota">
              <Plus size={16} />
            </button>
            {onToggleSidebar && (
              <button
                className="sidebar-action-btn toggle-btn"
                onClick={onToggleSidebar}
                title="Recolher Sidebar"
              >
                <ListCollapse size={16} />
              </button>
            )}
          </div>
        </div>
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
  )
}

export default Sidebar
