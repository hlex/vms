import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// ======================================================
// Hoc
// ======================================================
import withAudio from '../../../hoc/withAudio';
// ======================================================
// Components
// ======================================================
import Layout from '../../Layout';
import {
  Thankyou,
  MobileTopupTitle,
  ProductTitle,
  PromotionSetTitle,
} from '../../../components';
// ======================================================
// Selectors
// ======================================================
import RootSelector from '../../../selectors/root';
import MasterappSelector from '../../../selectors/masterapp';
import OrderSelector from '../../../selectors/order';
// ======================================================
// Actions
// ======================================================
import * as ApplicationActions from '../../../actions/applicationActions';

const mapStateToProps = state => ({
  ...state.payment,
  moneyBoxActive: MasterappSelector.verifyIsMoneyBoxActive(state.masterapp),
  canChangeCash: state.masterapp.canChangeCash,
  baseURL: MasterappSelector.getBaseURL(state.masterapp),
  summaryList: RootSelector.getPaymentSummaryList(state),
  paymentBgImage: OrderSelector.getPaymentBgImage(state.order),
  orderType: OrderSelector.getOrderType(state.order),
  isOrderHasFreeProduct: OrderSelector.verifyOrderHasFreeProduct(state.order)
});
const actions = {
  ...ApplicationActions
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(actions, dispatch);
};


class ThankyouPage extends Component {
  static propTypes = {
    baseURL: PropTypes.string.isRequired,
  }
  renderTitle = () => {
    const { baseURL, orderType, paymentBgImage } = this.props;
    if (orderType === 'promotionSet') {
      return <PromotionSetTitle baseURL={baseURL} bgImage={paymentBgImage} />;
    }
    if (orderType === 'mobileTopup') {
      return <MobileTopupTitle baseURL={baseURL} bgImage={paymentBgImage} />;
    }
    return <ProductTitle baseURL={baseURL} bgImage={paymentBgImage} />;
  };

  render() {
    const { baseURL } = this.props;
    return (
      <div>
        <Layout.Title>{this.renderTitle()}</Layout.Title>
        <Layout.Content>
          <Thankyou product={{}} baseURL={baseURL} />
        </Layout.Content>
      </div>
    );
  }
}

export default withAudio({ src: `http://localhost:${process.env.NODE_ENV !== 'production' ? '8888' : '81'}/vms/static/voice/6.m4a` }, actions)(connect(mapStateToProps, mapDispatchToProps)(ThankyouPage));
