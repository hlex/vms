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
  baseURL: MasterappSelector.getLocalURL(state.masterapp),
  summaryList: RootSelector.getPaymentSummaryList(state),
  paymentBgImage: OrderSelector.getPaymentBgImage(state.order),
  orderType: OrderSelector.getOrderType(state.order),
  freeProduct: OrderSelector.getFreeProduct(state.order),
  lang: MasterappSelector.getLanguage(state.masterapp),
  promotionSet: OrderSelector.getPromotionSet(state.order),
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
    lang: PropTypes.string.isRequired,
  }
  renderTitle = () => {
    const { promotionSet, baseURL, orderType, paymentBgImage } = this.props;
    if (orderType === 'promotionSet') {
      return (
        <PromotionSetTitle
          baseURL={baseURL}
          bgImage={_.get(promotionSet, 'image')}
          comboItem1={_.get(promotionSet, 'products.0.image')}
          comboItem2={_.get(promotionSet, 'products.1.image')}
        />
      );
    }
    if (orderType === 'mobileTopup') {
      return <MobileTopupTitle baseURL={baseURL} bgImage={paymentBgImage} />;
    }
    return <ProductTitle baseURL={baseURL} bgImage={paymentBgImage} />;
  };

  render() {
    const { baseURL, lang, freeProduct } = this.props;
    return (
      <div>
        <Layout.Title>{this.renderTitle()}</Layout.Title>
        <Layout.Content>
          <Thankyou lang={lang} product={freeProduct} baseURL={baseURL} />
        </Layout.Content>
      </div>
    );
  }
}

export default withAudio({ src: `http://localhost:${process.env.NODE_ENV !== 'production' ? '8888' : '81'}/vms/static/voice/11.m4a` }, actions)(connect(mapStateToProps, mapDispatchToProps)(ThankyouPage));
