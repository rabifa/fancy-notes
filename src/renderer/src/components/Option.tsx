
export const Option = () => {
  return (
    <>
      <div className="optionBar">
        <div className="fileOption">
          <button>Save</button>
        </div>
        <div className="textOption">
          <button>Checkbox</button>
          <button>Text Color</button>
          <button>Background Color</button>
        </div>
        <div className="fontOption">
          <button>Bold</button>
          <button>Italic</button>
          <button>Undersocore</button>
        </div>
        <div className="alignOption">
          <button>Left</button>
          <button>Justify</button>
          <button>Right</button>
        </div>
      </div>
    </>
  )
}

export default Option