import React, { Component } from 'react'
import Axios from 'axios';

import BoardList from './BoardList';
import Modal from './Modal';
import NewBoardForm from './NewBoardForm';
import NewItemButton from './NewItemButton';
import AlertModal from './AlertModal';

export default class Home extends Component {
  state = {
    boards: [],
    newBoard: '',
    error: '',
    success: '',
    showModal: false,
  }

  componentDidMount() {
    M.AutoInit();
    this.fetchBoards();
  }

  fetchBoards = async () => {
    let response = await Axios.get('/api/boards');
    this.setState({ boards: response.data });
  }

  handleInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      error: ''
    });
  }

  onNewBoardFormSubmit = async (e) => {
    try {
      e.preventDefault();
      let { newBoard } = this.state;
      let res = await Axios.post(`api/new/${newBoard}`);
      this.setState({newBoard: '', success: 'Success! Board Created'});
      setTimeout(() => {
        this.setState({success: ''});
      }, 2000);
      this.toggleModal();
      this.fetchBoards();
    } catch (error) {
      this.toggleModal();
      this.setState({error: "Error creating Board"});
      setTimeout(() => this.setState({error: false}), 2000);
    }
  }

  toggleModal = (e) => {
    // if (this.state.toggledThread) {
    //   this.setState({toggledThread: '', delete_password: ''});
    // } else {
    //   this.setState({toggledThread: e.target.name});
    // }
    // console.log('modal toggled');
    this.setState((state) => ({showModal: !state.showModal}));
  }

  render() {
    return (
      <div className="buttonContainer">
        <NewItemButton toggleModal={this.toggleModal} tooltipText="Create a New Board" />
        <h1>Anonymous Message Board</h1>
        <h3>A place...</h3>
        <ul className="collection">
          <li className="collection-item">Where YOU remain completely anonymous (promise!)</li>
          <li className="collection-item">Where WE (NSA) don't track your clicks or your data (or your location or your whole life), nor do we care about you enough to install any spyware on your PC</li>
          <li className="collection-item">Where you can post any filth or depravity your mind can conceive</li>
          <li className="collection-item">Where you can make all sorts of personal attacks or logical fallacies without fear of being downvoted to oblivion coz we dont give a flying f*ck abt Karma (plus, it's hard to implement Karma logic, we are'nt that pro yet!)</li>
          <li className="collection-item">Where you won't be ostracized or kicked out for hurting people's teeny tiny feelings</li>
          <li className="collection-item">Where you won't be banned for thought crimes</li>
        </ul>
        <h5>So what are you waiting for? post away in the board of your choice below</h5> 
        {
          this.state.boards.length === 0 ?
          <h4>Soooo empty!!! Let's create a board to get started!</h4> :
          <div className="row">
            {
              this.state.boards.map(board => <BoardList key={board._id} board={board} />)
            }
          </div>
        }
        {
          this.state.showModal ? (
            <Modal>
              <NewBoardForm 
              onNewBoardFormSubmit={this.onNewBoardFormSubmit} 
              newBoard={this.state.newBoard} 
              handleInputChange={this.handleInputChange}
              toggleModal={this.toggleModal}
              />
            </Modal>
          ) : null
        }
        {
          this.state.error ? (
            <AlertModal classProp="red">
              {this.state.error}
            </AlertModal>
          ) : null
        }
        {
          this.state.success ? (
            <AlertModal classProp="green">
              {this.state.success}
            </AlertModal>
          ): null
        }
      </div>
    )
  }
}
