import React from 'react'
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

export default function ThreadList({ thread, url, toggleModal }) {
  return (
    <div className="card horizontal col s12">
      <div className="card-stacked">
        <div className="card-content">
          <h3>{thread.text}</h3>
          <p>{thread.replies.length} Replies Total ({thread.replies.length > 3 ? thread.replies.length - 3 : 0} hidden)</p>
          {
            thread.replies.length > 0 && (
              <React.Fragment>
                <p className="grey-text">latest comments...</p>
                <ul className="collection">
                  <li className="collection-item truncate">{thread.replies[0].text}</li>
                  {thread.replies[1] && <li className="collection-item truncate">{thread.replies[1].text}</li>}
                  {thread.replies[2] && <li className="collection-item truncate">{thread.replies[2].text}</li>}
                </ul>
              </React.Fragment>
            )
          }
          <p className="grey-text">created on: {dayjs(thread.created_on).format('DD MMM YYYY, H:m:sA')}</p>
          <p className="grey-text">last updated on: {dayjs(thread.bumped_on).format('DD MMM YYYY, H:m:sA')}</p>
        </div>
        <div className="card-action">
          <Link className="btn" to={`${url}/${thread._id}`}>See Full Thread<i className="material-icons right">
          open_in_browser
          </i></Link>
          <button className="btn" onClick={toggleModal} name={thread._id}>Delete Thread<i className="material-icons right">
          delete_forever
          </i></button> 
        </div>
      </div>
    </div>
  )
}
