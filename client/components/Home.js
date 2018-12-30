import React, { Component } from 'react'
import Axios from 'axios';
import BoardList from './BoardList';

export default class Home extends Component {
  state = {
    boards: [],
    newBoard: '',
    error: '',
    success: '',
  }

  componentDidMount() {
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
      this.setState({newBoard: '', success: 'Successfully created the board'});
      setTimeout(() => {
        this.setState({success: ''});
      }, 2000);
      this.fetchBoards();
    } catch (error) {
      this.setState({error: 'Error: Either the board already exists or some other fuckup! anyways, try something else'});
    }
  }

  render() {
    return (
      <div>
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
        <p>So wtf are you waiting for? post your shit in the board of your choice below</p>
        <form className="container input-field" onSubmit={this.onNewBoardFormSubmit}>
          <label>Create a Board</label>
          <input type="text" value={this.state.newBoard} onChange={this.handleInputChange} name="newBoard" required/>
          <button type="submit" className="btn">Submit<i className="material-icons right">send</i></button>
        </form>
        { this.state.error && <p className="red-text">{this.state.error}</p> }  
        { this.state.success && <p className="green-text">{this.state.success}</p> } 
        { !this.state.error && !this.state.success && <br />} 
        {
          this.state.boards.length === 0 ?
          <h4>Soooo empty!!! Let's create a board to get started!</h4> :
          <div className="row">
            {
              this.state.boards.map(board => <BoardList key={board._id} board={board} />)
            }
          </div>
        }
      </div>
    )
  }
}
