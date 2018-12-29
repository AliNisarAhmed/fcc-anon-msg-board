import React, { Component } from 'react'
import Axios from 'axios';
import { Link } from 'react-router-dom';

export default class Home extends Component {
  state = {
    boards: [],
    newBoard: '',
  }

  componentDidMount() {
    this.fetchBoards();
  }

  fetchBoards = async () => {
    let response = await Axios.get('/api/boards');
    console.log(response);
    this.setState({ boards: response.data });
  }

  handleInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  onNewBoardFormSubmit = async (e) => {
    e.preventDefault();
    let { newBoard } = this.state;
    this.setState({newBoard: ''});
    await Axios.post(`api/new/${newBoard}`);
    this.fetchBoards();
  }

  render() {
    return (
      <div>
        <h1>Anonymous Message Board</h1>
        <h2>A place...</h2>
        <ul>
          <li>Where YOU remain completely anonymous (promise!)</li>
          <li>Where WE (NSA) don't track your clicks or your data or store any malware err cookies on your PC</li>
          <li>Where you can post any filth or depravity your mind can conceive</li>
          <li>Where you can make all sorts of personal attacks or logical fallacies without fear of being downvoted to oblivion coz we dont give a flying f*ck abt Karma</li>
          <li>Where you won't be ostracized or kicked out for hurting people's teeny tiny feelings (f*ck people's feelings, and f*ck people)</li>
          <li>Where you won't be banned for thought crimes (unlike other "social" medias)</li>
        </ul>
        <p>So wtf are you waiting for, post your shit in the board of your choice below</p>
        <form onSubmit={this.onNewBoardFormSubmit}>
          <label>Create a Board
            <input type="text" value={this.state.newBoard} onChange={this.handleInputChange} name="newBoard" />
          </label>
          <button type="submit" className="btn">Submit</button>
        </form>  
        {
          this.state.boards.length === 0 ?
          <h4>Soooo empty!!! Let's create a board to get started!</h4> :
          this.state.boards.map(board => (
            <div key={board._id}>
              <p>Board: <Link to={`/b/${board.board}`}> { board.board } </Link></p>
              <p>threads: {board.threads.length}</p>
            </div>
          ))
        }
      </div>
    )
  }
}
