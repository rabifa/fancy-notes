import React from 'react'

export type SaveStatus = 'saved' | 'saving' | 'dirty' | 'idle'

interface EditorFooterProps {
  wordCount: number
  charCount: number
  saveStatus?: SaveStatus
  noteExtension: string | null
}

export const EditorFooter: React.FC<EditorFooterProps> = ({
  wordCount,
  charCount,
  noteExtension
}) => {
  return (
    <div className="editor-footer">
      <div className="editor-stats">
        <span className="stat-text">
          PALAVRAS: {wordCount} &bull; CARACTERES: {charCount}
        </span>
      </div>

      <div className="editor-status-bar-right">
        {noteExtension && (
          <span className="note-format-badge">{noteExtension.replace('.', '').toUpperCase()}</span>
        )}
      </div>
    </div>
  )
}

export default EditorFooter
