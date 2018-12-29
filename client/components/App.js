import React, { Component } from 'react'
import { Link, Route } from 'react-router-dom';

import Home from './Home';
import Board from './Board';
import Thread from './Thread';

export default class App extends Component {
  
  render() {
    return (
      <div className="container">
        <Route exact path="/" component={Home} />
        <Route exact path="/b/:board" component={Board} />
        <Route exact path="/b/:board/:thread_id" component={Thread} />
      </div>
    )
  }
}
