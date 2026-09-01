/// <reference types="vite/client" />
export {}

declare global {
  interface Window {
    electronAPI: {
      minimize: () => void
      maximize: () => void
      close: () => void
      isMaximized?: () => Promise<boolean>
      onStateChanged?: (callback: (isMaximized: boolean) => void) => () => void
    }
  }
}
