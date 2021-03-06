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
import { Loading, ProductSummary, MobileTopupTitle } from '../../../components';
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
    mobileTopupTotalPrice: OrderSelector.getSelectedMobileTopupTotalPrice(state.order),
    discountAmount: OrderSelector.getDiscountAmount(state.order),
    mobileTopupBanner: OrderSelector.getMobileTopupBanner(state.order),
    orderHasInstantyDiscount: OrderSelector.verifyIsOrderHasInstantyDiscount(state.order),
  };
};

const actions = {
  ...ApplicationActions,
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

class MobileTopupPage extends Component {

  static propTypes = {
    moneyBoxActive: PropTypes.bool.isRequired,
    mobileTopupTotalPrice: PropTypes.number,
    discountAmount: PropTypes.number,
    baseURL: PropTypes.string.isRequired,
    submitProduct: PropTypes.func.isRequired,
    verifyDiscountCode: PropTypes.func.isRequired,
    initMobileTopupPage: PropTypes.func.isRequired,
    willReceivePropsEnableMoneyBoxWhenInitPage: PropTypes.func.isRequired,
    mobileTopupBanner: PropTypes.string,
    orderHasInstantyDiscount: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    mobileTopupTotalPrice: 0,
    discountAmount: 0
  }

  componentDidMount = () => {
    const { initMobileTopupPage } = this.props;
    initMobileTopupPage();
  }

  componentWillReceiveProps = (nextProps) => {
    const { willReceivePropsEnableMoneyBoxWhenInitPage } = this.props;
    // willReceivePropsEnableMoneyBoxWhenInitPage(this.props, nextProps);
  }

  render() {
    const {
      moneyBoxActive,
      mobileTopupBanner,
      mobileTopupTotalPrice,
      discountAmount,
      baseURL,
      submitProduct,
      verifyDiscountCode,
      orderHasInstantyDiscount
    } = this.props;
    return (
      <div>
        <Layout.Title>
          <MobileTopupTitle
            baseURL={baseURL}
            bgImage={mobileTopupBanner}
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
          {!orderHasInstantyDiscount && <FooterAction />}
        </Layout.Content>
      </div>
    );
  }
}

export default withAudio({ src: `http://localhost:${process.env.NODE_ENV !== 'production' ? '8888' : '81'}/vms/static/voice/3.mp3` }, actions)(connect(mapStateToProps, mapDispatchToProps)(MobileTopupPage));
