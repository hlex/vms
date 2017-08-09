import React, { Component } from 'react';

class ContentGrid extends Component {
  render() {
    return (
      <div className="content-long-wrapper">
        {
          this.props.children
        }
      </div>
    );
  }
}

export default ContentGrid;
