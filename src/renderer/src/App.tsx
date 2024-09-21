// import electronLogo from './assets/electron.svg'
import icon from '../../../resources/icon.png'
function App(): JSX.Element {
  return (
    <>
      <div className="titlebar drag">
        <img className="appIcon" src={icon} />
        <p>FancyNotes</p>
        <div className="window-controls">
          <button>_</button>
          <button>[]</button>
          <button>X</button>
        </div>
      </div>
    </>
  )
}

export default App
