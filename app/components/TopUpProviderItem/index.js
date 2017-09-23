import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cuid from 'cuid';

class TopUpProviderItem extends Component {

  static propTypes = {
    baseURL: PropTypes.string.isRequired,
    item: PropTypes.shape({}).isRequired,
    handleClick: PropTypes.func.isRequired,
  }

  render() {
    const { baseURL, item, handleClick } = this.props;
    return (
      <a
        className="box"
        key={cuid()}
        onClick={() =>
          handleClick('/topup/inputMSISDN', item)}
      >
        <div className="item">
          <div className="photo-item">
            <img alt="" src={`${baseURL}/${item.src}`} />
          </div>
        </div>
      </a>
    );
  }
}

export default TopUpProviderItem;
