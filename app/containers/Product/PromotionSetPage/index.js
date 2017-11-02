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
import { ProductSummary, PromotionSetTitle } from '../../../components';
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
    productPrice: OrderSelector.getPromotionSetPrice(state.order),
    discountAmount: OrderSelector.getDiscountAmount(state.order),
  };
};

const actions = {
  ...ApplicationActions,
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

class PromotionSetPage extends Component {

  static propTypes = {
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
    willReceivePropsEnableMoneyBoxWhenInitPage(this.props, nextProps);
  }

  render() {
    console.log('PromotionSetPage', this.props);
    const { baseURL, discountAmount, productPrice, submitPromotionSet, verifyDiscountCode } = this.props;
    return (
      <div>
        <Layout.Title>
          <PromotionSetTitle
            baseURL={baseURL}
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

export default connect(mapStateToProps, mapDispatchToProps)(PromotionSetPage);
