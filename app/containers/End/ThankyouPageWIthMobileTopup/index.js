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
import { Thankyou, MobileTopupTitle, ProductTitle, PromotionSetTitle } from '../../../components';
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

import iconThankyou from '../../../images/icon-thank.png';

const mapStateToProps = state => ({
  ...state.payment,
  moneyBoxActive: MasterappSelector.verifyIsMoneyBoxActive(state.masterapp),
  canChangeCash: state.masterapp.canChangeCash,
  baseURL: MasterappSelector.getBaseURL(state.masterapp),
  summaryList: RootSelector.getPaymentSummaryList(state),
  paymentBgImage: OrderSelector.getPaymentBgImage(state.order),
  orderType: OrderSelector.getOrderType(state.order),
  isOrderHasFreeProduct: OrderSelector.verifyOrderHasFreeProduct(state.order),
  lang: MasterappSelector.getLanguage(state.masterapp),
  promotionSet: OrderSelector.getPromotionSet(state.order)
});
const actions = {
  ...ApplicationActions
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

class ThankyouPage extends Component {
  static propTypes = {
    baseURL: PropTypes.string.isRequired,
    lang: PropTypes.string.isRequired
  };
  renderTitle = () => {
    const { baseURL, paymentBgImage } = this.props;
    return <MobileTopupTitle baseURL={baseURL} bgImage={paymentBgImage} />;
  };
  render() {
    const { baseURL, lang } = this.props;
    return (
      <div>
        <Layout.Title>{this.renderTitle()}</Layout.Title>
        <Layout.Content>
          <div className="thankyou">
            <div className="title">
              <span>
                ขอบคุณค่ะ
                <span className="icon"><img src={iconThankyou} alt="" /></span>
                <p style={{ fontSize: '52px' }} >เติมเงินสำเร็จพร้อมรับ SMS มาใหม่นะคะ</p>
              </span>
            </div>
          </div>
        </Layout.Content>
      </div>
    );
  }
}

export default withAudio(
  {
    src: `http://localhost:${
      process.env.NODE_ENV !== 'production' ? '8888' : '81'
    }/vms/static/voice/9.mp3`
  },
  actions
)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ThankyouPage)
);
