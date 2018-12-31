import React, { Component } from 'react'
import Axios from 'axios';

import Modal from './Modal';
import ThreadList from './ThreadList';
import ModalChild from './ModalChild';
import NewItemForm from './NewItemForm';
import NewItemButton from './NewItemButton';
import AlertBox from './AlertBox';

export default class Board extends Component {
  state = {
    threads: [],
    newThread: '',
    secretPassword: '',
    showModal: false,
    toggledThread: '',
    delete_password: '',
    error: '',
    success: '',
    showNewThreadModal: false
  }

  componentDidMount() {
    M.AutoInit();
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
    try {
      let { newThread, secretPassword } = this.state;
      this.setState({newThread: '', secretPassword: ''});
      let res = await Axios.post(`/api/threads/${this.props.match.params.board}`, {
        text: newThread,
        delete_password: secretPassword
      });
      this.toggleNewThreadModal();
      this.fetchThreads();
      this.setState({success: 'Success! Thread Created'});
      setTimeout(() => this.setState({success: ''}), 2000);
    } catch (error) {
      this.setState({error: 'Error! Failed to create Thread'});
      setTimeout(() => this.setState({error: ''}), 2000);
    }
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

  toggleNewThreadModal = () => {
    this.setState((state) => ({showNewThreadModal: !state.showNewThreadModal}));
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
      <div className="buttonContainer">
        <NewItemButton toggleModal={this.toggleNewThreadModal} tooltipText="Create a New Thread" />
        <h5>You are in... </h5><span>/b/</span><h2  className="boardInitials">{this.props.match.params.board}</h2>
        <div className="row">
          {
            this.state.threads.length === 0 ?
            <h5>No Threads, create a thread...</h5> : (
              <React.Fragment>
                <h3>Latest Threads...</h3>
                {
                  this.state.threads.map(thread => <ThreadList key={thread._id} url={this.props.match.url} thread={thread} toggleModal={this.toggleModal} />)
                }
              </React.Fragment>
            )
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
        {
          this.state.showNewThreadModal ? (
            <Modal>
              <NewItemForm 
                handleFormSubmit={this.handleFormSubmit}
                newItem={this.state.newThread} 
                handleInputChange={this.handleInputChange} 
                secretPassword={this.state.secretPassword}
                toggleNewItemModal={this.toggleNewThreadModal}
                name="newThread"
              />
            </Modal>
          ) : null
        }
        <AlertBox error={this.state.error} success={this.state.success} />
      </div>
    )
  }
}
