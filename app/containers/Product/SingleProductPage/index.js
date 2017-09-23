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
import * as Actions from './actions';

// ======================================================
// Selectors
// ======================================================
import MasterappSelector from '../../../selectors/masterapp';
import OrderSelector from '../../../selectors/order';

const mapStateToProps = (state) => {
  return {
    baseURL: MasterappSelector.getBaseURL(state.masterapp),
    productPrice: OrderSelector.getSingleProductPrice(state.order),
  };
};

const actions = {
  ...ApplicationActions,
  ...Actions,
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

class SingleProductPage extends Component {

  static propTypes = {
    productPrice: PropTypes.number,
    baseURL: PropTypes.string.isRequired,
    back: PropTypes.func.isRequired,
    submitProduct: PropTypes.func.isRequired,
    verifyDiscountCode: PropTypes.func.isRequired,
  }

  static defaultProps = {
    productPrice: 0,
  }

  render() {
    const {
      productPrice,
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
            discountAmount={0}
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
