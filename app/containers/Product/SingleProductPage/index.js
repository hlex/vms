import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// ======================================================
// Containers
// ======================================================
import { FooterAction } from '../../Utils';

// ======================================================
// Components
// ======================================================
import { ProductSummary, ProductTitle } from '../../../components';
import Layout from '../../Layout';

// ======================================================
// Actions
// ======================================================
import * as ApplicationActions from '../../../actions/applicationActions';

// ======================================================
// Selectors
// ======================================================
import MasterappSelector from '../../../selectors/masterapp';
import OrderSelector from '../../../selectors/order';

const mapStateToProps = (state) => {
  return {
    baseURL: MasterappSelector.getBaseURL(state.masterapp),
    moneyBoxActive: MasterappSelector.verifyIsMoneyBoxActive(state.masterapp),
    productPrice: OrderSelector.getSingleProductPrice(state.order),
    discountAmount: OrderSelector.getDiscountAmount(state.order),
  };
};

const actions = {
  ...ApplicationActions,
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

class SingleProductPage extends Component {

  static propTypes = {
    productPrice: PropTypes.number,
    moneyBoxActive: PropTypes.bool.isRequired,
    discountAmount: PropTypes.number,
    baseURL: PropTypes.string.isRequired,
    submitProduct: PropTypes.func.isRequired,
    verifyDiscountCode: PropTypes.func.isRequired,
    initSingleProductPage: PropTypes.func.isRequired,
    hideLoading: PropTypes.func.isRequired,
    enableMoneyBoxWhenInitPage: PropTypes.func.isRequired,
  }

  static defaultProps = {
    productPrice: 0,
    discountAmount: 0,
  }

  componentDidMount = () => {
    const { initSingleProductPage } = this.props;
    initSingleProductPage();
  }

  componentWillReceiveProps = (nextProps) => {
    const { enableMoneyBoxWhenInitPage, hideLoading, moneyBoxActive } = this.props;
    if (moneyBoxActive && !nextProps.moneyBoxActive) {
      console.log('hideLoading');
      hideLoading();
      enableMoneyBoxWhenInitPage();
    }
  }

  render() {
    const {
      productPrice,
      discountAmount,
      baseURL,
      submitProduct,
      verifyDiscountCode,
    } = this.props;
    return (
      <div>
        <Layout.Title>
          <ProductTitle
            baseURL={baseURL}
          />
        </Layout.Title>
        <Layout.Content>
          <ProductSummary
            title={'ยืนยันชำระเงินค่าสินค้า'}
            productPrice={productPrice}
            discountAmount={discountAmount}
            onSubmit={submitProduct}
            onSubmitDiscount={verifyDiscountCode}
          />
          <FooterAction />
        </Layout.Content>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SingleProductPage);
