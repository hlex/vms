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
import { PromotionSetTitle, PaymentConfirmation, Loading, Thankyou } from '../../../components';

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

const mapStateToProps = state => {
  return {
    ...state.payment,
    canChangeCash: state.masterapp.canChangeCash,
    baseURL: MasterappSelector.getBaseURL(state.masterapp),
    summaryList: RootSelector.getPaymentSummaryList(state),
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
    canChangeCash: PropTypes.bool.isRequired
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
    const { baseURL, isLoading, isFinish, summaryList, canChangeCash } = this.props;
    // const isFinish = true;
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

  render() {
    const { baseURL, isLoading, isFinish } = this.props;
    const canBack = !isLoading && !isFinish;
    return (
      <div>
        <Layout.Title>
          <PromotionSetTitle
            baseURL={baseURL}
          />
        </Layout.Title>
        <Layout.Content>
          {
            this.renderContent()
          }
          {
            canBack &&
            <FooterAction />
          }
        </Layout.Content>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentPage);
