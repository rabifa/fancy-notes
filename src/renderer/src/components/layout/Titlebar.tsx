import React, { useState, useEffect } from 'react'
import brandIcon from '../../assets/images/vault-notes.png'
import minimizeIcon from '../../assets/icons/minimize-icon.svg'
import maximizeIcon from '../../assets/icons/maxmize-icon.svg'
import reduceIcon from '../../assets/icons/reduce-icon.svg'
import closeIcon from '../../assets/icons/close-icon.svg'
import SvgIcon from '../common/SvgIcon'

interface TitlebarProps {
  activeNoteTitle?: string
}

export const Titlebar: React.FC<TitlebarProps> = ({ activeNoteTitle }) => {
  const [isMaximized, setIsMaximized] = useState(false)

  useEffect(() => {
    if (window.electronAPI?.isMaximized) {
      window.electronAPI
        .isMaximized()
        .then(setIsMaximized)
        .catch(() => {})
    }

    if (window.electronAPI?.onStateChanged) {
      const cleanup = window.electronAPI.onStateChanged((maximized) => {
        setIsMaximized(maximized)
      })
      return cleanup
    }
    return undefined
  }, [])

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
        <img src={brandIcon} alt="App Icon" className="titlebar-icon" draggable="false" />
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
          <SvgIcon src={minimizeIcon} size={12} alt="Minimizar" />
        </button>
        <button
          onClick={handleMaximize}
          className="control-btn maximize"
          title={isMaximized ? 'Restaurar' : 'Maximizar'}
        >
          <SvgIcon
            src={isMaximized ? reduceIcon : maximizeIcon}
            size={12}
            alt={isMaximized ? 'Restaurar' : 'Maximizar'}
          />
        </button>
        <button onClick={handleClose} className="control-btn close" title="Fechar">
          <SvgIcon src={closeIcon} size={12} alt="Fechar" />
        </button>
      </div>
    </div>
  )
}

export default Titlebar
