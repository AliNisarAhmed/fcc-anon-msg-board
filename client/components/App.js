import React, { Component } from 'react'
import { Switch, Route, Link } from 'react-router-dom';
import logo from '../images/Logo.svg';

import Home from './Home';
import Board from './Board';
import Thread from './Thread';

export default class App extends Component {
  
  render() {
    return (
      <div>
        <nav className="teal">
          <div className="nav-wrapper">
            <Link className="brand-logo center" to="/"><img src={logo} className="circle" width="100" height="60" alt="Logo"/></Link>
          </div>
        </nav>
        <div className="container">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/b/:board" component={Board} />
            <Route exact path="/b/:board/:thread_id" component={Thread} />  
          </Switch>
        </div>
      </div>
    )
  }
}
