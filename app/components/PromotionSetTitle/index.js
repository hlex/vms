import React, { Component } from 'react';
import PropTypes from 'prop-types';

import defaultBgImage from '../../images/bg-product-17.png';

class PromotionSetTitle extends Component {

  static propTypes = {
    comboItem1: PropTypes.string.isRequired,
    comboItem2: PropTypes.string.isRequired,
    bgImage: PropTypes.string.isRequired,
    baseURL: PropTypes.string.isRequired,
  };
  getBackgroundImageUrl = () => {
    const { baseURL, bgImage } = this.props;
    if (!bgImage) return defaultBgImage;
    return `${baseURL}${bgImage}`;
  }
  render() {
    const { baseURL, comboItem1, comboItem2 } = this.props;
    return (
      <div className="promotion-title">
        <div className="_center">
          <h1>ซื้อเครื่องดื่ม/ขนม</h1>
        </div>
        <div
          className="bg-img"
          style={{ height: '500px', width: '100%', backgroundImage: `url(${this.getBackgroundImageUrl()})` }}
        >
          <div className="product-combo-item">
            <img alt="" src={`${baseURL}/${comboItem1}`} />
            <span />
            <img alt="" src={`${baseURL}/${comboItem2}`} />
          </div>
        </div>
      </div>
    );
  }
}

export default PromotionSetTitle;
