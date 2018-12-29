import React, { Component } from 'react'
import Axios from 'axios';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

export default class Board extends Component {
  state = {
    threads: [],
    newThread: '',
    secretPassword: '',
  }

  componentDidMount() {
    this.fetchThreads();
  }

  fetchThreads = async () => {
    const url = `/api/threads/${this.props.match.params.board}`;
    let response = await Axios.get(url);
    this.setState({threads: response.data});
  }

  handleInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleFormSubmit = async (e) => {
    e.preventDefault();
    let { newThread, secretPassword } = this.state;
    this.setState({newThread: '', secretPassword: ''});
    let res = await Axios.post(`/api/threads/${this.props.match.params.board}`, {
      text: newThread,
      delete_password: secretPassword
    });
    console.log(newThread, secretPassword);
    console.log(res);
    this.fetchThreads();
  }

  render() {
    return (
      <div>
        <p>Submit a new thread</p>
        <form onSubmit={this.handleFormSubmit}>
          <textarea value={this.state.newThread} name="newThread" onChange={this.handleInputChange} placeholder="Thread text..." rows="4" cols="50" ></textarea><br />
          <input type="text" placeholder="Secret password" name="secretPassword" onChange={this.handleInputChange} value={this.state.secretPassword} />
          <button type="submit" className="btn">Submit</button>
        </form>
        {
          this.state.threads.length === 0 ?
          <h4>No Threads, create a thread</h4> :
          this.state.threads.map(thread => (
            <div key={thread._id}>
              <h3>{thread.text}</h3>
              <p>created on: {dayjs(thread.created_on).format('DD MMM YYYY, H:m:sA')}</p>
              <p>Total replies: {thread.replies.length}</p>
              <p>last updated on: {dayjs(thread.bumped_on).format('DD MMM YYYY, H:m:sA')}</p>
              <Link to={`${this.props.match.url}/${thread._id}`}>See Full Thread </Link>
              <hr />
            </div>
          ))
        }
        
      </div>
    )
  }
}
