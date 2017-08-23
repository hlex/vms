import React, { Component } from 'react';

class ContentGrid extends Component {
  render() {
    return (
      <div className="content-grid-wrapper">
        {
          this.props.children
        }
      </div>
    );
  }
}

export default ContentGrid;
