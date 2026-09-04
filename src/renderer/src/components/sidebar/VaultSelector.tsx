import React, { useState, useRef, useEffect } from 'react'
import { Folder, ChevronDown, Plus, FolderOpen } from 'lucide-react'
import { VaultState } from '../../types/vault'

interface VaultSelectorProps {
  vaultState: VaultState
  onSelectVault: (path: string) => void
  onAddVault: () => void
}

interface VaultContextMenuState {
  vaultPath: string
  x: number
  y: number
}

export const VaultSelector: React.FC<VaultSelectorProps> = ({
  vaultState,
  onSelectVault,
  onAddVault
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [contextMenu, setContextMenu] = useState<VaultContextMenuState | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const contextMenuRef = useRef<HTMLDivElement>(null)

  const activeVaultName = vaultState.activeVaultPath
    ? vaultState.activeVaultPath.split(/[\\/]/).pop() || 'Vault'
    : 'Sem Vault'

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close the context menu on an outside click or Escape
  useEffect(() => {
    if (!contextMenu) return

    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setContextMenu(null)
      }
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setContextMenu(null)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [contextMenu])

  const openVaultContextMenu = (e: React.MouseEvent, vaultPath: string) => {
    e.preventDefault()
    e.stopPropagation()
    setContextMenu({ vaultPath, x: e.clientX, y: e.clientY })
  }

  const handleOpenFolder = () => {
    if (contextMenu) {
      window.api.vault.openFolder(contextMenu.vaultPath)
    }
    setContextMenu(null)
  }

  return (
    <div className="vault-selector-container" ref={dropdownRef}>
      <button
        className="vault-selector-trigger"
        onClick={() => setIsOpen(!isOpen)}
        onContextMenu={(e) => {
          if (vaultState.activeVaultPath) openVaultContextMenu(e, vaultState.activeVaultPath)
        }}
      >
        <div className="vault-trigger-info">
          <Folder className="vault-folder-icon" size={16} />
          <span className="vault-active-name" title={vaultState.activeVaultPath || ''}>
            {activeVaultName.toUpperCase()}
          </span>
        </div>
        <ChevronDown size={14} className={`vault-chevron ${isOpen ? 'open' : ''}`} />
      </button>

      {isOpen && (
        <div className="vault-dropdown">
          <div className="vault-dropdown-header">SEUS VAULTS</div>
          <div className="vault-list">
            {vaultState.vaults.map((vaultPath) => {
              const isSelected = vaultPath === vaultState.activeVaultPath
              const vaultName = vaultPath.split(/[\\/]/).pop() || vaultPath
              return (
                <button
                  key={vaultPath}
                  className={`vault-item ${isSelected ? 'active' : ''}`}
                  onClick={() => {
                    onSelectVault(vaultPath)
                    setIsOpen(false)
                  }}
                  onContextMenu={(e) => openVaultContextMenu(e, vaultPath)}
                  title={vaultPath}
                >
                  <Folder size={12} className="vault-item-icon" />
                  <span className="vault-item-name">{vaultName}</span>
                </button>
              )
            })}
          </div>
          <div className="vault-dropdown-divider"></div>
          <button
            className="vault-add-btn"
            onClick={() => {
              onAddVault()
              setIsOpen(false)
            }}
          >
            <Plus size={14} />
            <span>ADICIONAR VAULT</span>
          </button>
        </div>
      )}

      {contextMenu && (
        <div
          className="vault-context-menu"
          ref={contextMenuRef}
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button className="vault-context-menu-item" onClick={handleOpenFolder}>
            <FolderOpen size={13} />
            <span>Abrir pasta</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default VaultSelector
