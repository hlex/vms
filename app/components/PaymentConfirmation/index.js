import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Summarylist from '../SummaryList';

class PaymentConfirmation extends Component {

  static propTypes = {
    baseURL: PropTypes.string.isRequired,
    summaryList: PropTypes.arrayOf(PropTypes.shape({})),
    back: PropTypes.func,
  }

  static defaultProps = {
    summaryList: [
      {
        text: 'ยอดชำระสุทธิ',
        color: 'blue',
        amount: '30',
      },
      {
        text: 'ใส่เงินแล้ว',
        color: 'green',
        amount: '20',
      },
    ],
    back: () => console.log('back'),
  }

  handleBack = () => {
    const { back } = this.props;
    back();
  }

  render() {
    const { baseURL, summaryList } = this.props;
    return (
      <div className="payment-confirmation">
        <div className="row">
          <div className="D-8">
            <h2>ยืนยันชำระเงินค่าสินค้า</h2>
            <hr />
            <Summarylist items={summaryList} />
            <hr />
            <div className="_center">
              <h3>กรุณาหยอดเหรียญหรือธนบัตร</h3>
            </div>
            <div className="payment-method">
              <div className="cash">
                <div className="coin">
                  <div className="list">
                    <div className="item">
                      <img src={`${baseURL}/images/coin-1.png`} alt="" />
                    </div>
                    <div className="item">
                      <img src={`${baseURL}/images/coin-5.png`} alt="" />
                    </div>
                    <div className="item">
                      <img src={`${baseURL}/images/coin-10.png`} alt="" />
                    </div>
                  </div>
                  <span className="hint-message">1, 5, 10 เท่านั้น</span>
                </div>
                <div className="banknote">
                  <div className="list">
                    <div className="item">
                      <img src={`${baseURL}/images/banknote-20.png`} alt="" />
                    </div>
                    <div className="item">
                      <img src={`${baseURL}/images/banknote-50.png`} alt="" />
                    </div>
                    <div className="item">
                      <img src={`${baseURL}/images/banknote-100.png`} alt="" />
                    </div>
                  </div>
                  <span className="hint-message">20, 50, 100 เท่านั้น</span>
                </div>
              </div>
            </div>
          </div>
          <div className="D-4">
            <div className="insert-cash-box">
              <div className="insert-cash-sign">
                <img src={`${baseURL}/images/icon-point-left.png`} alt="" />
              </div>
              <h4>หยอดเงิน</h4>
              <div className="error">
                <p>เงินทอนไม่พอ</p>
                <p>กรุณาใส่เงินให้พอดั</p>
              </div>
            </div>
          </div>
        </div>
        <a
          style={{ position: 'absolute', bottom: '25px', left: '80px' }}
          className="button purple M"
          onClick={this.handleBack}
        >
          <i className="fa fa-chevron-left" />ย้อนกลับ
        </a>
      </div>
    );
  }
}

export default PaymentConfirmation;
