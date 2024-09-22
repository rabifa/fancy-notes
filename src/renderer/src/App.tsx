// import electronLogo from './assets/electron.svg'
import icon from '../../../resources/icon.png'
function App(): JSX.Element {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
  // const closeApp = (): void => window.electron.ipcRenderer.send('close-app')

  return (
    <>
      <div className="titlebar drag">
        <img className="appIcon no-drag" src={icon} />
        <p>FancyNotes</p>
        <div className="window-controls">
          <button>_</button>
          <button>[]</button>
          {/* <a className="no-drag" target="_blank" rel="noreferrer" onClick={}>Fechar</a> */}
          <a className="no-drag" target="_blank" rel="noreferrer">Fechar</a>
        </div>
      </div>
    </>
  )
}

export default App
