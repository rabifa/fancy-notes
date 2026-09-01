import React, { useState, useRef, useEffect } from 'react'
import { Editor } from '@tiptap/react'
import { Copy, ChevronDown } from 'lucide-react'

import sidebarEnableIcon from '../../assets/icons/sidebar-anable-icon.svg'
import sidebarDisableIcon from '../../assets/icons/sidebar-disable-icon.svg'
import trashIcon from '../../assets/icons/trash-icon.svg'
import newNoteIcon from '../../assets/icons/new-note-icon.svg'
import checklistIcon from '../../assets/icons/checklist-icon.svg'
import fontEditIcon from '../../assets/icons/font-edit-icon.svg'
import highlighterIcon from '../../assets/icons/highlighter-icon.svg'
import boldIcon from '../../assets/icons/bold-icon.svg'
import italicIcon from '../../assets/icons/italic-icon.svg'
import underscoreIcon from '../../assets/icons/underscore-icon.svg'
import alignLeftIcon from '../../assets/icons/align-left-icon.svg'
import alignCenterIcon from '../../assets/icons/align-center-icon.svg'
import alignRightIcon from '../../assets/icons/align-right-icon.svg'
import SvgIcon from '../common/SvgIcon'

interface EditorToolbarProps {
  editor: Editor | null
  onToggleSidebar?: () => void
  onDeleteNote?: () => void
  onDuplicateNote?: () => void
  onExportTxt?: () => void
  onCreateNote?: () => void
  isSidebarOpen?: boolean
}

const FONTS = [
  { name: 'Inter', value: 'Inter, sans-serif' },
  { name: 'Orbitron', value: 'Orbitron, sans-serif' },
  { name: 'JetBrains Mono', value: 'var(--font-family-mono), monospace' },
  { name: 'Arial', value: 'Arial, sans-serif' }
]

