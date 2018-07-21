import React, { Component } from 'react';
import PropTypes from 'prop-types';

import loading from '../../images/loading.gif'

class Loading extends Component {

  static propTypes = {
    text: PropTypes.string,
    children: PropTypes.node
  }

  static defaultProps = {
    text: 'กำลังดำเนินการ',
    children: null
  }

  hasChildren = () => {
    const { children } = this.props;
    return children !== null;
  }

  renderText = () => {
    if (this.hasChildren) {
      return this.props.children;
    }
    return <h3>{this.props.text}</h3>;
  }

  render() {
    return (
      <div className="loading">
        <img src={loading} alt="" />
        {this.renderText()}
      </div>
    );
  }
}

export default Loading;
