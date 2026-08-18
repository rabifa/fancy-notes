import React, { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import FontFamily from '@tiptap/extension-font-family'
import TextAlign from '@tiptap/extension-text-align'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'

import EditorToolbar from './EditorToolbar'
import { markdownToHtml, htmlToMarkdown, textToHtml } from '../../utils/markdown'

interface TipTapEditorProps {
  notePath: string | null
  noteTitle: string | null
  noteContent: string
  noteExtension: string
  isSidebarOpen?: boolean
  onToggleSidebar?: () => void
  onDeleteNote?: () => void
  onDuplicateNote?: () => void
  onExportTxt?: () => void
  onCreateNote?: () => void
  onRenameNote?: (newTitle: string) => void
  onContentChange: (newContent: string) => void
  onStatsChange?: (wordCount: number, charCount: number) => void
}

export const TipTapEditor: React.FC<TipTapEditorProps> = ({
  notePath,
  noteTitle,
  noteContent,
  noteExtension,
  isSidebarOpen = true,
  onToggleSidebar,
  onDeleteNote,
  onDuplicateNote,
  onExportTxt,
  onCreateNote,
  onRenameNote,
  onContentChange,
  onStatsChange
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // TaskList handles list items separately
        bulletList: {},
        orderedList: {},
        listItem: {}
      }),
      Underline,
      TextStyle,
      Color,
      FontFamily,
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      TaskList,
      TaskItem.configure({
        nested: true
      })
    ],
    content: noteExtension === '.txt' ? textToHtml(noteContent) : markdownToHtml(noteContent),
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      const text = editor.getText()

      // Calculate character and word count
      const charCount = text.length
      const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length

      if (onStatsChange) {
        onStatsChange(wordCount, charCount)
      }

      // Convert back to save format
      const convertedContent = noteExtension === '.txt' ? text : htmlToMarkdown(html)

      onContentChange(convertedContent)
    }
  })

  // Synchronize when switching notes or when external updates happen
  useEffect(() => {
    if (!editor || notePath === null) return

    const htmlContent =
      noteExtension === '.txt' ? textToHtml(noteContent) : markdownToHtml(noteContent)

    // Check if the content is actually different to avoid cursor jumps while typing
    if (editor.getHTML() !== htmlContent && !editor.isFocused) {
      editor.commands.setContent(htmlContent, { emitUpdate: false })

      // Calculate and trigger stats updates immediately on load
      const text = editor.getText()
      const charCount = text.length
      const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length
      if (onStatsChange) {
        onStatsChange(wordCount, charCount)
      }
    }
  }, [notePath, noteContent, editor, noteExtension])

  // Focus the editor when note switches
  useEffect(() => {
    if (editor && notePath) {
      editor.commands.focus()
    }
  }, [notePath, editor])

  if (!notePath) {
    return (
      <div className="editor-empty-state">
        <div className="empty-state-icon">⚡</div>
        <p className="empty-state-title">VAULT NOTES</p>
        <p className="empty-state-text">
          Selecione uma nota na sidebar ou crie uma nova para começar a editar.
        </p>
      </div>
    )
  }

  return (
    <div className="editor-panel">
      <EditorToolbar
        editor={editor}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={onToggleSidebar}
        onDeleteNote={onDeleteNote}
        onDuplicateNote={onDuplicateNote}
        onExportTxt={onExportTxt}
        onCreateNote={onCreateNote}
      />
      <div className="editor-workspace scrollbar-custom">
        <div className="editor-title-container">
          <input
            type="text"
            className="editor-title-input"
            value={noteTitle || ''}
            onChange={(e) => onRenameNote && onRenameNote(e.target.value)}
            placeholder="NOME DA NOTA..."
            title="Renomear nota"
          />
          <div className="editor-title-neon-bar" />
        </div>
        <div className="editor-body">
          <EditorContent editor={editor} className="editor-content" />
        </div>
      </div>
    </div>
  )
}

export default TipTapEditor
