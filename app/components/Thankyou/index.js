import React, { Component } from 'react';
import PropTypes from 'prop-types';

import iconThankyou from '../../images/icon-thank.png'
import iconPointDown from '../../images/icon-point-down.png'

class Thankyou extends Component {
  static propTypes = {
    lang: PropTypes.string.isRequired,
    baseURL: PropTypes.string.isRequired,
  }

  static defaultProps = {
    product: undefined
  }

  renderProductName = (name) => {
    const { lang } = this.props;
    return name[lang];
  }

  render() {
    const { baseURL, product } = this.props;
    console.log(this, product, product !== undefined);
    return (
      <div className="thankyou">
        <div className="title">
          <span>
            ขอบคุณค่ะ
            <span className="icon"><img src={iconThankyou} alt="" /></span>
          </span>
        </div>
        <div className="box-with-bg yellow _hidden">
          <p>คุณมีคะแนนสะสมจำนวน 20 คะแนน</p>
        </div>
        {
          product !== undefined &&
          <div className="free-wrapper">
            <span>คุณคือผู้โชคดี ได้รับ</span>
            <img src={`${baseURL}${product.image}`} />
            <span className="highlight-red">{this.renderProductName(product.name)}</span>
            <span>มูลค่า</span>
            <span className="highlight-red">{product.price}</span>
            <span>บาท ฟรี !</span>
          </div>
        }
        <div className="cash-return-box">
          <p>เชิญรับเงินทอนและสินค้าที่ช่องด้านล่าง</p>
          <div className="cash-return-sign">
            <img src={iconPointDown} alt="" />
          </div>
        </div>
      </div>
    );
  }
}

export default Thankyou;
