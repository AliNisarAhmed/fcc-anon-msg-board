import React, { Component } from 'react'

export default class App extends Component {
  state = {
    data: []
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    let res = await fetch('/api/data');
    let data = await res.json();
    console.log(data);
    this.setState({data});
  }
  
  render() {
    return (
      <div>
        {
          this.state.data &&
          this.state.data.map(user => (
            <div>
              <p>Name: {user.name}</p>
              <p>Age: {user.age}</p>
            </div>
          ))
        }
      </div>
    )
  }
}
