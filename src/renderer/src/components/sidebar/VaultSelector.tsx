import React, { useState, useRef, useEffect } from 'react'
import { Folder, ChevronDown, Plus } from 'lucide-react'
import { VaultState } from '../../types/vault'

interface VaultSelectorProps {
  vaultState: VaultState
  onSelectVault: (path: string) => void
  onAddVault: () => void
}

export const VaultSelector: React.FC<VaultSelectorProps> = ({
  vaultState,
  onSelectVault,
  onAddVault
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

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

  return (
    <div className="vault-selector-container" ref={dropdownRef}>
      <button className="vault-selector-trigger" onClick={() => setIsOpen(!isOpen)}>
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
    </div>
  )
}

export default VaultSelector
