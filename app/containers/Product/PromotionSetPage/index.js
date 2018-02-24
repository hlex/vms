import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import _ from 'lodash';
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
import { Loading, ProductSummary, PromotionSetTitle } from '../../../components';
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
    productPrice: OrderSelector.getPromotionSetPrice(state.order),
    discountAmount: OrderSelector.getDiscountAmount(state.order),
    promotionSet: OrderSelector.getPromotionSet(state.order),
  };
};

const actions = {
  ...ApplicationActions,
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

class PromotionSetPage extends Component {

  static propTypes = {
    moneyBoxActive: PropTypes.bool.isRequired,
    productPrice: PropTypes.number,
    discountAmount: PropTypes.number,
    baseURL: PropTypes.string.isRequired,
    submitPromotionSet: PropTypes.func.isRequired,
    verifyDiscountCode: PropTypes.func.isRequired,
    initPromotionSetPage: PropTypes.func.isRequired,
    willReceivePropsEnableMoneyBoxWhenInitPage: PropTypes.func.isRequired,
  }

  static defaultProps = {
    productPrice: 0,
    discountAmount: 0,
  }

  componentDidMount = () => {
    const { initPromotionSetPage } = this.props;
    initPromotionSetPage();
  }

  componentWillReceiveProps = (nextProps) => {
    const { willReceivePropsEnableMoneyBoxWhenInitPage } = this.props;
    // willReceivePropsEnableMoneyBoxWhenInitPage(this.props, nextProps);
  }

  render() {
    // console.log('PromotionSetPage', this.props, this.props.promotionSet);
    const { promotionSet, moneyBoxActive, baseURL, discountAmount, productPrice, submitPromotionSet, verifyDiscountCode } = this.props;
    return (
      <div>
        <Layout.Title>
          <PromotionSetTitle
            baseURL={baseURL}
            comboItem1={_.get(promotionSet, 'products.0.image')}
            comboItem2={_.get(promotionSet, 'products.1.image')}
          />
        </Layout.Title>
        <Layout.Content>
          <ProductSummary
            productPrice={productPrice}
            discountAmount={discountAmount}
            onSubmit={submitPromotionSet}
            onSubmitDiscount={verifyDiscountCode}
          />
          <FooterAction />
        </Layout.Content>
      </div>
    );
  }
}

export default withRouter(withAudio({ src: `http://localhost:${process.env.NODE_ENV !== 'production' ? '8888' : '81'}/vms/static/voice/3.m4a` }, actions)(connect(mapStateToProps, mapDispatchToProps)(PromotionSetPage)));