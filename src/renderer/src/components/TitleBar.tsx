import React from 'react'
import icon from '../../../../resources/icon.png'

const TitleBar: React.FC = () => {

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

// const styles = {
//   titleBar: {
//     display: 'flex',
//     justifyContent: 'flex-end',
//     backgroundColor: '#2f2f2f',
//     padding: '10px'
//   },
//   button: {
//     background: 'none',
//     border: 'none',
//     color: 'white',
//     fontSize: '16px',
//     marginLeft: '10px',
//     cursor: 'pointer',
//     padding: '5px'
//   }
// }

export default TitleBar