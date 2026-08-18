import React from 'react'
import { Star, FileText } from 'lucide-react'
import { NoteMetadata } from '../../types/vault'

interface NoteCardProps {
  note: NoteMetadata
  isActive: boolean
  onClick: () => void
  onToggleFavorite: (e: React.MouseEvent) => void
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  isActive,
  onClick,
  onToggleFavorite
}) => {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className={`note-card ${isActive ? 'active' : ''}`} onClick={onClick}>
      <div className="note-card-header">
        <div className="note-card-title-group">
          <FileText className="note-type-icon" size={14} />
          <span className="note-card-title">{note.title}</span>
        </div>
        <span className="note-card-ext">{note.extension.toUpperCase()}</span>
      </div>

      <p className="note-card-preview">{note.preview || 'Nenhum conteúdo...'}</p>

      <div className="note-card-footer">
        <span className="note-card-date">{formatTime(note.updatedAt)}</span>
        <button
          className={`favorite-btn ${note.isFavorite ? 'is-favorite' : ''}`}
          onClick={(e) => {
            e.stopPropagation()
            onToggleFavorite(e)
          }}
          title={note.isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Star size={14} fill={note.isFavorite ? 'var(--pink-neon)' : 'transparent'} />
        </button>
      </div>
    </div>
  )
}

export default NoteCard
