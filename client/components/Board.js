import React, { Component } from 'react'
import Axios from 'axios';
import Modal from './Modal';
import ThreadList from './ThreadList';
import ModalChild from './ModalChild';

export default class Board extends Component {
  state = {
    threads: [],
    newThread: '',
    secretPassword: '',
    toggleModal: '',
    toggledThread: '',
    delete_password: '',
    error: '',
    success: '',
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
    this.fetchThreads();
  }

  toggleModal = (e) => {
    if (this.state.toggledThread) {
      this.setState({toggledThread: '', delete_password: ''});
    } else {
      this.setState({toggledThread: e.target.name});
    }
    console.log('modal toggled');
    this.setState((state) => ({showModal: !state.showModal}));
  }

  deleteThread = async () => {
    try {
      let url = `/api/threads/${this.props.match.params.board}`;
      await Axios({
        method: 'delete',
        url,
        data: {
          thread_id: this.state.toggledThread,
          delete_password: this.state.delete_password
        }
      });
      this.setState({success: 'Successfully deleted'});
      setTimeout(() => this.setState({success: ''}), 2000);
      this.toggleModal();
      this.fetchThreads();
    } catch (error) {
      this.setState({error: 'Password does not match'});
      this.toggleModal();
      setTimeout(() => this.setState({error: null}), 2000);
    }
  }
  

  render() {
    return (
      <div>
        <h5>You are in... </h5><span>/b/</span><h2  className="boardInitials">{this.props.match.params.board}</h2>
        <form className="col container" onSubmit={this.handleFormSubmit}>
          <p>Create a new Thread?</p>
          <div className="input-field">
            <label htmlFor="newThread">Enter Thread Text</label>
            <textarea value={this.state.newThread} id="newThread" name="newThread" onChange={this.handleInputChange} className="materialize-textarea"></textarea>
          </div>
          <div className="input-field">
            <label htmlFor="secretPassword">Secret Password</label>
            <input type="text" id="secretPassword" name="secretPassword" onChange={this.handleInputChange} value={this.state.secretPassword} />
            </div>     
            <button type="submit" className="btn">Submit<i className="material-icons right">send</i></button>
        </form>
        <br />
        {this.state.error && <p className="red-text">{this.state.error}</p>}
        {this.state.success && <p className="green-text">{this.state.success}</p>}
        { this.state.threads.length && <h4>Latest Threads...</h4>}
        <div className="row">
          {
            this.state.threads.length === 0 ?
            <h4>No Threads, create a thread</h4> :
            this.state.threads.map(thread => <ThreadList key={thread._id} url={this.props.match.url} thread={thread} toggleModal={this.toggleModal} />)
          }
        </div>
        {
          this.state.showModal ? (
            <Modal toggleModal={this.toggleModal}>
              <ModalChild 
                value={this.state.delete_password} 
                handleInputChange={this.handleInputChange} 
                deleteFunc={this.deleteThread} 
                toggleModal={this.toggleModal}
              />
            </Modal>
          ) : null
        }
      </div>
    )
  }
}