const NEON_COLORS = [
  { name: 'White', value: '#ffffff' },
  { name: 'Pink Neon', value: '#ff007f' },
  { name: 'Cyan Neon', value: '#00e5ff' },
  { name: 'Green Neon', value: '#00ff66' },
  { name: 'Yellow Neon', value: '#ffcc00' },
  { name: 'Purple Neon', value: '#a020f0' },
  { name: 'Muted Grey', value: '#6b7a99' },
  { name: 'Orange Neon', value: '#ff5e00' }
]

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  editor,
  onToggleSidebar,
  onDeleteNote,
  onDuplicateNote,
  onCreateNote,
  isSidebarOpen = true
}) => {
  const [isFontOpen, setIsFontOpen] = useState(false)
  const [isColorOpen, setIsColorOpen] = useState(false)
  const fontRef = useRef<HTMLDivElement>(null)
  const colorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (fontRef.current && !fontRef.current.contains(e.target as Node)) {
        setIsFontOpen(false)
      }
      if (colorRef.current && !colorRef.current.contains(e.target as Node)) {
        setIsColorOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  if (!editor) return null

  const getActiveFontName = () => {
    for (const font of FONTS) {
      if (editor.isActive('textStyle', { fontFamily: font.value })) {
        return font.name
      }
    }
    return 'Fonte'
  }

  const getActiveColor = () => {
    const attrs = editor.getAttributes('textStyle')
    return attrs.color || '#ffffff'
  }

  const setFont = (fontValue: string) => {
    editor.chain().focus().setFontFamily(fontValue).run()
    setIsFontOpen(false)
  }

  const setColor = (colorValue: string) => {
    editor.chain().focus().setColor(colorValue).run()
    setIsColorOpen(false)
  }

  return (
    <div className="editor-toolbar">
      {/* Group 1: Sidebar & File Management */}
      <div className="toolbar-group">
        <button
          className={`toolbar-btn ${isSidebarOpen ? 'active' : ''}`}
          onClick={onToggleSidebar}
          title={isSidebarOpen ? 'Esconder Barra Lateral' : 'Mostrar Barra Lateral'}
        >
          <SvgIcon
            src={isSidebarOpen ? sidebarDisableIcon : sidebarEnableIcon}
            size={15}
            alt="Sidebar"
          />
        </button>
        <button className="toolbar-btn text-pink" onClick={onDeleteNote} title="Excluir Nota">
          <SvgIcon src={trashIcon} size={15} alt="Excluir" />
        </button>
        <button className="toolbar-btn" onClick={onDuplicateNote} title="Duplicar Nota">
          <Copy size={15} />
        </button>
        <button className="toolbar-btn text-cyan" onClick={onCreateNote} title="Nova Nota">
          <SvgIcon src={newNoteIcon} size={15} alt="Nova Nota" />
        </button>
      </div>

      <div className="toolbar-divider" />

      {/* Group 2: Typography, Color & Checklist */}
      <div className="toolbar-group">
        <button
          className={`toolbar-btn ${editor.isActive('taskList') ? 'active' : ''}`}
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          title="Lista de Tarefas"
        >
          <SvgIcon src={checklistIcon} size={15} alt="Checklist" />
        </button>

        {/* Font Family Dropdown */}
        <div className="dropdown-container" ref={fontRef}>
          <button
            className="dropdown-trigger"
            onClick={() => setIsFontOpen(!isFontOpen)}
            title="Família de Fonte"
          >
            <SvgIcon src={fontEditIcon} size={14} alt="Fonte" />
            <span className="dropdown-label">{getActiveFontName()}</span>
            <ChevronDown size={12} />
          </button>
          {isFontOpen && (
            <div className="dropdown-menu font-dropdown">
              {FONTS.map((font) => (
                <button
                  key={font.name}
                  className={`dropdown-item ${
                    editor.isActive('textStyle', { fontFamily: font.value }) ? 'active' : ''
                  }`}
                  style={{ fontFamily: font.value }}
                  onClick={() => setFont(font.value)}
                >
                  {font.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Color Dropdown */}
        <div className="dropdown-container" ref={colorRef}>
          <button
            className="dropdown-trigger color-trigger"
            onClick={() => setIsColorOpen(!isColorOpen)}
            title="Cor da Fonte"
          >
            <SvgIcon
              src={highlighterIcon}
              size={15}
              alt="Cor"
              style={{ color: getActiveColor() }}
            />
            <ChevronDown size={12} />
          </button>
          {isColorOpen && (
            <div className="dropdown-menu color-dropdown">
              <div className="color-palette">
                {NEON_COLORS.map((color) => {
                  const isActive = editor.isActive('textStyle', { color: color.value })
                  return (
                    <button
                      key={color.name}
                      className={`color-swatch ${isActive ? 'active' : ''}`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => setColor(color.value)}
                      title={color.name}
                    />
                  )
                })}
              </div>
              <div className="custom-color-input-container">
                <input
                  type="color"
                  value={getActiveColor()}
                  onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
                  className="custom-color-input"
                  title="Cor personalizada"
                />
                <span className="custom-color-label">Dropper</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="toolbar-divider" />

      {/* Group 3: Text Formatting */}
      <div className="toolbar-group">
        <button
          className={`toolbar-btn ${editor.isActive('bold') ? 'active' : ''}`}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Negrito"
        >
          <SvgIcon src={boldIcon} size={15} alt="Negrito" />
        </button>
        <button
          className={`toolbar-btn ${editor.isActive('italic') ? 'active' : ''}`}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Itálico"
        >
          <SvgIcon src={italicIcon} size={15} alt="Itálico" />
        </button>
        <button
          className={`toolbar-btn ${editor.isActive('underline') ? 'active' : ''}`}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="Sublinhado"
        >
          <SvgIcon src={underscoreIcon} size={15} alt="Sublinhado" />
        </button>
      </div>

      <div className="toolbar-divider" />

      {/* Group 4: Text Alignment */}
      <div className="toolbar-group">
        <button
          className={`toolbar-btn ${editor.isActive({ textAlign: 'left' }) ? 'active' : ''}`}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          title="Alinhar à Esquerda"
        >
          <SvgIcon src={alignLeftIcon} size={15} alt="Alinhar à Esquerda" />
        </button>
        <button
          className={`toolbar-btn ${editor.isActive({ textAlign: 'center' }) ? 'active' : ''}`}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          title="Centralizar"
        >
          <SvgIcon src={alignCenterIcon} size={15} alt="Centralizar" />
        </button>
        <button
          className={`toolbar-btn ${editor.isActive({ textAlign: 'right' }) ? 'active' : ''}`}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          title="Alinhar à Direita"
        >
          <SvgIcon src={alignRightIcon} size={15} alt="Alinhar à Direita" />
        </button>
      </div>
    </div>
  )
}

export default EditorToolbar
