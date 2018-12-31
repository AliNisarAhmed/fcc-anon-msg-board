import React from 'react'

export default function NewBoardForm({ onNewBoardFormSubmit, newBoard, handleInputChange, toggleModal }) {
  return (
    <React.Fragment>
      <form className="container input-field" onSubmit={onNewBoardFormSubmit}>
      <label>Create a Board</label>
      <input type="text" value={newBoard} onChange={handleInputChange} name="newBoard" required/>
      <button type="submit" className="btn">Submit<i className="material-icons right">send</i></button>
      <button className="btn" onClick={toggleModal}>Cancel<i className="material-icons right">cancel</i></button>
      </form>
    </React.Fragment>
  )
}
