import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// ======================================================
// Components
// ======================================================
import { Layout, PromotionSetTitle, PaymentConfirmation, Loading, Thankyou } from '../../../components';

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
    baseURL: MasterappSelector.getBaseURL(state.masterapp),
    summaryList: RootSelector.getPaymentSummaryList(state),
  };
};

const actions = {
  ...ApplicationActions,
  ...Actions,
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

class PaymentPage extends Component {
  static propTypes = {
    baseURL: PropTypes.string.isRequired,
    summaryList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    isFinish: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    back: PropTypes.func,
  };

  static defaultProps = {
    back: () => console.log('back'),
  };

  renderContent = () => {
    const { baseURL, back, isLoading, isFinish, summaryList } = this.props;
    // const isFinish = true;
    if (isFinish) return <Thankyou baseURL={baseURL} />;
    if (isLoading) return <Loading baseURL={baseURL} />;
    return (
      <PaymentConfirmation
        baseURL={baseURL}
        summaryList={summaryList}
        back={back}
      />
    );
  }

  render() {
    return (
      <div>
        <Layout.Title>
          <PromotionSetTitle />
        </Layout.Title>
        <Layout.Content>
          {
            this.renderContent()
          }
        </Layout.Content>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentPage);
