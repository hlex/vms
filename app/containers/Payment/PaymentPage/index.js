import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// ======================================================
// Containers
// ======================================================
import Layout from '../../Layout';
import { FooterAction } from '../../Utils';

// ======================================================
// Components
// ======================================================
import { MobileTopupTitle, ProductTitle, PromotionSetTitle, PaymentConfirmation, Loading, Thankyou } from '../../../components';

// ======================================================
// Actions
// ======================================================
import * as ApplicationActions from '../../../actions/applicationActions';
import * as Actions from './actions';

// ======================================================
// Selectors
// ======================================================
import RootSelector from '../../../selectors/root';
import MasterappSelector from '../../../selectors/masterapp';
import OrderSelector from '../../../selectors/order';

const mapStateToProps = state => {
  return {
    ...state.payment,
    moneyBoxActive: MasterappSelector.verifyIsMoneyBoxActive(state.masterapp),
    canChangeCash: state.masterapp.canChangeCash,
    baseURL: MasterappSelector.getBaseURL(state.masterapp),
    summaryList: RootSelector.getPaymentSummaryList(state),
    paymentBgImage: OrderSelector.getPaymentBgImage(state.order),
    orderType: OrderSelector.getOrderType(state.order)
  };
};

const actions = {
  ...ApplicationActions,
  ...Actions,
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
    orderType: PropTypes.string,
    paymentBgImage: PropTypes.string,
  };

  componentDidMount = () => {
    const { initPaymentPage } = this.props;
    initPaymentPage();
  }

  componentWillUnmount = () => {
    const { returnAllInsertCash } = this.props;
    console.log('outPaymentPage !!!!');
    // if unmount return
    returnAllInsertCash();
  }

  renderContent = () => {
    const { moneyBoxActive, baseURL, isLoading, isFinish, summaryList, canChangeCash } = this.props;
    // const isFinish = true;
    if (moneyBoxActive) {
      if (isFinish) return <Thankyou baseURL={baseURL} />;
      if (isLoading) return <Loading baseURL={baseURL} />;
      return (
        <PaymentConfirmation
          baseURL={baseURL}
          summaryList={summaryList}
          canChangeCash={canChangeCash}
        />
      );
    }
    if (isFinish) {
      return <Thankyou baseURL={baseURL} />;
    }
    return <Loading text={'ระบบกำลังเปิดรับเงิน รอสักครู่'} baseURL={baseURL} />
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
  }

  render() {
    const { moneyBoxActive, baseURL, isLoading, isFinish } = this.props;
    const canBack = !isLoading && !isFinish;
    return (
      <div>
        <Layout.Title>
          {
            this.renderTitle()
          }
        </Layout.Title>
        <Layout.Content>
          {
            !moneyBoxActive && <Loading text={'ระบบกำลังเปิดรับเงิน รอสักครู่'} baseURL={baseURL} />
          }
          {
            moneyBoxActive && this.renderContent()
          }
          {
            moneyBoxActive && canBack &&
            <FooterAction />
          }
        </Layout.Content>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentPage);
