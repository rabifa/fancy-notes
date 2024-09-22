import icon from '../../../../resources/icon.png' 

export const TitleBar = () => {

  const handleMinimize = () => {
    window.electronAPI.minimize();
  };

  const handleMaximize = () => {
    window.electronAPI.maximize();
  };

  const handleClose = () => {
    window.electronAPI.close();
  };
  
  return (
    <>
      <div className='titleBar drag'>
        <div className='titleBarElements'>
          <img className="appIcon no-drag" src={icon} draggable="false"/>
          <p className='title'>FancyNotes</p>
        </div>
        <div className='windowControls no-drag'>
          <button onClick={handleMinimize}>
            _
          </button>
          <button onClick={handleMaximize}>
            [ ]
          </button>
          <button onClick={handleClose}>
            X
          </button>
        </div>
      </div>
    </>
  );
};

export default TitleBar