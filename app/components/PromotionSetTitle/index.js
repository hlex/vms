import React, { Component } from 'react';
import PropTypes from 'prop-types';

class PromotionSetTitle extends Component {

  static propTypes = {
    comboItem1: PropTypes.string,
    comboItem2: PropTypes.string,
    bgImage: PropTypes.string,
    baseURL: PropTypes.string.isRequired,
  };

  static defaultProps = {
    comboItem1: 'images/product-1.png',
    comboItem2: 'images/product-2.png',
    bgImage: 'images/bg-product-17.png',
  };

  render() {
    const { baseURL, comboItem1, comboItem2, bgImage } = this.props;
    return (
      <div className="promotion-title">
        <div className="_center">
          <h1>ซื้อเครื่องดื่ม/ขนม</h1>
        </div>
        <div
          className="bg-img"
          style={{ height: '500px', width: '100%', backgroundImage: `url(${baseURL}/${bgImage})` }}
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
