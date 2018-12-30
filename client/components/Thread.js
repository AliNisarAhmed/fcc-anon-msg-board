import React, { Component } from 'react'
import Axios from 'axios';
import dayjs from 'dayjs';
import Modal from './Modal';
import ModalChild from './ModalChild';

export default class Thread extends Component {
  state = {
    thread: null,
    newReply: '',
    secretPassword: '',
    showModal: false,
    toggledReply: '',
    error: '',
    delete_password: '',
    success: ''
  }

  componentDidMount() {
    this.fetchThread();
  }

  fetchThread = async () => {
    let url = `/api/replies/${this.props.match.params.board}?thread_id=${this.props.match.params.thread_id}`
    let res = await Axios.get(url);
    this.setState({thread: res.data});
  }

  handleInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleFormSubmit = async (e) => {
    e.preventDefault();
    let { newReply, secretPassword } = this.state;
    this.setState({ newReply: '', secretPassword: '' });
    let url = `/api/replies/${this.props.match.params.board}`;
    console.log(url);
    let res = await Axios({
      method: 'post',
      url,
      data: {
        text: newReply,
        delete_password: secretPassword,
        thread_id: this.props.match.params.thread_id  
      }
    });    
    this.fetchThread();
  }

  toggleModal = (e) => {
    if (this.state.toggledReply) {
      this.setState({toggledReply: '', delete_password: ''});
    } else {
      this.setState({toggledReply: e.target.name});
    }
    console.log('modal toggled');
    this.setState((state) => ({showModal: !state.showModal}));
  }

  deleteReply = async () => {
    try {
      let url = `/api/replies/${this.props.match.params.board}`;
      await Axios({
        method: 'delete',
        url,
        data: {
          thread_id: this.props.match.params.thread_id,
          reply_id: this.state.toggledReply,
          delete_password: this.state.delete_password
        }
      });
      this.setState({success: 'Successfully deleted'});
      setTimeout(() => this.setState({success: ''}), 1500);
      this.toggleModal();
      this.fetchThread();
    } catch (error) {
      this.setState({error: 'Error Deleting Reply'});
      setTimeout(() => this.setState({error: null}), 1500);
    }
  }
  
  render() {
    return (
      <div>
        <h1>{this.state.thread && this.state.thread.text}</h1>
        <h4>Post a reply</h4>
        <form className="container" onSubmit={this.handleFormSubmit}>
          <input type="text" name="newReply" value={this.state.newReply} name="newReply" onChange={this.handleInputChange} placeholder="Reply Text..." />
          <input type="text" name="secretPassword" value={this.state.secretPassword} onChange={this.handleInputChange} placeholder="Secret Password" />
          <button className="btn" type="submit">Submit<i className="material-icons right">send</i></button>
        </form>
        {this.state.error && <p className="red-text">{this.state.error}</p>}
        {this.state.success && <p className="green-text">{this.state.success}</p>}
        {
          this.state.thread && this.state.thread.replies.length > 0 ? 
          this.state.thread.replies.map(reply => (
            <div className="card" key={reply._id}>
              <div className="card-content">
                <span className="card-title">{reply.text}</span>
                <p className="grey-text">Dated: {dayjs(reply.created_on).format('DD MMM YYYY, H:m:sA')}</p>
              </div>
              <div className="card-action">
                <button className="btn" onClick={this.toggleModal} name={reply._id}>Delete<i className="material-icons right">delete</i></button>
              </div>
            </div>
          )) : (
            <p>No replies yet...</p>
          )

        }
        {
          this.state.showModal ? (
            <Modal toggleModal={this.toggleModal}>
              <ModalChild 
                value={this.state.delete_password}
                deleteFunc={this.deleteReply}
                handleInputChange={this.handleInputChange}
                toggleModal={this.toggleModal}
              />  
            </Modal>
          ) : null
        }
      </div>
    )
  }
}
