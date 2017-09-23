import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SummaryList from '../SummaryList';

class ProductSummary extends Component {

  static propTypes = {
    h2: PropTypes.string,
    p: PropTypes.string,
    small: PropTypes.string,
    productPrice: PropTypes.number,
    discountAmount: PropTypes.number,
    hasInput: PropTypes.bool,
    hasBackButton: PropTypes.bool,
    back: PropTypes.func,
    onSubmit: PropTypes.func,
  }

  static defaultProps = {
    h2: 'ยืนยันชำระเงินค่าสินค้า',
    p: 'ใส่รหัสส่วนลด',
    small: '(กรณีมีรหัสส่วนลดและต้องการใช้)',
    productPrice: '45',
    discountAmount: '10',
    hasInput: true,
    hasBackButton: true,
    back: () => console.log('back'),
    onSubmit: () => console.log('onSubmit'),
  }

  handleBack = () => {
    const { back } = this.props;
    back();
  }

  handleAddDiscount = () => {

  }

  handleSubmit = () => {
    const { onSubmit } = this.props;
    onSubmit();
  }

  render() {
    const { h2, p, small, productPrice, discountAmount, hasInput, hasBackButton } = this.props;
    const summaryItems = [
      {
        text: 'ราคาสินค้า',
        color: 'blue',
        amount: productPrice,
      },
      {
        text: 'ส่วนลด',
        color: 'purple',
        amount: discountAmount,
      },
    ];
    return (
      <div className="product-summary">
        <h2>{h2}</h2>
        <hr />
        <div className="panel">
          {
            hasInput &&
            <div className="input-box">
              <p>{`${p} `}<small>{small}</small></p>
              <div
                className="input-with-keyboard"
              >
                A12345
              </div>
              <p className="_unpadding"><small>สัมผัสช่องว่างแป้นพิมพ์จะปรากฏ</small></p>
            </div>
          }
          <SummaryList
            items={summaryItems}
          />
          <div className="action _center">
            <a
              className="button blue submit-button"
              onClick={this.handleSubmit}
            >
              <p className="fade-flash">กดยืนยันชำระเงิน <span className="pt">{`${Number(productPrice) - Number(discountAmount)}`}</span> บาท</p>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default ProductSummary;