import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Loading extends Component {

  static propTypes = {
    text: PropTypes.string,
  }

  static defaultProps = {
    text: 'กำลังดำเนินการ',
  }

  render() {
    const { text } = this.props;
    return (
      <div className="loading">
        <img src="images/loading.gif" alt="" />
        <h3>{text}</h3>
      </div>
    );
  }
}

export default Loading;
