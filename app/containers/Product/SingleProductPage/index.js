import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// ======================================================
// Hoc
// ======================================================
import withAudio from '../../../hoc/withAudio';
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
    baseURL: MasterappSelector.getLocalURL(state.masterapp),
    productPrice: OrderSelector.getSingleProductPrice(state.order),
    discountAmount: OrderSelector.getDiscountAmount(state.order),
    productBgImage: OrderSelector.getSingleProductBgImage(state.order),
    orderHasInstantyDiscount: OrderSelector.verifyIsOrderHasInstantyDiscount(state.order),
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
    orderHasInstantyDiscount: PropTypes.bool.isRequired,
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
    // willReceivePropsEnableMoneyBoxWhenInitPage(this.props, nextProps);
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
      orderHasInstantyDiscount
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
          <ProductSummary
            title={'ยืนยันชำระเงินค่าสินค้า'}
            productPrice={productPrice}
            discountAmount={discountAmount}
            onSubmit={submitProduct}
            onSubmitDiscount={verifyDiscountCode}
          />
          {!orderHasInstantyDiscount && <FooterAction />}
        </Layout.Content>
      </div>
    );
  }
}

export default withAudio({ src: `http://localhost:${process.env.NODE_ENV !== 'production' ? '8888' : '81'}/vms/static/voice/3.mp3` }, actions)(connect(mapStateToProps, mapDispatchToProps)(SingleProductPage));
