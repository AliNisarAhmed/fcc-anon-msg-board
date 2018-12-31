import React from 'react'

export default function NewItemForm({ handleFormSubmit, newItem, handleInputChange, secretPassword, toggleNewItemModal, name }) {
  return (
    <React.Fragment>
      <form className="col" onSubmit={handleFormSubmit}>
        <p>Create a new {name === "newThread" ? 'Thread': "Reply"}</p>
        <div className="input-field">
          <label htmlFor={name}>Enter {name === "newThread" ? 'Thread': "Reply"} Text</label>
          <textarea value={newItem} id="newThread" name={name} onChange={handleInputChange} className="materialize-textarea" required></textarea>
        </div>
        <div className="input-field">
          <label htmlFor="secretPassword">Secret Password</label>
          <input type="text" id="secretPassword" name="secretPassword" onChange={handleInputChange} value={secretPassword} required />
        </div>     
        <button type="submit" className="btn">Submit<i className="material-icons right">send</i></button>
      </form>
      <button className="btn" onClick={toggleNewItemModal}>Cancel<i className="material-icons right">cancel</i></button>
    </React.Fragment>
  )
}
