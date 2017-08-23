import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Title extends Component {
  render() {
    return (
      <div className="title-wrapper">
        {
          this.props.children
        }
      </div>
    );
  }
}
