import React from 'react'
import { Minus, Square, X } from 'lucide-react'
import icon from '../../../../../resources/icon.png'

interface TitlebarProps {
  activeNoteTitle?: string
}

export const Titlebar: React.FC<TitlebarProps> = ({ activeNoteTitle }) => {
  const handleMinimize = () => {
    window.electronAPI.minimize()
  }

  const handleMaximize = () => {
    window.electronAPI.maximize()
  }

  const handleClose = () => {
    window.electronAPI.close()
  }

  return (
    <div className="titlebar drag">
      <div className="titlebar-brand no-drag">
        <img src={icon} alt="App Icon" className="titlebar-icon" draggable="false" />
        <div className="titlebar-logo-text">
          <span className="logo-vault">VAULT</span>
          <span className="logo-notes">NOTES</span>
        </div>
      </div>

      <div className="titlebar-title">
        {activeNoteTitle ? activeNoteTitle.toUpperCase() : 'CYBERPUNK NOTE SYSTEM'}
      </div>

      <div className="titlebar-controls no-drag">
        <button onClick={handleMinimize} className="control-btn minimize" title="Minimizar">
          <Minus size={14} />
        </button>
        <button onClick={handleMaximize} className="control-btn maximize" title="Maximizar">
          <Square size={12} />
        </button>
        <button onClick={handleClose} className="control-btn close" title="Fechar">
          <X size={14} />
        </button>
      </div>
    </div>
  )
}

export default Titlebar
