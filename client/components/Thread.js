import React, { Component } from 'react'
import Axios from 'axios';

export default class Thread extends Component {
  state = {
    thread: null
  }

  componentDidMount() {
    this.fetchThread();
  }

  fetchThread = async () => {
    let url = `/api/replies/${this.props.match.params.board}?thread_id=${this.props.match.params.thread_id}`
    let res = await Axios.get(url);
    this.setState({thread: res.data});
  }
  
  render() {
    return (
      <div>
        <h1>{this.state.thread && this.state.thread.text}</h1>
        {
          this.state.thread &&
          this.state.thread.replies.map(reply => (
            <div>
              <p>Text: {reply.text}</p>
              <p>Dated: {reply.created_on}</p>
            </div>
          ))
        }
      </div>
    )
  }
}
