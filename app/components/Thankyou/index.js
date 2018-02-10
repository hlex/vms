import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Thankyou extends Component {
  static propTypes = {
    product: PropTypes.shape({}),
    baseURL: PropTypes.string.isRequired,
  }

  static defaultProps = {
    product: {}
  }

  render() {
    const { baseURL, product } = this.props;
    return (
      <div className="thankyou">
        <div className="title">
          <span>
            ขอบคุณค่ะ
            <span className="icon"><img src={`${baseURL}/images/icon-thank.png`} alt="" /></span>
          </span>
        </div>
        <div className="box-with-bg yellow _hidden">
          <p>คุณมีคะแนนสะสมจำนวน 20 คะแนน</p>
        </div>
        {
          product !== {} &&
          <div className="free-wrapper">
            <span>คุณคือผู้โชคดี ได้รับ</span>
            <img src={'http://localhost:8888/vms/html-v2/images/product-1.png'} />
            <span className="highlight-red">Pepsi</span>
            <span>มูลค่า</span>
            <span className="highlight-red">10</span>
            <span>บาท ฟรี !</span>
          </div>
        }
        <div className="cash-return-box">
          <p>เชิญรับเงินทอนและสินค้าที่ช่องด้านล่าง</p>
          <div className="cash-return-sign">
            <img src={`${baseURL}/images/icon-point-down.png`} alt="" />
          </div>
        </div>
      </div>
    );
  }
}

export default Thankyou;
