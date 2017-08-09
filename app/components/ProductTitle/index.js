import React, { Component } from 'react';

class ProductTitle extends Component {
  render() {
    const bgImage = 'images/product-full.png';
    return (
      <div className="promotion-title">
        <div className="_center">
          <h1>ซื้อเครื่องดื่ม/ขนม</h1>
        </div>
        <div
          className="bg-img"
          style={{ height: '500px', width: '100%', backgroundImage: `url(${bgImage})` }}
        />
      </div>
    );
  }
}

export default ProductTitle;
