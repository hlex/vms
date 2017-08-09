import React, { Component } from 'react';

class Thankyou extends Component {
  render() {
    return (
      <div className="thankyou">
        <div className="title">
          <span>
            ขอบคุณค่ะ
            <span className="icon"><img src="images/icon-thank.png" alt="" /></span>
          </span>
        </div>
        <div className="box-with-bg yellow">
          <p>คุณมีคะแนนสะสมจำนวน 20 คะแนน</p>
        </div>
        <div className="cash-return-box">
          <p>เชิญรับเงินทอนและสินค้าช่องด้านล่าง</p>
          <div className="cash-return-sign">
            <img src="images/icon-point-down.png" alt="" />
          </div>
        </div>
      </div>
    );
  }
}

export default Thankyou;
