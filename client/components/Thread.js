import React, { Component } from 'react'
import Axios from 'axios';
import dayjs from 'dayjs';

import Modal from './Modal';
import ModalChild from './ModalChild';
import NewItemForm from './NewItemForm';
import FourOFour from './FourOFour';
import AlertBox from './AlertBox';

import mongoose from 'mongoose';
import NewItemButton from './NewItemButton';

export default class Thread extends Component {
  state = {
    thread: null,
    newReply: '',
    secretPassword: '',
    showModal: false,
    toggledReply: '',
    error: '',
    delete_password: '',
    success: '',
    showNewReplyModal: false,
  }

  componentDidMount() {
    M.AutoInit();
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
    try {
      let { newReply, secretPassword } = this.state;
      this.setState({ newReply: '', secretPassword: '' });
      let url = `/api/replies/${this.props.match.params.board}`;
      let res = await Axios({
        method: 'post',
        url,
        data: {
          text: newReply,
          delete_password: secretPassword,
          thread_id: this.props.match.params.thread_id  
        }
      });
      this.setState({success: 'Success!'});
      setTimeout(() => this.setState({success: ''}), 2000);    
      this.toggleNewReplyModal();
      this.fetchThread();
    } catch (error) {
      this.setState({error: 'Error!'});
      setTimeout(() => this.setState({error: ''}), 2000);
    }
  }

  toggleModal = (e) => {
    if (this.state.toggledReply) {
      this.setState({toggledReply: '', delete_password: ''});
    } else {
      this.setState({toggledReply: e.target.name});
    }
    this.setState((state) => ({showModal: !state.showModal}));
  }

  toggleNewReplyModal = () => {
    this.setState((state) => ({showNewReplyModal: !state.showNewReplyModal}));
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
      setTimeout(() => this.setState({success: ''}), 2000);
      this.toggleModal();
      this.fetchThread();
    } catch (error) {
      this.setState({error: 'Password does not match'});
      setTimeout(() => this.setState({error: null}), 2000);
    }
  }
  
  render() {
    if (mongoose.Types.ObjectId.isValid(this.props.match.params.thread_id)) {
      return (
        <div className="buttonContainer">
          <NewItemButton toggleModal={this.toggleNewReplyModal} tooltipText="New Reply" />  
          <h3>{this.state.thread && this.state.thread.text}</h3>
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
          {
            this.state.showNewReplyModal ? (
              <Modal>
                <NewItemForm 
                    handleFormSubmit={this.handleFormSubmit}
                    newItem={this.state.newReply} 
                    handleInputChange={this.handleInputChange} 
                    secretPassword={this.state.secretPassword}
                    toggleNewItemModal={this.toggleNewReplyModal}
                    name="newReply"
                  />
              </Modal>
            ): null
          }
          <AlertBox error={this.state.error} success={this.state.success} />
        </div>
      )
    } else {
      return (
        <FourOFour />
      )
    }
  }
}
