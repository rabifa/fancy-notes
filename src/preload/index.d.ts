import { ElectronAPI } from '@electron-toolkit/preload'
import { VaultAPI } from '../renderer/src/types/vault'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      vault: VaultAPI
    }
    electronAPI: {
      minimize: () => void
      maximize: () => void
      close: () => void
    }
  }
}

