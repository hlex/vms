import React, { Component } from 'react';
import PropTypes from 'prop-types';

import loading from '../../images/loading.gif'

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
        <img src={loading} alt="" />
        <h3>{text}</h3>
      </div>
    );
  }
}

export default Loading;
