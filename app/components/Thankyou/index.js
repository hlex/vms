import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Thankyou extends Component {

  static propTypes = {
    baseURL: PropTypes.string.isRequired,
  }

  render() {
    const { baseURL } = this.props;
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
        <div className="cash-return-box">
          <p>เชิญรับเงินทอนและสินค้าช่องด้านล่าง</p>
          <div className="cash-return-sign">
            <img src={`${baseURL}/images/icon-point-down.png`} alt="" />
          </div>
        </div>
      </div>
    );
  }
}

export default Thankyou;
