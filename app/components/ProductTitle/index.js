import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ProductTitle extends Component {

  static propTypes = {
    baseURL: PropTypes.string.isRequired,
    title: PropTypes.string,
    bgImage: PropTypes.string,
  }

  static defaultProps = {
    title: 'ซื้อเครื่องดื่ม/ขนม',
    bgImage: 'images/product-full.png',
  }

  render() {
    const { title, baseURL, bgImage } = this.props;
    return (
      <div className="promotion-title">
        <div className="_center">
          <h1>{title}</h1>
        </div>
        <div
          className="bg-img"
          style={{ height: '500px', width: '100%', backgroundImage: `url('${baseURL}/${bgImage}')` }}
        />
      </div>
    );
  }
}

export default ProductTitle;
