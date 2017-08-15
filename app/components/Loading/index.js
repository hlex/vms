import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Loading extends Component {

  static propTypes = {
    baseURL: PropTypes.string.isRequired,
    text: PropTypes.string,
  }

  static defaultProps = {
    text: 'กำลังดำเนินการ',
  }

  render() {
    const { text, baseURL } = this.props;
    return (
      <div className="loading">
        <img src={`${baseURL}/images/loading.gif`} alt="" />
        <h3>{text}</h3>
      </div>
    );
  }
}

export default Loading;
