import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Subheader extends Component {
  render() {
    return (
      <div className="subheader">
        {
          this.props.children
        }
      </div>
    );
  }
}

export default Subheader;
