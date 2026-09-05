import React, { useState, useRef, useEffect } from 'react'
import { Editor } from '@tiptap/react'
import { Copy, Minus, Plus } from 'lucide-react'

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

const DEFAULT_FONT_SIZE = 16
const MIN_FONT_SIZE = 8
const MAX_FONT_SIZE = 72

// Pasted content often carries colors as rgb()/rgba() strings, which the
// highlighter icon preview only understands as hex.
const toHexColor = (color: string): string => {
  if (/^#[0-9a-f]{6}$/i.test(color)) return color
  const match = color.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i)
  if (match) {
    const [, r, g, b] = match
    return `#${[r, g, b].map((c) => Number(c).toString(16).padStart(2, '0')).join('')}`
  }
  return '#ffffff'
}

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
  const [fontSizeDraft, setFontSizeDraft] = useState(DEFAULT_FONT_SIZE)
  const fontRef = useRef<HTMLDivElement>(null)
  const colorRef = useRef<HTMLDivElement>(null)
  const fontSizeSelectionRef = useRef<{ from: number; to: number } | null>(null)

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

  // The slider/stepper own their displayed value locally instead of
  // re-reading editor.getAttributes() on every render: that read reflects
  // whatever is under the (possibly mixed) selection and can disagree with
  // what was just set, which fights a controlled <input type="range"> mid-drag.
  // Sync the draft once when the dropdown opens, then let the controls drive it.
  //
  // Also snapshot the selection at that moment: focusing the range input
  // makes the browser drop the native text selection, and once that
  // happens the editor has nothing left to apply the size to. Re-applying
  // this stored range before every change sidesteps that entirely.
  useEffect(() => {
    if (!isFontOpen || !editor) return
    const raw = editor.getAttributes('textStyle').fontSize as string | undefined
    const parsed = raw ? parseInt(raw, 10) : NaN
    setFontSizeDraft(Number.isFinite(parsed) ? parsed : DEFAULT_FONT_SIZE)
    fontSizeSelectionRef.current = {
      from: editor.state.selection.from,
      to: editor.state.selection.to
    }
  }, [isFontOpen, editor])

  if (!editor) return null

  const getActiveColor = () => {
    const attrs = editor.getAttributes('textStyle')
    return toHexColor(attrs.color || '#ffffff')
  }

  const setFont = (fontValue: string) => {
    editor.chain().focus().setFontFamily(fontValue).run()
    setIsFontOpen(false)
  }

  const fontSizeSliderFillPercent =
    ((fontSizeDraft - MIN_FONT_SIZE) / (MAX_FONT_SIZE - MIN_FONT_SIZE)) * 100

  // Never chains .focus() here: stealing DOM focus back to the editor mid-drag
  // is what made the range input's native drag gesture break intermittently.
  // Re-asserting the stored selection (see the effect above) is what makes
  // this keep applying to the right text even after the browser has visibly
  // dropped the selection because focus moved to the slider.
  const applyFontSize = (next: number) => {
    const clamped = Math.min(MAX_FONT_SIZE, Math.max(MIN_FONT_SIZE, next))
    setFontSizeDraft(clamped)
    const sel = fontSizeSelectionRef.current
    const chain = editor.chain()
    if (sel && sel.from !== sel.to) {
      chain.setTextSelection(sel)
    }
    chain.setFontSize(`${clamped}px`).run()
  }

  const adjustFontSize = (delta: number) => applyFontSize(fontSizeDraft + delta)

  // Re-asserts the selection captured when the dropdown opened before
  // applying the color - see the effect above for why that's necessary.
  // Predefined colors don't need the selection to stay highlighted
  // afterward - apply the mark, then collapse the selection to its end
  // so the cursor just sits after the now-colored text.
  const setColor = (colorValue: string) => {
    const { to } = editor.state.selection
    editor.chain().focus().setColor(colorValue).setTextSelection(to).run()
    setIsColorOpen(false)
  }

  return (
    <div className="editor-toolbar">
      {/* Group 1: Sidebar & File Management */}
      <div className="toolbar-group">
        <button
          className={`toolbar-btn ${isSidebarOpen ? 'active' : ''}`}
          onMouseDown={(e) => e.preventDefault()}
          onClick={onToggleSidebar}
          title={isSidebarOpen ? 'Esconder Barra Lateral' : 'Mostrar Barra Lateral'}
        >
          <SvgIcon
            src={isSidebarOpen ? sidebarEnableIcon : sidebarDisableIcon}
            size={15}
            alt="Sidebar"
          />
        </button>
        <button
          className="toolbar-btn"
          onMouseDown={(e) => e.preventDefault()}
          onClick={onDeleteNote}
          title="Excluir Nota"
        >
          <SvgIcon src={trashIcon} size={15} alt="Excluir" />
        </button>
        <button
          className="toolbar-btn"
          onMouseDown={(e) => e.preventDefault()}
          onClick={onDuplicateNote}
          title="Duplicar Nota"
        >
          <Copy size={15} />
        </button>
        <button
          className="toolbar-btn"
          onMouseDown={(e) => e.preventDefault()}
          onClick={onCreateNote}
          title="Nova Nota"
        >
          <SvgIcon src={newNoteIcon} size={15} alt="Nova Nota" />
        </button>
      </div>

      <div className="toolbar-divider" />

      {/* Group 2: Typography, Color & Checklist */}
      <div className="toolbar-group">
        <button
          className={`toolbar-btn ${editor.isActive('taskList') ? 'active' : ''}`}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          title="Lista de Tarefas"
        >
          <SvgIcon src={checklistIcon} size={15} alt="Checklist" />
        </button>

        {/* Font Family Dropdown */}
        <div className="dropdown-container" ref={fontRef}>
          <button
            className={`toolbar-btn ${isFontOpen ? 'active' : ''}`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setIsFontOpen(!isFontOpen)}
            title="Família de Fonte"
          >
            <SvgIcon src={fontEditIcon} size={15} alt="Fonte" />
          </button>
          {isFontOpen && (
            <div className="dropdown-menu font-dropdown">
              <div className="font-size-control">
                <button
                  className="font-size-btn"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => adjustFontSize(-1)}
                  title="Diminuir tamanho da fonte"
                >
                  <Minus size={12} />
                </button>
                <span className="font-size-value">{fontSizeDraft}px</span>
                <button
                  className="font-size-btn"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => adjustFontSize(1)}
                  title="Aumentar tamanho da fonte"
                >
                  <Plus size={12} />
                </button>
              </div>
              <input
                type="range"
                className="font-size-slider"
                min={MIN_FONT_SIZE}
                max={MAX_FONT_SIZE}
                value={fontSizeDraft}
                style={{
                  background: `linear-gradient(to right, var(--cyan-neon) ${fontSizeSliderFillPercent}%, var(--bg-control) ${fontSizeSliderFillPercent}%)`
                }}
                onChange={(e) => applyFontSize(Number(e.target.value))}
              />
              <div className="dropdown-divider-thin" />
              {FONTS.map((font) => (
                <button
                  key={font.name}
                  className={`dropdown-item ${
                    editor.isActive('textStyle', { fontFamily: font.value }) ? 'active' : ''
                  }`}
                  style={{ fontFamily: font.value }}
                  onMouseDown={(e) => e.preventDefault()}
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
            className={`toolbar-btn ${isColorOpen ? 'active' : ''}`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setIsColorOpen(!isColorOpen)}
            title="Cor da Fonte"
          >
            <SvgIcon
              src={highlighterIcon}
              size={15}
              alt="Cor"
              style={{ color: getActiveColor() }}
            />
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
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setColor(color.value)}
                      title={color.name}
                    />
                  )
                })}
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
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Negrito"
        >
          <SvgIcon src={boldIcon} size={15} alt="Negrito" />
        </button>
        <button
          className={`toolbar-btn ${editor.isActive('italic') ? 'active' : ''}`}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Itálico"
        >
          <SvgIcon src={italicIcon} size={15} alt="Itálico" />
        </button>
        <button
          className={`toolbar-btn ${editor.isActive('underline') ? 'active' : ''}`}
          onMouseDown={(e) => e.preventDefault()}
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
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          title="Alinhar à Esquerda"
        >
          <SvgIcon src={alignLeftIcon} size={15} alt="Alinhar à Esquerda" />
        </button>
        <button
          className={`toolbar-btn ${editor.isActive({ textAlign: 'center' }) ? 'active' : ''}`}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          title="Centralizar"
        >
          <SvgIcon src={alignCenterIcon} size={15} alt="Centralizar" />
        </button>
        <button
          className={`toolbar-btn ${editor.isActive({ textAlign: 'right' }) ? 'active' : ''}`}
          onMouseDown={(e) => e.preventDefault()}
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
