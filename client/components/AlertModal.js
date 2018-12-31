import React from 'react';
import { createPortal } from 'react-dom';

const alertRoot = document.getElementById('alert');

export default class AlertModal extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }
  
  componentDidMount() {
    alertRoot.appendChild(this.el);
    this.el.classList.add(this.props.classProp);
  }

  componentWillUnmount() {
    this.el.classList.remove(this.props.classProp);
    alertRoot.removeChild(this.el);
  }

  render() {
    return createPortal(this.props.children, this.el);
  }
}
