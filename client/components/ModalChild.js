import React from 'react'

export default function ModalChild({ value, handleInputChange, deleteFunc, toggleModal }) {
  return (
    <React.Fragment>
      <p>Enter the secret password</p>
      <input type="text" value={value} name="delete_password" onChange={handleInputChange}/>
      <button onClick={deleteFunc} type="submit" className="btn">Submit</button>
      <button onClick={toggleModal} className="btn">Cancel</button>  
  </React.Fragment>
  )
}
