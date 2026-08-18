import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  vault: {
    selectFolder: () => ipcRenderer.invoke('vault:select-folder'),
    getActiveVault: () => ipcRenderer.invoke('vault:get-active-vault'),
    setActiveVault: (vaultPath: string) => ipcRenderer.invoke('vault:set-active-vault', vaultPath),
    listNotes: (vaultPath: string) => ipcRenderer.invoke('vault:list-notes', vaultPath),
    readNote: (notePath: string) => ipcRenderer.invoke('vault:read-note', notePath),
    saveNote: (notePath: string, content: string) =>
      ipcRenderer.invoke('vault:save-note', notePath, content),
    createNote: (vaultPath: string, title: string, extension: string) =>
      ipcRenderer.invoke('vault:create-note', vaultPath, title, extension),
    deleteNote: (notePath: string) => ipcRenderer.invoke('vault:delete-note', notePath),
    renameNote: (notePath: string, newTitle: string) =>
      ipcRenderer.invoke('vault:rename-note', notePath, newTitle),
    exportTxt: (notePath: string, content: string) =>
      ipcRenderer.invoke('vault:export-txt', notePath, content),
    toggleFavorite: (notePath: string) => ipcRenderer.invoke('vault:toggle-favorite', notePath),
    watchChanges: (vaultPath: string) => ipcRenderer.invoke('vault:watch-changes', vaultPath),
    onFileChanged: (callback: (event: string, path: string) => void) => {
      const listener = (_event: unknown, data: { event: string; path: string }) =>
        callback(data.event, data.path)
      ipcRenderer.on('vault:file-changed', listener)
      return () => {
        ipcRenderer.removeListener('vault:file-changed', listener)
      }
    }
  }
}

console.log('Preload script carregado')

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('electronAPI', {
      minimize: () => ipcRenderer.send('window:minimize'),
      maximize: () => ipcRenderer.send('window:maximize'),
      close: () => ipcRenderer.send('window:close')
    })
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
