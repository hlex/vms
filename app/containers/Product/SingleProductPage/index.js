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
import { Loading, ProductSummary, ProductTitle } from '../../../components';
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
    moneyBoxActive: MasterappSelector.verifyIsMoneyBoxActive(state.masterapp),
    baseURL: MasterappSelector.getBaseURL(state.masterapp),
    productPrice: OrderSelector.getSingleProductPrice(state.order),
    discountAmount: OrderSelector.getDiscountAmount(state.order),
    productBgImage: OrderSelector.getSingleProductBgImage(state.order),
  };
};

const actions = {
  ...ApplicationActions,
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

class SingleProductPage extends Component {

  static propTypes = {
    productPrice: PropTypes.number,
    discountAmount: PropTypes.number,
    baseURL: PropTypes.string.isRequired,
    submitProduct: PropTypes.func.isRequired,
    verifyDiscountCode: PropTypes.func.isRequired,
    initSingleProductPage: PropTypes.func.isRequired,
    willReceivePropsEnableMoneyBoxWhenInitPage: PropTypes.func.isRequired,
    productBgImage: PropTypes.string,
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
    const { willReceivePropsEnableMoneyBoxWhenInitPage } = this.props;
    willReceivePropsEnableMoneyBoxWhenInitPage(this.props, nextProps);
  }

  render() {
    const {
      moneyBoxActive,
      productPrice,
      discountAmount,
      baseURL,
      submitProduct,
      verifyDiscountCode,
      productBgImage,
    } = this.props;
    return (
      <div>
        <Layout.Title>
          <ProductTitle
            bgImage={productBgImage}
            baseURL={baseURL}
          />
        </Layout.Title>
        <Layout.Content>
          {
            !moneyBoxActive && <Loading text={'ระบบกำลังเปิดรับเงิน รอสักครู่'} baseURL={baseURL} />
          }
          {
            moneyBoxActive &&
            <div>
              <ProductSummary
                title={'ยืนยันชำระเงินค่าสินค้า'}
                productPrice={productPrice}
                discountAmount={discountAmount}
                onSubmit={submitProduct}
                onSubmitDiscount={verifyDiscountCode}
              />
              <FooterAction />
            </div>
          }
        </Layout.Content>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SingleProductPage);
