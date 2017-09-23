import React, { Component } from 'react';
import PropTypes from 'prop-types';

// ======================================================
// Components
// ======================================================
import DiscountInput from '../DiscountInput';
import SummaryList from '../SummaryList';

class ProductSummary extends Component {
  static propTypes = {
    title: PropTypes.string,
    productPrice: PropTypes.number,
    discountAmount: PropTypes.number,
    hasDiscountInput: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    onSubmitDiscount: PropTypes.func.isRequired,
  };

  static defaultProps = {
    title: 'ยืนยันชำระเงินค่าสินค้า',
    productPrice: 0,
    discountAmount: 0,
    hasDiscountInput: true,
  };

  handleAddDiscount = () => {};

  handleSubmit = () => {
    const { onSubmit } = this.props;
    onSubmit();
  };

  getSummaryList = () => {
    const { productPrice, discountAmount } = this.props;
    return [
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
  };

  render() {
    const { title, productPrice, discountAmount, hasDiscountInput, onSubmitDiscount } = this.props;
    return (
      <div className="product-summary">
        <h2>{title}</h2>
        <hr />
        <div className="panel">
          {hasDiscountInput && <DiscountInput onSubmitDiscount={onSubmitDiscount} />}
          <SummaryList items={this.getSummaryList()} />
          <div className="action _center">
            <a className="button blue submit-button" onClick={this.handleSubmit}>
              <p className="fade-flash">
                กดยืนยันชำระเงิน{' '}
                <span className="pt">{`${Number(productPrice) - Number(discountAmount)}`}</span> บาท
              </p>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default ProductSummary;
