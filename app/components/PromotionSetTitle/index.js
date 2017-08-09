import React, { Component } from 'react';

class PromotionSetTitle extends Component {
  render() {
    const comboItem1 = 'images/product-1.png';
    const comboItem2 = 'images/product-2.png';
    const bgImage = 'images/bg-product-17.png';
    return (
      <div className="promotion-title">
        <div className="_center">
          <h1>ซื้อเครื่องดื่ม/ขนม</h1>
        </div>
        <div
          className="bg-img"
          style={{ height: '500px', width: '100%', backgroundImage: `url(${bgImage})` }}
        >
          <div className="product-combo-item">
            <img alt="" src={comboItem1} />
            <span />
            <img alt="" src={comboItem2} />
          </div>
        </div>
      </div>
    );
  }
}

export default PromotionSetTitle;
