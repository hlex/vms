import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// ======================================================
// Components
// ======================================================
import { ProductSummary, PromotionSetTitle } from '../../../components';
import Layout from '../../Layout';
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
    productPrice: OrderSelector.getPromotionSetPrice(state.order),
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
    back: PropTypes.func.isRequired,
    submitPromotionSet: PropTypes.func.isRequired,
    productPrice: PropTypes.number.isRequired,
  }

  render() {
    console.log('PromotionSetPage', this.props);
    const { baseURL, back, submitPromotionSet, productPrice } = this.props;
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
            discountAmount={0}
            back={back}
            onSubmit={submitPromotionSet}
          />
          <div className="action-back">
            <a
              className="button purple M"
              onClick={back}
            >
              <i className="fa fa-chevron-left" />ย้อนกลับ
            </a>
          </div>
        </Layout.Content>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PromotionSetPage);
