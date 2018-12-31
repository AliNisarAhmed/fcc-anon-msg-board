import React from 'react'

export default function NewItemButton({ toggleModal, tooltipText }) {
  return (
    <React.Fragment>
      <button 
        onClick={toggleModal} 
        className="btn-floating fixed-btn btn-large tooltipped" 
        data-position="top" 
        data-tooltip={tooltipText}
      >
        <i className="material-icons">edit</i>
      </button>
    </React.Fragment>
  )
}
