import React from 'react'

export type SaveStatus = 'saved' | 'saving' | 'dirty' | 'idle'

interface EditorFooterProps {
  wordCount: number
  charCount: number
  saveStatus: SaveStatus
  noteExtension: string | null
}

export const EditorFooter: React.FC<EditorFooterProps> = ({
  wordCount,
  charCount,
  saveStatus,
  noteExtension
}) => {
  const getStatusLabel = () => {
    switch (saveStatus) {
      case 'saved':
        return 'SALVO'
      case 'saving':
        return 'SALVANDO...'
      case 'dirty':
        return 'MODIFICADO'
      case 'idle':
      default:
        return 'PRONTO'
    }
  }

  const getStatusClass = () => {
    switch (saveStatus) {
      case 'saved':
        return 'status-saved'
      case 'saving':
        return 'status-saving'
      case 'dirty':
        return 'status-dirty'
      case 'idle':
      default:
        return 'status-idle'
    }
  }

  return (
    <div className="editor-footer">
      <div className="editor-stats">
        <span className="stat-item">
          PALAVRAS: <span className="stat-value">{wordCount}</span>
        </span>
        <span className="stat-separator">|</span>
        <span className="stat-item">
          CARACTERES: <span className="stat-value">{charCount}</span>
        </span>
      </div>

      <div className="editor-status-bar-right">
        {noteExtension && (
          <>
            <span className="note-format-badge">
              {noteExtension.replace('.', '').toUpperCase()}
            </span>
            <span className="stat-separator">|</span>
          </>
        )}
        <div className={`editor-save-status ${getStatusClass()}`}>
          <span className="status-dot" />
          <span className="status-label">{getStatusLabel()}</span>
        </div>
      </div>
    </div>
  )
}

export default EditorFooter
