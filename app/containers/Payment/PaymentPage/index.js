import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// ======================================================
// Containers
// ======================================================
import Layout from '../../Layout';

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
    back: PropTypes.func.isRequired,
    returnCash: PropTypes.func.isRequired,
    enableMoneyBox: PropTypes.func.isRequired,
  };

  componentDidMount = () => {
    const { enableMoneyBox } = this.props;
    console.log('inPaymentPage !!!!');
    // if mount enable money box
    enableMoneyBox();
  }

  componentWillUnmount = () => {
    const { returnCash } = this.props;
    console.log('outPaymentPage !!!!');
    // if unmount return
    returnCash();
  }

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
    const { baseURL } = this.props;
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
        </Layout.Content>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentPage);
