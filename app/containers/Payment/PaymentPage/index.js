import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
// ======================================================
// Hoc
// ======================================================
import withAudio from '../../../hoc/withAudio';
// ======================================================
// Containers
// ======================================================
import Layout from '../../Layout';
import { FooterAction } from '../../Utils';

// Components
// ======================================================
import {
  MobileTopupTitle,
  ProductTitle,
  PromotionSetTitle,
  PaymentConfirmation,
  Loading
} from '../../../components';
// ======================================================
// Actions
// ======================================================
import * as ApplicationActions from '../../../actions/applicationActions';
// ======================================================
// Selectors
// ======================================================
import RootSelector from '../../../selectors/root';
import MasterappSelector from '../../../selectors/masterapp';
import OrderSelector from '../../../selectors/order';
import PaymentSelector from '../../../selectors/payment';

const mapStateToProps = state => ({
  ...state.payment,
  isEnablingMoneyBox: MasterappSelector.verifyIsEnablingMoneyBox(state.masterapp),
  moneyBoxActive: MasterappSelector.verifyIsMoneyBoxActive(state.masterapp),
  canChangeCash: state.masterapp.canChangeCash,
  baseURL: MasterappSelector.getLocalURL(state.masterapp),
  localStaticURL: MasterappSelector.getLocalStaticURL(state.masterapp),
  summaryList: RootSelector.getPaymentSummaryList(state),
  paymentBgImage: OrderSelector.getPaymentBgImage(state.order),
  orderType: OrderSelector.getOrderType(state.order),
  isOrderHasFreeProduct: OrderSelector.verifyOrderHasFreeProduct(state.order),
  promotionSet: OrderSelector.getPromotionSet(state.order),
  // currentAmountMoreThanZero: PaymentSelector.verifyCurrentAmountMoreThanZero(state.payment),
});

const actions = {
  ...ApplicationActions
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

class PaymentPage extends PureComponent {
  static propTypes = {
    baseURL: PropTypes.string.isRequired,
    summaryList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    isFinish: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    returnAllInsertCash: PropTypes.func.isRequired,
    initPaymentPage: PropTypes.func.isRequired,
    canChangeCash: PropTypes.bool.isRequired,
    moneyBoxActive: PropTypes.bool.isRequired,
    orderType: PropTypes.string.isRequired,
    paymentBgImage: PropTypes.string.isRequired,
    isEnablingMoneyBox: PropTypes.bool.isRequired,
    // currentAmountMoreThanZero: PropTypes.bool.isRequired,
  };

  componentDidMount = () => {
    const { initPaymentPage } = this.props;
    initPaymentPage();
  };

  componentWillUnmount = () => {
    const { returnAllInsertCash } = this.props;
    const currentPage = this.props.history.location.pathname;
    const isThankyouPage = /thankyou/.test(currentPage);
    // console.log('outPaymentPage !!!!', this.props, isThankyouPage);
    if (!isThankyouPage) {
      returnAllInsertCash();
    }
  };

  renderContent = () => {
    const { orderType, isEnablingMoneyBox, moneyBoxActive, localStaticURL, isLoading, isFinish, summaryList, canChangeCash } = this.props;
    if (isEnablingMoneyBox) {
      return (
        <Loading>
          <h1>กรุณา อย่า หยอดเหรียญ/ธนบัตร</h1>
          <h1 style={{ color: 'red' }}>ระบบรับเงิน ยังไม่พร้อม</h1>
        </Loading>
      );
    }
    if (moneyBoxActive) {
      if (isLoading) return <Loading><h1>รอสักครู่ ระบบกำลังดำเนินการ</h1></Loading>
      return (
        <PaymentConfirmation
          baseURL={localStaticURL}
          summaryList={summaryList}
          canChangeCash={canChangeCash}
        />
      );
    }
    if (orderType === 'mobileTopup') {
      return (
        <Loading>
          <h1>รอสักครู่ ระบบกำลังเติมเงิน</h1>
        </Loading>
      );
    }
    return (
      <Loading>
        <h1>รอสักครู่ สินค้ากำลังหล่น</h1>
      </Loading>
    );
  };

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
    const { moneyBoxActive, baseURL, isLoading, isFinish } = this.props;
    const canBack = !isLoading && !isFinish;
    return (
      <div>
        <Layout.Title>{this.renderTitle()}</Layout.Title>
        <Layout.Content>
          {this.renderContent()}
          {moneyBoxActive && canBack && <FooterAction />}
        </Layout.Content>
      </div>
    );
  }
}

export default withAudio({ src: `http://localhost:${process.env.NODE_ENV !== 'production' ? '8888' : '81'}/vms/static/voice/4.mp3` }, actions)(
  connect(mapStateToProps, mapDispatchToProps)(PaymentPage)
);
