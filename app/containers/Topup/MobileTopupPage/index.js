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
import { ProductSummary, MobileTopupTitle } from '../../../components';
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
    mobileTopupTotalPrice: OrderSelector.getSelectedMobileTopupTotalPrice(state.order),
    discountAmount: OrderSelector.getDiscountAmount(state.order)
  };
};

const actions = {
  ...ApplicationActions,
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

class MobileTopupPage extends Component {

  static propTypes = {
    mobileTopupTotalPrice: PropTypes.number,
    discountAmount: PropTypes.number,
    baseURL: PropTypes.string.isRequired,
    submitProduct: PropTypes.func.isRequired,
    verifyDiscountCode: PropTypes.func.isRequired,
    initSingleProductPage: PropTypes.func.isRequired,
  }

  static defaultProps = {
    mobileTopupTotalPrice: 0,
    discountAmount: 0
  }

  componentDidMount = () => {
    const { initSingleProductPage } = this.props;
    initSingleProductPage();
  }

  render() {
    const {
      mobileTopupTotalPrice,
      discountAmount,
      baseURL,
      submitProduct,
      verifyDiscountCode,
    } = this.props;
    return (
      <div>
        <Layout.Title>
          <MobileTopupTitle
            baseURL={baseURL}
          />
        </Layout.Title>
        <Layout.Content>
          <ProductSummary
            title={'ยืนยันชำระเงินค่าเติมเงิน'}
            productPrice={mobileTopupTotalPrice}
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

export default connect(mapStateToProps, mapDispatchToProps)(MobileTopupPage);
