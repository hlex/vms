import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Content extends Component {

  static propTypes = {
  }

  render() {
    return (
      <div className="content-wrapper">
        {
          this.props.children
        }
      </div>
    );
  }
}
