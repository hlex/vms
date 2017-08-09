import React, { Component } from 'react';

export default class Jumbotron extends Component {
  render() {
    return (
      <div className="vms-jumbotron">
        {
          this.props.children
        }
      </div>
    );
  }
}
