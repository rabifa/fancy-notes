import React from 'react'

export type SaveStatus = 'saved' | 'saving' | 'dirty' | 'idle'

interface EditorFooterProps {
  wordCount: number
  charCount: number
  saveStatus?: SaveStatus
}

export const EditorFooter: React.FC<EditorFooterProps> = ({ wordCount, charCount }) => {
  return (
    <div className="editor-footer">
      <div className="editor-stats">
        <span className="stat-text">
          PALAVRAS: {wordCount} <span className="stat-separator">&bull;</span> CARACTERES:{' '}
          {charCount}
        </span>
      </div>
    </div>
  )
}

export default EditorFooter
