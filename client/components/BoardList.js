import React from 'react'
import { Link } from 'react-router-dom';

export default function BoardList({ board }) {
  return (
    <div className="col l4 m4 s6">
      <div className="card hoverable">
        <div className="card-content">
          <Link to={`/b/${board.board}`} className="card-title center-align"> { board.board } </Link>
          <p className="center-align">threads: {board.threads.length}</p>
        </div>
      </div>
    </div>
  )
}
