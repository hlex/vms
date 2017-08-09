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

const mapStateToProps = state => {
  return {
    ...state.payment
  }
}

const actions = {
  ...ApplicationActions,
  ...Actions,
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

class PaymentPage extends Component {
  static propTypes = {
    back: PropTypes.func,
  };

  static defaultProps = {
    back: () => console.log('back'),
    submitProduct: () => console.log('submitProduct'),
  };

  componentDidMount = () => {
    const { receivedCashCompletely } = this.props;
    setTimeout(() => {
      receivedCashCompletely();
    }, 5000);
  }

  renderContent = () => {
    const { back, isLoading } = this.props;
    // const isFinish = true;
    // if (isFinish) return <Thankyou />;
    if (isLoading) return <Loading />;
    return <PaymentConfirmation back={back} />;
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
