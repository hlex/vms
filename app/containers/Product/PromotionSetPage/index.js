import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// ======================================================
// Components
// ======================================================
import { Layout, ProductSummary, PromotionSetTitle } from '../../../components';

// ======================================================
// Actions
// ======================================================
import * as ApplicationActions from '../../../actions/applicationActions';
import * as Actions from './actions';

// ======================================================
// Selectors
// ======================================================
import MasterappSelector from '../../../selectors/masterapp';
import OrderSelector from '../../../selectors/order';

const mapStateToProps = (state) => {
  return {
    baseURL: MasterappSelector.getBaseURL(state.masterapp),
    modal: PropTypes.shape({}).isRequired,
  };
};

const actions = {
  ...ApplicationActions,
  ...Actions,
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

class PromotionSetPage extends Component {

  static propTypes = {
    baseURL: PropTypes.string.isRequired,
    back: PropTypes.func,
    submitProduct: PropTypes.func,
  }

  static defaultProps = {
    back: () => console.log('back'),
    submitProduct: () => console.log('submitProduct'),
  }

  render() {
    const { baseURL, back, submitProduct, modal } = this.props;
    return (
      <div>
        <Layout.Title>
          <PromotionSetTitle
            baseURL={baseURL}
          />
        </Layout.Title>
        <Layout.Content
          modal={modal}
        >
          <ProductSummary
            productPrice={'50'}
            discountAmount={'5'}
            back={back}
            onSubmit={submitProduct}
          />
        </Layout.Content>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PromotionSetPage);
