import React, { useState } from 'react'
import { FolderOpen, ShieldAlert } from 'lucide-react'

interface OnboardingModalProps {
  isOpen: boolean
  onSelectFolder: () => Promise<void>
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onSelectFolder
}) => {
  const [isSelecting, setIsSelecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSelect = async () => {
    setIsSelecting(true)
    setError(null)
    try {
      await onSelectFolder()
    } catch (err) {
      console.error(err)
      setError('Erro ao selecionar pasta. Tente novamente.')
    } finally {
      setIsSelecting(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="onboarding-modal">
        {/* Neon decorative bar at the top */}
        <div className="onboarding-modal-top-bar" />

        <div className="onboarding-icon-container">
          <div className="onboarding-icon-glow">
            <FolderOpen className="onboarding-icon" size={32} />
          </div>
        </div>

        <h2 className="onboarding-title">VAULT NOTES</h2>
        
        <p className="onboarding-desc">
          Organize suas anotações com visual Cyberpunk e formatação rica. 
          Para começar, selecione uma pasta no seu computador para ser seu primeiro <strong>Vault</strong> (cofre).
        </p>

        <button 
          className="onboarding-btn" 
          onClick={handleSelect}
          disabled={isSelecting}
        >
          <FolderOpen size={16} />
          <span>{isSelecting ? 'SELECIONANDO...' : 'SELECIONAR PASTA VAULT'}</span>
        </button>

        {error && (
          <div className="onboarding-error">
            <ShieldAlert size={14} />
            <span>{error}</span>
          </div>
        )}

        <div className="onboarding-footer-text">
          Você poderá alterar ou adicionar novos Vaults a qualquer momento.
        </div>
      </div>
    </div>
  )
}

export default OnboardingModal
